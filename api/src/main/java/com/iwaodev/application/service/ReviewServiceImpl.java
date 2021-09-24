package com.iwaodev.application.service;

import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import com.iwaodev.application.dto.review.FindReviewDTO;
import com.iwaodev.application.dto.review.ReviewDTO;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.ReviewRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.ReviewService;
import com.iwaodev.application.mapper.ReviewMapper;
import com.iwaodev.application.specification.factory.ReviewSpecificationFactory;
import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.domain.review.ReviewSortEnum;
import com.iwaodev.domain.review.event.NewReviewWasSubmittedEvent;
import com.iwaodev.domain.review.event.ReviewWasUpdatedByMemberEvent;
import com.iwaodev.domain.review.event.ReviewWasVerifiedByAdminEvent;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.review.ReviewCriteria;
import com.iwaodev.ui.criteria.review.ReviewQueryStringCriteria;

import com.iwaodev.util.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

  private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);

  @Autowired
  private ReviewRepository repository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ReviewSpecificationFactory specificationFactory;

  @Autowired
  private ApplicationEventPublisher publisher;

  @Autowired
  private CurAuthentication curAuthentication;

  @Autowired
  private HttpServletRequest httpServletRequest;

  public Page<ReviewDTO> getAll(ReviewQueryStringCriteria criteria, Integer page, Integer limit, ReviewSortEnum sort) {

    // get result with repository
    // and map entity to dto with MapStruct
    return this.repository
        .findAllToAvoidNPlusOne(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
        .map(new Function<Review, ReviewDTO>() {

          @Override
          public ReviewDTO apply(Review review) {
            return ReviewMapper.INSTANCE.toReviewDTO(review);
          }

        });
  }

  private Sort getSort(ReviewSortEnum sortEnum) {

    if (sortEnum == ReviewSortEnum.DATE_DESC) {
      return Sort.by("createdAt").descending();
    } else if (sortEnum == ReviewSortEnum.DATE_ASC) {
      return Sort.by("createdAt").ascending();
    } else if (sortEnum == ReviewSortEnum.REVIEW_POINT_ASC) {
      return Sort.by("reviewPoint").ascending();
    } else {
      return Sort.by("reviewPoint").descending();
    }
  }

  @Override
  public ReviewDTO getById(Long id) throws Exception {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<Review> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isPresent()) {
      logger.debug("the given review does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given review does not exist.");
    }

    // map entity to dto
    return ReviewMapper.INSTANCE.toReviewDTO(targetEntityOption.get());
  }

  @Override
  public ReviewDTO create(ReviewCriteria criteria) throws Exception {

    // if the review already exist, reject. (must be unique about user_id &
    // product_id combination)
    if (this.repository.isExist(criteria.getUserId(), criteria.getProductId()).isPresent()) {
      // user not found so return error
      logger.debug("the given review already exist.");
      throw new AppException(HttpStatus.CONFLICT, "the given review already exist.");
    }

    Optional<User> customerOption = this.userRepository.findById(criteria.getUserId());

    if (!customerOption.isPresent()) {
      // user not found so return error
      logger.debug("the given customer does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given customer does not exist.");
    }

    // the customer
    User customer = customerOption.get();

    Optional<Product> productOption = this.productRepository.findById(criteria.getProductId());

    if (!productOption.isPresent()) {
      // user not found so return error
      logger.debug("the given product does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    }

    // the product
    Product product = productOption.get();

    // map criteria to entity
    Review newEntity = ReviewMapper.INSTANCE.toReviewEntityFromReviewCriteria(criteria);

    newEntity.setUser(customer);
    newEntity.setProduct(product);
    newEntity.setIsVerified(false); // always false when creating

    // save it
    Review savedEntity = this.repository.save(newEntity);

    // publish event
    // I leave this event here for any future reference.
    // actually, this add a notification to teh admin
    this.publisher.publishEvent(new NewReviewWasSubmittedEvent(this, savedEntity));
    // this send review-was-updated-email to admin
    this.publisher.publishEvent(new ReviewWasUpdatedByMemberEvent(this, savedEntity));

    // map entity to dto and return it.
    return ReviewMapper.INSTANCE.toReviewDTO(savedEntity);
  }

  @Override
  public ReviewDTO update(ReviewCriteria criteria, Long id) throws Exception {

    Optional<Review> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isPresent()) {
      logger.debug("the given review does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given review does not exist.");
    }

    Review oldEntity = targetEntityOption.get();

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(oldEntity.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    oldEntity.setReviewTitle(criteria.getReviewTitle());
    oldEntity.setReviewDescription(criteria.getReviewDescription());
    oldEntity.setReviewPoint(criteria.getReviewPoint());
    if (criteria.getNote() != null && !criteria.getNote().isEmpty()) {
      oldEntity.setNote(criteria.getNote());
    }
    if (criteria.getIsVerified() != null) {
      oldEntity.setIsVerified(criteria.getIsVerified());
    }

    Review updatedEntity;
    try {
      // don't forget flush otherwise version number is updated.
      updatedEntity = this.repository.saveAndFlush(oldEntity);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    if (updatedEntity.getIsVerified()) {
      this.publisher.publishEvent(new ReviewWasVerifiedByAdminEvent(this, updatedEntity));
    }

    //  getRole return "ROLE_XXXX" so use 'contains' rather than 'equals'
    if (this.curAuthentication.getRole().contains(UserTypeEnum.MEMBER)) {
      this.publisher.publishEvent(new ReviewWasUpdatedByMemberEvent(this, updatedEntity));
    }

    return ReviewMapper.INSTANCE.toReviewDTO(updatedEntity);

  }

  @Override
  public void delete(Long id) throws Exception {

    Optional<Review> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isPresent()) {
      Review targetEntity = targetEntityOption.get();
      // version check for concurrency update
      String receivedVersion = this.httpServletRequest.getHeader("If-Match");
      if (receivedVersion == null || receivedVersion.isEmpty()) {
        throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
      }
      if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
        throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
      };

      try {
        this.repository.delete(targetEntity);
      } catch (OptimisticLockingFailureException ex) {
        throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
      }
    }
  }

  @Override
  public FindReviewDTO findByUserIdAndProductId(UUID userId, UUID productId) throws Exception {

    User user = this.userRepository.findById(userId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "user not found."));

    Product product = this.productRepository.findById(productId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "product not found."));

    Optional<Review> reviewOption = this.repository.isExist(userId, productId);

    FindReviewDTO findReviewDTO = new FindReviewDTO();

    if (reviewOption.isPresent()) {
      findReviewDTO.setIsExist(true);
      findReviewDTO.setReview(ReviewMapper.INSTANCE.toReviewDTO(reviewOption.get()));
      // set review.version to findReviewDTO.version just in case
      findReviewDTO.setVersion(reviewOption.get().getVersion());
    } else {
      findReviewDTO.setIsExist(false);
    }

    findReviewDTO.setProduct(ReviewMapper.INSTANCE.toProductDTO(product));
    findReviewDTO.setUser(ReviewMapper.INSTANCE.toUserDTO(user));

    return findReviewDTO;

  }
}
