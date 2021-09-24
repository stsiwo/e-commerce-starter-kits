package com.iwaodev.application.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.product.ProductVariantDTO;
import com.iwaodev.application.dto.wishlistItem.WishlistItemDTO;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.irepository.WishlistItemRepository;
import com.iwaodev.application.iservice.UserWishlistItemService;
import com.iwaodev.application.mapper.ProductMapper;
import com.iwaodev.application.mapper.WishlistItemMapper;
import com.iwaodev.application.specification.factory.WishlistItemSpecificationFactory;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.domain.wishlistItem.event.MovedWishlistItemToCartItemEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.*;
import com.iwaodev.ui.criteria.wishlistItem.WishlistItemQueryStringCriteria;

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
public class UserWishlistItemServiceImpl implements UserWishlistItemService {

  private static final Logger logger = LoggerFactory.getLogger(UserWishlistItemServiceImpl.class);

  @Autowired
  private WishlistItemRepository wishlistItemRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private WishlistItemSpecificationFactory specificationFactory;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ApplicationEventPublisher publisher;

  @Autowired
  private HttpServletRequest httpServletRequest;

  public Page<WishlistItemDTO> getAll(WishlistItemQueryStringCriteria criteria, Integer page, Integer limit,
      ProductSortEnum sort) throws Exception {

    return this.wishlistItemRepository
        .findAllToAvoidNPlusOne(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
        .map(new Function<WishlistItem, WishlistItemDTO>() {

          @Override
          public WishlistItemDTO apply(WishlistItem wishlistItem) {
            ProductVariant targetVariant = wishlistItem.getVariant();
            WishlistItemDTO tempWishlistItemDTO = WishlistItemMapper.INSTANCE.toWishlistItemDTO(wishlistItem);
            /**
             * what this is doing: filtering variants.
             *
             * - we only need to target variant which is put in the wishlistItem by user.
             * other variants are unrelated so remove.
             *
             * - #TODO: there might be better way to do this like ('join fetch' in @Query)
             * so that we can delegate the filter logic to repository. - but i don't know
             * how to do this. so if you come up some idea, please refactor.
             **/

            // filter target variant and remove other unrelated variant
            List<ProductVariantDTO> targetVariantDTO = tempWishlistItemDTO.getProduct().getVariants().stream()
                .filter(variant -> {
                  return variant.getVariantId().equals(targetVariant.getVariantId());
                }).collect(Collectors.toList());

            tempWishlistItemDTO.getProduct().setVariants(targetVariantDTO);
            return tempWishlistItemDTO;
          }
        });
  }

  private Sort getSort(ProductSortEnum sortEnum) {

    if (sortEnum == ProductSortEnum.DATE_DESC) {
      return Sort.by("createdAt").descending();
    } else if (sortEnum == ProductSortEnum.DATE_ASC) {
      return Sort.by("createdAt").ascending();
    } else if (sortEnum == ProductSortEnum.ALPHABETIC_ASC) {
      return Sort.by("variant.product.productName").ascending();
    } else if (sortEnum == ProductSortEnum.ALPHABETIC_DESC) {
      return Sort.by("variant.product.productName").descending();
    } else if (sortEnum == ProductSortEnum.PRICE_ASC) {
      return Sort.by("variant.regularPrice").ascending();
    } else {
      return Sort.by("variant.regularPrice").descending();
    }
  }

  @Override
  public WishlistItemDTO add(UUID userId, Long variantId) throws Exception {

    // check user exists
    Optional<User> targetUserOption = this.userRepository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // check user exists
    Optional<Product> targetProductOption = this.productRepository.findByVariantId(variantId);

    if (!targetProductOption.isPresent()) {
      logger.debug("the given product or its variant does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given product or its variant does not exist.");
    }

    // check cart item already exist
    Optional<WishlistItem> option = this.wishlistItemRepository.findByVariantIdAndUserId(variantId, userId);

    if (option.isPresent()) {
      logger.debug("target wishlist item already exist");
      throw new AppException(HttpStatus.CONFLICT, "target wishlist item already exist.");
    }

    WishlistItem newWishlistItem = new WishlistItem();
    newWishlistItem.setUser(targetUserOption.get());
    newWishlistItem.setVariant(targetProductOption.get().findVariantById(variantId));

    // save
    WishlistItem savedWishlistItem = this.wishlistItemRepository.saveAndFlush(newWishlistItem);

    // prep dto
    ProductDTO productDTO = ProductMapper.INSTANCE.toProductDTO(targetProductOption.get());

    /**
     * what this is doing: filtering variants.
     *
     * - we only need to target variant which is put in the wishlistItem by user.
     * other variants are unrelated so remove.
     *
     * - #TODO: there might be better way to do this like ('join fetch' in @Query)
     * so that we can delegate the filter logic to repository. - but i don't know
     * how to do this. so if you come up some idea, please refactor.
     **/

    // filter target variant and remove other unrelated variant
    List<ProductVariantDTO> targetVariantDTO = productDTO.getVariants().stream().filter(variant -> {
      return variant.getVariantId().equals(variantId);
    }).collect(Collectors.toList());

    productDTO.setVariants(targetVariantDTO);

    // prep return dto
    WishlistItemDTO wishlistDto = WishlistItemMapper.INSTANCE.toWishlistItemDTO(savedWishlistItem);

    // override to filtered product
    wishlistDto.setProduct(productDTO);

    return wishlistDto;
  }

  @Override
  public void moveToCart(UUID userId, Long wishlistItemId) throws Exception {

    // check wishlistItem exists
    Optional<WishlistItem> targetWishlistItemOption = this.wishlistItemRepository.findById(wishlistItemId);

    if (!targetWishlistItemOption.isPresent()) {
      logger.debug("the target wishlist item does not exist.");
      throw new AppException(HttpStatus.NOT_FOUND, "the target wishlist item does not exist.");
    }

    WishlistItem wishlistItem = targetWishlistItemOption.get();

    // if this variant does not have stock return bad_request.
    if (this.productRepository.isOutOfStock(wishlistItem.getVariant().getVariantId())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the variant does not have any stock.");
    }

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(wishlistItem.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    Long variantId = wishlistItem.getVariant().getVariantId();

    try {
      this.remove(wishlistItemId);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }
    this.publisher.publishEvent(new MovedWishlistItemToCartItemEvent(this, userId, variantId));

  }

  @Override
  public void remove(Long wishlistItemItemId) throws Exception {

    // check user exists
    Optional<WishlistItem> targetWishlistItemOption = this.wishlistItemRepository.findById(wishlistItemItemId);

    if (targetWishlistItemOption.isPresent()) {

      WishlistItem targetEntity = targetWishlistItemOption.get();

      // version check for concurrency update
      String receivedVersion = this.httpServletRequest.getHeader("If-Match");
      if (receivedVersion == null || receivedVersion.isEmpty()) {
        throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
      }
      if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
        throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
      };

      try {
        this.wishlistItemRepository.delete(targetWishlistItemOption.get());
      } catch (OptimisticLockingFailureException ex) {
        throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
      }

      // #TODO: might be better to return the rest of wishlistItem items of this user
      // (after remvoed this paticular item)
      // but it's up to requirement
    }
  }

  @Override
  public void deleteAll(UUID userId) throws Exception {

    // #TODO: N + 1 problem

    // check user exists
    List<WishlistItem> targetWishlistItemOption = this.wishlistItemRepository.getAllByUserId(userId);

    if (!targetWishlistItemOption.isEmpty()) {
      this.wishlistItemRepository.deleteAll(targetWishlistItemOption);

    }
  }

}
