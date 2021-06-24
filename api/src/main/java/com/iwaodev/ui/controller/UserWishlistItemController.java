package com.iwaodev.ui.controller;

import java.util.UUID;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.wishlistItem.WishlistItemDTO;
import com.iwaodev.application.iservice.UserWishlistItemService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.ui.criteria.wishlistItem.WishlistItemCriteria;
import com.iwaodev.ui.criteria.wishlistItem.WishlistItemQueryStringCriteria;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserWishlistItemController {

  private static final Logger logger = LoggerFactory.getLogger(UserWishlistItemController.class);

  @Autowired
  private UserWishlistItemService service;

  // get all products inside the wishlistItem of a given user
  @GetMapping("/users/{userId}/wishlistItems")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<Page<WishlistItemDTO>> get(
      @PathVariable(value = "userId") UUID userId,
      WishlistItemQueryStringCriteria criteria,
      @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit,
      @RequestParam(value = "sort", required = false, defaultValue = "DATE_DESC") ProductSortEnum sort,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    logger.info("product controller cur thread name: " + Thread.currentThread().getName());

    criteria.setUserId(userId);

    return new ResponseEntity<>(this.service.getAll(criteria, page, limit, sort), HttpStatus.OK);
  }

  // add a new wishlistItem item
  @PostMapping("/users/{userId}/wishlistItems")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<WishlistItemDTO> post(
      @PathVariable(value = "userId") UUID userId,
      @Valid @RequestBody WishlistItemCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    logger.info("start handling at /users/{userId}/wishlistItem POST");
    return new ResponseEntity<>(this.service.add(userId, criteria.getVariantId()), HttpStatus.OK);
  }

  // move to cart method (PATCH)
  @PatchMapping("/users/{userId}/wishlistItems/{wishlistItemId}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<BaseResponse> patch(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "wishlistItemId") @NotNull Long wishlistItemId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    this.service.moveToCart(userId, wishlistItemId);

    return new ResponseEntity<>(new BaseResponse("moved to cart successfully."), HttpStatus.OK);
  }

  // remove a given item from the wishlistItem 
  @DeleteMapping("/users/{userId}/wishlistItems/{wishlistItemId}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<BaseResponse> remove(
      @PathVariable(value = "userId") @NotNull UUID userId,
      @PathVariable(value = "wishlistItemId") @NotNull Long wishlistItemId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    logger.info("start handling at /users/{userId}/wishlistItem/{wishlistItemId} DELETE");
    this.service.remove(wishlistItemId);
    return new ResponseEntity<>(new BaseResponse("successfully deleted."), HttpStatus.OK);
  }

  // remove all items from the wishlistItem of a given user
  @DeleteMapping("/users/{userId}/wishlistItems")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<BaseResponse> deleteAll(
      @PathVariable(value = "userId") @NotNull UUID userId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    logger.info("start handling at /users/{userId}/wishlistItem/{wishlistItemId} DELETE");
    this.service.deleteAll(userId);
    return new ResponseEntity<>(new BaseResponse("successfully deleted."), HttpStatus.OK);
  }
}

