package com.iwaodev.ui.controller;

import java.util.List;
import java.util.UUID;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.iwaodev.application.dto.cartItem.CartItemDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.iservice.UserCartItemService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.ui.criteria.cartItem.CartItemCriteria;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserCartItemController {

  private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

  @Autowired
  private UserCartItemService service;

  // get all products inside the cartItem of a given user
  @GetMapping("/users/{userId}/cartItems")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<List<CartItemDTO>> get(
      @PathVariable(value = "userId") UUID userId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) {

    logger.info("product controller cur thread name: " + Thread.currentThread().getName());

    return new ResponseEntity<>(this.service.getAll(userId), HttpStatus.OK);
  }

  //@GetMapping("/products/{id}")
  //public ResponseEntity<ProductDTO> getWithId(@PathVariable(value = "id") UUID id) {
  //  return new ResponseEntity<>(this.service.getById(id), HttpStatus.OK);
  //}

  /**
   * guest user's cart info is handled by client side.
   *
   * use redux with persistece (sesssion storage/local storage).
   *
   **/
  // add a new cartItem item
  @PostMapping("/users/{userId}/cartItems")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<CartItemDTO> post(
      @PathVariable(value = "userId") UUID userId,
      @Valid @RequestBody CartItemCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) {
    return new ResponseEntity<>(this.service.add(criteria), HttpStatus.OK);
  }

  // update/replace existing cartItem item with a new one 
  @PutMapping("/users/{userId}/cartItems/{cartItemId}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<CartItemDTO> put(
      @PathVariable(value = "userId") UUID userId,
      @PathVariable(value = "cartItemId") @NotNull Long cartItemId,
      @Valid @RequestBody CartItemCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) {

    if (criteria.getCartItemId() == null) {
      criteria.setCartItemId(cartItemId);
    }

    return new ResponseEntity<>(this.service.update(criteria), HttpStatus.OK);
  }

  // remove a given item from the cartItem 
  @DeleteMapping("/users/{userId}/cartItems/{cartItemId}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<BaseResponse> remove(
      @PathVariable(value = "userId") @NotNull UUID userId,
      @PathVariable(value = "cartItemId") @NotNull Long cartItemId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) {
    logger.info("start handling at /users/{userId}/cartItem/{cartItemId} DELETE");
    this.service.remove(cartItemId);
    return new ResponseEntity<>(new BaseResponse("successfully deleted."), HttpStatus.OK);
  }

  // remove all items from the cartItem of a given user
  @DeleteMapping("/users/{userId}/cartItems")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #userId") 
  public ResponseEntity<BaseResponse> deleteAll(
      @PathVariable(value = "userId") @NotNull UUID userId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) {
    logger.info("start handling at /users/{userId}/cartItems/{cartItemId} DELETE");
    this.service.deleteAll(userId);
    return new ResponseEntity<>(new BaseResponse("successfully deleted."), HttpStatus.OK);
  }
}

