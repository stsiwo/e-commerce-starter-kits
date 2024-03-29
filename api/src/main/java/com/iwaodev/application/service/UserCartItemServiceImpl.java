package com.iwaodev.application.service;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.cartItem.CartItemDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.product.ProductVariantDTO;
import com.iwaodev.application.irepository.CartItemRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.UserCartItemService;
import com.iwaodev.application.mapper.CartItemMapper;
import com.iwaodev.application.mapper.ProductMapper;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.infrastructure.model.*;
import com.iwaodev.ui.criteria.cartItem.CartItemCriteria;

import com.iwaodev.util.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.iwaodev.exception.AppException;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class UserCartItemServiceImpl implements UserCartItemService {

  private static final Logger logger = LoggerFactory.getLogger(UserCartItemServiceImpl.class);

  @Autowired
  private HttpServletRequest httpServletRequest;

  @Autowired
  private CartItemRepository cartItemRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;

  public List<CartItemDTO> getAll(UUID userId) throws Exception {

    List<CartItem> cartItems = this.cartItemRepository.getAllByUserId(userId);

    return cartItems.stream().map(new Function<CartItem, CartItemDTO>() {

      @Override
      public CartItemDTO apply(CartItem cartItem) {

        CartItemDTO cartItemDTO = CartItemMapper.INSTANCE.toCartItemDTO(cartItem);

        /**
         * what this is doing: filtering variants.
         *
         * - we only need to target variant which is put in the cartItem by user. other
         * variants are unrelated so remove.
         *
         * - #TODO: there might be better way to do this like ('join fetch' in @Query)
         * so that we can delegate the filter logic to repository. - but i don't know
         * how to do this. so if you come up some idea, please refactor.
         *
         *  solution: use @Filter annotation. see note.md more details.
         **/

        // filter target variant and remove other unrelated variant
        List<ProductVariantDTO> targetVariantDTO = cartItemDTO.getProduct().getVariants().stream().filter(variant -> {
          return variant.getVariantId().equals(cartItem.getVariant().getVariantId());
        }).collect(Collectors.toList());

        cartItemDTO.getProduct().setVariants(targetVariantDTO);

        return cartItemDTO;
      }
    }).collect(Collectors.toList());
  }

  private Sort getSort(ProductSortEnum sortEnum) {

    if (sortEnum == ProductSortEnum.DATE_DESC) {
      return Sort.by("createdAt").descending();
    } else if (sortEnum == ProductSortEnum.DATE_ASC) {
      return Sort.by("createdAt").ascending();
    } else if (sortEnum == ProductSortEnum.ALPHABETIC_ASC) {
      return Sort.by("productName").ascending();
    } else if (sortEnum == ProductSortEnum.ALPHABETIC_DESC) {
      return Sort.by("productName").descending();
    } else if (sortEnum == ProductSortEnum.PRICE_ASC) {
      return Sort.by("productBaseUnitPrice").ascending();
    } else {
      return Sort.by("productBaseUnitPrice").descending();
    }
  }

  @Override
  public CartItemDTO add(CartItemCriteria criteria) throws Exception {

    // check user exists
    Optional<User> targetUserOption = this.userRepository.findById(criteria.getUserId());

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // check user exists
    Optional<Product> targetProductOption = this.productRepository.findByVariantId(criteria.getVariantId());

    if (!targetProductOption.isPresent()) {
      logger.debug("the given product or its variant does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given product or its variant does not exist.");
    }

    // check cart item already exist
    Optional<CartItem> option = this.cartItemRepository.findByVariantIdAndUserId(criteria.getVariantId(), criteria.getUserId());

    if (option.isPresent()) {
      logger.debug("target cart item already exist");
      throw new AppException(HttpStatus.CONFLICT, "target cart item already exist.");
    }

    // check exceed max 5
    if (targetUserOption.get().getCartItems().size() == 5) {
      throw new AppException(HttpStatus.BAD_REQUEST, "cart items reaches max size (5 items).");
    }

    CartItem newCartItem = new CartItem();
    newCartItem.setUser(targetUserOption.get());
    newCartItem.setVariant(targetProductOption.get().findVariantById(criteria.getVariantId()));
    newCartItem.setQuantity(criteria.getQuantity());
    if (criteria.getIsSelected() != null) {
      newCartItem.setIsSelected(criteria.getIsSelected());
    }

    // save
    CartItem savedCartItem;
    try {
      savedCartItem = this.cartItemRepository.saveAndFlush(newCartItem);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }


    CartItemDTO cartDTO = CartItemMapper.INSTANCE.toCartItemDTO(savedCartItem);

    /**
     * maybe we can use 'custom mapstruct' (e.g., @Named & 'qualifiedName' )
     **/
    // filter target variant and remove other unrelated variant
    List<ProductVariantDTO> targetVariantDTO = cartDTO.getProduct().getVariants().stream().filter(variant -> {
      return variant.getVariantId().equals(criteria.getVariantId());
    }).collect(Collectors.toList());

    cartDTO.getProduct().setVariants(targetVariantDTO);

    return cartDTO;
  }

  @Override
  public CartItemDTO update(CartItemCriteria criteria) throws Exception {

    // check user exists
    Optional<CartItem> targetCartItemOption = this.cartItemRepository.findById(criteria.getCartItemId());

    if (!targetCartItemOption.isPresent()) {
      logger.debug("the given cart item does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given cart item does not exist.");
    }

    CartItem targetEntity = targetCartItemOption.get();

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    if (criteria.getIsSelected() != null) {
      targetEntity.setIsSelected(criteria.getIsSelected());
    }

    if (criteria.getQuantity() != null) {
      targetEntity.setQuantity(criteria.getQuantity());
    }

    try {
      // don't forget flush otherwise version number is updated.
      this.cartItemRepository.saveAndFlush(targetEntity);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    CartItemDTO cartDTO = CartItemMapper.INSTANCE.toCartItemDTO(targetEntity);

    /**
     * maybe we can use 'custom mapstruct' (e.g., @Named & 'qualifiedName' )
     **/
    // filter target variant and remove other unrelated variant
    List<ProductVariantDTO> targetVariantDTO = cartDTO.getProduct().getVariants().stream().filter(variant -> {
      return variant.getVariantId().equals(criteria.getVariantId());
    }).collect(Collectors.toList());

    cartDTO.getProduct().setVariants(targetVariantDTO);

    return cartDTO;
  }

  @Override
  public void remove(Long cartItemId) throws Exception {

    // check user exists
    Optional<CartItem> targetCartItemOption = this.cartItemRepository.findById(cartItemId);

    if (targetCartItemOption.isPresent()) {

      CartItem targetEntity = targetCartItemOption.get();

      // version check for concurrency update
      String receivedVersion = this.httpServletRequest.getHeader("If-Match");
      if (receivedVersion == null || receivedVersion.isEmpty()) {
        throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
      }
      if (!Util.checkETagVersion(targetEntity.getVersion(), receivedVersion)) {
        throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
      };

      try {
        this.cartItemRepository.delete(targetEntity);
      } catch (OptimisticLockingFailureException ex) {
        throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
      }

      // #TODO: might be better to return the rest of cartItem items of this user
      // (after remvoed this paticular item)
      // but it's up to requirement
    }
  }

  @Override
  public void deleteAll(UUID userId) throws Exception {

    // #TODO: N + 1 problem

    // #TODO: how to deal with version and bulk delete.

    // check user exists
    List<CartItem> targetCartItemOption = this.cartItemRepository.getAllByUserId(userId);

    if (!targetCartItemOption.isEmpty()) {
      this.cartItemRepository.deleteAll(targetCartItemOption);
    }
  }

}
