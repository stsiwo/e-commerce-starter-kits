package com.iwaodev.ui.controller;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.review.FindReviewDTO;
import com.iwaodev.application.dto.review.ReviewDTO;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.application.iservice.ReviewService;
import com.iwaodev.application.iservice.UserService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.config.service.CookieService;
import com.iwaodev.domain.order.OrderSortEnum;
import com.iwaodev.domain.user.UserSortEnum;
import com.iwaodev.ui.criteria.user.UserCriteria;
import com.iwaodev.ui.criteria.user.UserDeleteTempCriteria;
import com.iwaodev.ui.criteria.user.UserQueryStringCriteria;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import com.iwaodev.ui.criteria.order.OrderQueryStringCriteria;
import com.iwaodev.ui.criteria.review.ReviewCriteria;
import com.iwaodev.ui.criteria.user.UserStatusCriteria;
import com.iwaodev.ui.response.BaseResponse;
import com.iwaodev.ui.response.ImagePathResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class UserController {

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);

  private UserService service;

  private OrderService orderService;

  @Autowired
  private ReviewService reviewService;

  @Autowired
  private CookieService cookieService;

  @Autowired
  public UserController(UserService service, OrderService orderService) {
    this.service = service;
    this.orderService = orderService;
  }

  @GetMapping("/users")
  @Secured("ROLE_ADMIN")
  public ResponseEntity<Page<UserDTO>> get(
      @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
      @RequestParam(value = "sort", required = false, defaultValue = "DATE_DESC") UserSortEnum sort,
      UserQueryStringCriteria criteria) throws Exception {

    return new ResponseEntity<>(this.service.getAll(criteria, page, limit, sort), HttpStatus.OK);
  }

  @GetMapping("/users/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
                                                                     // user's data
  public ResponseEntity<UserDTO> getWithId(@PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal SpringSecurityUser authUser) throws Exception {

    UserDTO results = this.service.getById(id);

    return ResponseEntity
            .ok()
            .eTag("\"" + results.getVersion() + "\"")
            .body(results);
  }

  // not post since /signup

  @PutMapping("/users/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
                                                                     // user's data
  public ResponseEntity<UserDTO> updateWithId(@PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal User authUser, @Valid @RequestBody UserCriteria criteria) throws Exception {

    UserDTO results = this.service.update(criteria, id);

    return ResponseEntity
            .ok()
            .eTag("\"" + results.getVersion() + "\"")
            .body(results);
  }

  @PatchMapping("/users/{id}/status")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // to prevent a member from accessing another
                                                                     // user's data
  public ResponseEntity<UserDTO> patchStatus(@PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal User authUser, @Valid @RequestBody UserStatusCriteria criteria) throws Exception {

    UserDTO results = this.service.updateStatus(criteria);

    return ResponseEntity
            .ok()
            .eTag("\"" + results.getVersion() + "\"")
            .body(results);
  }

  @PatchMapping("/users/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
                                                                     // user's data
  public ResponseEntity<BaseResponse> tempDeleteWithId(
      @PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal User authUser, 
      @Valid @RequestBody UserDeleteTempCriteria criteria,
      HttpServletRequest request, 
      HttpServletResponse response
      ) throws Exception {

    this.service.tempDelete(criteria, id);

    // delete cookie
    this.cookieService.eraseCookies(request, response);

    return new ResponseEntity<>(new BaseResponse("successfuly deleted temporarly."), HttpStatus.OK);
  }

  @DeleteMapping("/users/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // to prevent a member from accessing another
                                         // user's data
  public ResponseEntity<BaseResponse> deleteWithId(@PathVariable(value = "id") UUID id) throws Exception {

    this.service.delete(id);
    return new ResponseEntity<>(new BaseResponse("successfuly deleted."), HttpStatus.OK);
  }

  /**
   * avatar image.
   **/

  // user avatar image
  @RequestMapping(value = "/users/{id}/avatar-image", method = RequestMethod.POST, consumes = {"multipart/form-data"})
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<UserDTO> uploadAvatarImage(@PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal SpringSecurityUser authUser, @RequestParam("avatarImage") MultipartFile file) throws Exception {

    UserDTO results = this.service.uploadAvatarImage(id, file);
    return ResponseEntity
            .ok()
            .eTag("\"" + results.getVersion() + "\"")
            .body(results);
  }

  // delete user avatar image
  @DeleteMapping("/users/{id}/avatar-image")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
                                                                     // user's data
  public ResponseEntity<UserDTO> deleteAvatarImage(@PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal SpringSecurityUser authUser) throws Exception {
    UserDTO results = this.service.removeAvatarImage(id);

    return ResponseEntity
            .ok()
            .eTag("\"" + results.getVersion() + "\"")
            .body(results);
  }

  // get user avatar image
  @GetMapping(value = "/domain/users/{id}/avatar-image/{imageName}")
  public ResponseEntity<byte[]> getAvatarImage(@PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal SpringSecurityUser authUser, @PathVariable(value = "imageName") String imageName,
      HttpServletResponse response) throws Exception {

    // disable content sniffing to prevent content sniffing exploit
    response.addHeader("X-Content-Type-Options", "nosniff");
    // cache this image for one year
    response.addHeader("Cache-Control", "max-age=31536000, must-revalidate, no-transform");

    return new ResponseEntity<byte[]>(this.service.getAvatarImage(id, imageName), HttpStatus.OK);
  }

  // get orders of this member
  @GetMapping(value = "/users/{id}/orders")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<Page<OrderDTO>> getOrders(@PathVariable(value = "id") UUID id,
      @AuthenticationPrincipal SpringSecurityUser authUser,
      @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
      @RequestParam(value = "sort", required = false, defaultValue = "DATE_DESC") OrderSortEnum sort,
      OrderQueryStringCriteria criteria) throws Exception {

    return new ResponseEntity<>(this.orderService.getAllByUserId(id, criteria, page, limit, sort), HttpStatus.OK);
  }

  /**
   * get a single order
   **/
  @GetMapping("/users/{id}/orders/{orderId}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<OrderDTO> getWithId(@PathVariable(value = "id") UUID id,
      @PathVariable(value = "orderId") UUID orderId, @AuthenticationPrincipal SpringSecurityUser authUser) throws Exception {
    return new ResponseEntity<>(this.orderService.getByIdAndUserId(orderId, id), HttpStatus.OK);
  }

  /**
   * add an order event.
   *
   * members can only add "Request Return" or "Request Cancel" with elability
   * condition.
   * 
   * Request Cancel: the member can cancel the order ONLY IF the order hasn't
   * shipped yet. - if it already shipped, suggest the member to do "Request
   * Return".
   *
   * Request Return: the member can return the order ONLY IF it hasn't passed 30
   * days (make sure the return policy) since the delivery date.
   *
   **/
  @PostMapping(value = "/users/{id}/orders/{orderId}/events")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<OrderDTO> addOrder(@PathVariable(value = "id") UUID id,
      @PathVariable(value = "orderId") UUID orderId, @Valid @RequestBody OrderEventCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser) throws Exception {

    OrderDTO results = this.orderService.addOrderEventByMember(orderId, criteria);

    return ResponseEntity
            .ok()
            .eTag("\"" + results.getVersion() + "\"")
            .body(results);
  }

  /**
   * find review of this user with productId
   *
   * - use to manage a review of a member user
   *
   * - need to return its user and product if the review does not exist.
   *
   **/
  @GetMapping(value = "/users/{id}/review")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<FindReviewDTO> findReviewByUserIdAndProductId(@PathVariable(value = "id") UUID id,
      @RequestParam(value = "productId", required = true) UUID productId,
      @AuthenticationPrincipal SpringSecurityUser authUser) throws Exception {

    FindReviewDTO results = this.reviewService.findByUserIdAndProductId(id, productId);

    // if review exists (whose version is assigned to findReviewDTO.version), return response with eTag
    if (results.getVersion() == null) {
      return ResponseEntity
              .ok()
              .body(results);
    } else {
      return ResponseEntity
              .ok()
              .eTag("\"" + results.getVersion() + "\"")
              .body(results);
    }

  }

  /**
   * create/update review
   * 
   **/
  // create a new review
  @RequestMapping(value = "/users/{id}/reviews", method = RequestMethod.POST)
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<ReviewDTO> post(
      @PathVariable(value = "id") UUID id,
      @Valid @RequestBody ReviewCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    ReviewDTO results = this.reviewService.create(criteria);

    return ResponseEntity
            .ok()
            .eTag("\"" + results.getVersion() + "\"")
            .body(results);
  }

  // update/replace a new review
  @RequestMapping(value = "/users/{id}/reviews/{reviewId}", method = RequestMethod.PUT)
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<ReviewDTO> put(
      @PathVariable(value = "id") UUID id,
      @PathVariable(value = "reviewId") Long reviewId,
      @Valid @RequestBody ReviewCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {

    ReviewDTO results = this.reviewService.update(criteria, reviewId);

    return ResponseEntity
            .ok()
            .eTag("\"" + results.getVersion() + "\"")
            .body(results);
  }

  // delete a new review
  @DeleteMapping("/users/{id}/reviews/{reviewId}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to prevent a member from accessing another
  public ResponseEntity<BaseResponse> delete(
      @PathVariable(value = "id") UUID id,
      @PathVariable(value = "reviewId") Long reviewId,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    this.reviewService.delete(reviewId);
    return new ResponseEntity<>(new BaseResponse("successfuly deleted."), HttpStatus.OK);
  }
}
