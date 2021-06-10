package com.iwaodev.application.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.review.ReviewDTO;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.ReviewRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.FileService;
import com.iwaodev.application.iservice.ProductService;
import com.iwaodev.application.iservice.ReviewService;
import com.iwaodev.application.mapper.ProductMapper;
import com.iwaodev.application.mapper.ReviewMapper;
import com.iwaodev.application.specification.factory.ProductSpecificationFactory;
import com.iwaodev.application.specification.factory.ReviewSpecificationFactory;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.domain.review.ReviewSortEnum;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductImage;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.ProductCriteria;
import com.iwaodev.ui.criteria.ProductImageCriteria;
import com.iwaodev.ui.criteria.UserDeleteTempCriteria;
import com.iwaodev.ui.criteria.review.ReviewCriteria;
import com.iwaodev.ui.criteria.review.ReviewQueryStringCriteria;
import com.iwaodev.ui.criteria.ProductQueryStringCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

  private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);

  private ReviewRepository repository;

  private UserRepository userRepository;

  private ProductRepository productRepository;

  private ReviewSpecificationFactory specificationFactory;

  @Autowired
  public ReviewServiceImpl(ReviewRepository repository, 
      UserRepository userRepository,
      ProductRepository productRepository,
      ReviewSpecificationFactory specificationFactory
      ) {
    this.repository = repository;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.specificationFactory = specificationFactory;
  }

  public Page<ReviewDTO> getAll(ReviewQueryStringCriteria criteria, Integer page, Integer limit,
      ReviewSortEnum sort) {

    // get result with repository
    // and map entity to dto with MapStruct
    return this.repository
        .findAll(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
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
  public ReviewDTO getById(Long id) {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<Review> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given review does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given review does not exist.");
    }

    // map entity to dto
    return ReviewMapper.INSTANCE.toReviewDTO(targetEntityOption.get());
  }

  @Override
  public ReviewDTO create(ReviewCriteria criteria) {

    // if the review already exist, reject. (must be unique about user_id & product_id combination)
    if (!this.repository.isExist(criteria.getUserId(), criteria.getProductId()).isEmpty()) {
      // user not found so return error
      logger.info("the given review already exist.");
      throw new ResponseStatusException(HttpStatus.CONFLICT, "the given review already exist.");
    }

    Optional<User> customerOption = this.userRepository.findById(criteria.getUserId());

    if (customerOption.isEmpty()) {
      // user not found so return error
      logger.info("the given customer does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given customer does not exist.");
    }

    // the customer
    User customer = customerOption.get();

    Optional<Product> productOption = this.productRepository.findById(criteria.getProductId());

    if (productOption.isEmpty()) {
      // user not found so return error
      logger.info("the given product does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given product does not exist.");
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

    // map entity to dto and return it.
    return ReviewMapper.INSTANCE.toReviewDTO(savedEntity);
  }

  @Override
  public ReviewDTO update(ReviewCriteria criteria, Long id) {

    Optional<Review> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given review does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given review does not exist.");
    }

    Review oldEntity = targetEntityOption.get();

    oldEntity.setReviewTitle(criteria.getReviewTitle());
    oldEntity.setReviewDescription(criteria.getReviewDescription());
    oldEntity.setReviewPoint(criteria.getReviewPoint());
    if (criteria.getNote() != null && !criteria.getNote().isEmpty()) {
      oldEntity.setNote(criteria.getNote());
    }
    if (criteria.getIsVerified() != null) {
      oldEntity.setIsVerified(criteria.getIsVerified());
    }

    Review updatedEntity = this.repository.save(oldEntity);

    return ReviewMapper.INSTANCE.toReviewDTO(updatedEntity);
  }

  @Override
  public void delete(Long id) {

    Optional<Review> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isEmpty()) {
      Review targetEntity = targetEntityOption.get();
      this.repository.delete(targetEntity);
    }
  }
}

