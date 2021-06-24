package com.iwaodev.ui.controller;

import javax.validation.Valid;

import com.iwaodev.application.dto.review.ReviewDTO;
import com.iwaodev.application.iservice.ReviewService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.domain.review.ReviewSortEnum;
import com.iwaodev.ui.criteria.review.ReviewCriteria;
import com.iwaodev.ui.criteria.review.ReviewQueryStringCriteria;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * review logic.
 *
 * pre-conditions:
 *  - only member.
 *  - unique by the combination of user_id & product_id
 *
 * flow:
 * 1. the user purchased a product.
 * 2. the email is sent to the user and click a link to the review management page. (also, the user can visit the order history page and manage its review per product.)
 * 3. the user post his review. (is_verified = false)
 * 4. the admin check the review at admin management page.
 * 5. the admin verify the review (is_verified = true)
 * 6. the review is published.
 * 7. the user can update/delete the review any time he wants.
 * 8. when update the review, is_verified becomes false which requires the admin review the review again to verify again.
 * 9. when delete, delete the review without any consent from the admin.
 *
 *
 **/ 
@RestController
public class ReviewController {

  private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

  @Autowired
  private ReviewService service;

  @GetMapping("/reviews")
  public ResponseEntity<Page<ReviewDTO>> get(
      @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
      @RequestParam(value = "sort", required = false, defaultValue = "DATE_DESC") ReviewSortEnum sort,
      ReviewQueryStringCriteria criteria) throws Exception {

    logger.info("review controller cur thread name: " + Thread.currentThread().getName());

    return new ResponseEntity<>(this.service.getAll(criteria, page, limit, sort), HttpStatus.OK);
  }

  // get by id
  @GetMapping("/reviews/{id}")
  public ResponseEntity<ReviewDTO> getWithId(@PathVariable(value = "id") Long id) throws Exception {
    return new ResponseEntity<>(this.service.getById(id), HttpStatus.OK);
  }

  // create a new review
  @RequestMapping(value = "/reviews", method = RequestMethod.POST)
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #criteria.getUserId()") // to prevent a member from accessing another
  public ResponseEntity<ReviewDTO> post(
      @Valid @RequestBody ReviewCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    logger.info("start handling at /reviews POST");
    return new ResponseEntity<>(this.service.create(criteria), HttpStatus.OK);
  }

  // update/replace a new review
  @RequestMapping(value = "/reviews/{id}", method = RequestMethod.PUT)
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #criteria.getUserId()") // to prevent a member from accessing another
  public ResponseEntity<ReviewDTO> put(
      @PathVariable(value = "id") Long id,
      @Valid @RequestBody ReviewCriteria criteria,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    logger.info("start handling at /reviews PUT");
    return new ResponseEntity<>(this.service.update(criteria, id), HttpStatus.OK);
  }

  /**
   * this does not work for member since no way to authenticate '@PreAuthorize'.
   *
   * it does not have any userId as criteria/input from client.
   *
   * workaround is to move this to userController. 
   *
   **/
  // delete a new review
  @DeleteMapping("/reviews/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #criteria.getUserId()") // to prevent a member from accessing another
  public ResponseEntity<BaseResponse> delete(
      @PathVariable(value = "id") Long id,
      @AuthenticationPrincipal SpringSecurityUser authUser
      ) throws Exception {
    logger.info("start handling at /reviews DELETE");
    this.service.delete(id);
    return new ResponseEntity<>(new BaseResponse("successfuly deleted."), HttpStatus.OK);
  }
}

