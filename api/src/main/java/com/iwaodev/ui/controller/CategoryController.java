package com.iwaodev.ui.controller;

import javax.validation.Valid;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.iservice.CategoryService;
import com.iwaodev.domain.category.CategorySortEnum;
import com.iwaodev.ui.criteria.category.CategoryCriteria;
import com.iwaodev.ui.criteria.category.CategoryQueryStringCriteria;
import com.iwaodev.ui.response.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CategoryController {

  private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

  @Autowired
  private CategoryService service;

  /**
   * if clients want to get all products belongs to a given category, use
   * /category/{id}/products
   **/
  @GetMapping("/categories")
  public ResponseEntity<Page<CategoryDTO>> get(
      @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
      @RequestParam(value = "sort", required = false, defaultValue = "ALPHABETIC_ASC") CategorySortEnum sort,
      CategoryQueryStringCriteria criteria) throws Exception {

    return new ResponseEntity<>(this.service.getAll(criteria, page, limit, sort), HttpStatus.OK);
  }

  // this might not be needed
  // @GetMapping("/categories/{id}")
  // @PreAuthorize("hasRole('ROLE_ADMIN') or #authUser.getId() == #id") // to
  // prevent a member from accessing another
  // // user's data
  // public ResponseEntity<UserDTO> getWithId(@PathVariable(value = "id") UUID id,
  // @AuthenticationPrincipal SpringSecurityUser authUser) {

  // return new ResponseEntity<>(this.service.getById(id), HttpStatus.OK);
  // }

  // create a new category
  @PostMapping("/categories")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<CategoryDTO> post(@Valid @RequestBody CategoryCriteria criteria) throws Exception {

    return new ResponseEntity<>(this.service.create(criteria), HttpStatus.OK);
  }

  // update/replace a new category
  @PutMapping("/categories/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<CategoryDTO> update(@PathVariable(value = "id") Long id,
      @Valid @RequestBody CategoryCriteria criteria) throws Exception {

    return new ResponseEntity<>(this.service.update(criteria, id), HttpStatus.OK);
  }

  @DeleteMapping("/categories/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<BaseResponse> deleteWithId(@PathVariable(value = "id") Long id) throws Exception {
    this.service.delete(id);
    return new ResponseEntity<>(new BaseResponse("successfuly deleted."), HttpStatus.OK);
  }

}
