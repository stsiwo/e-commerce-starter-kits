package com.iwaodev.ui.controller;

import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.productVariant.ProductVariantDTO;
import com.iwaodev.application.iservice.ProductService;
import com.iwaodev.application.iservice.ProductVariantService;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.ui.criteria.product.ProductCriteria;
import com.iwaodev.ui.criteria.product.ProductQueryStringCriteria;
import com.iwaodev.ui.criteria.product.ProductVariantCriteria;
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
import org.springframework.web.multipart.MultipartFile;
import com.iwaodev.exception.AppException;

@RestController
public class ProductVariantController {

  private static final Logger logger = LoggerFactory.getLogger(ProductVariantController.class);

  @Autowired
  private ProductVariantService service;

  // get all variants of given product
  @GetMapping("/products/{productId}/variants")
  public ResponseEntity<List<ProductVariantDTO>> get(
      @PathVariable(value = "productId") UUID productId
      ) throws Exception {
    return new ResponseEntity<>(this.service.getAll(productId), HttpStatus.OK);
  }

  // create a new variant of given product
  @PostMapping("/products/{productId}/variants")
  public ResponseEntity<ProductVariantDTO> post(
      @PathVariable(value = "productId") UUID productId,
      @Valid @RequestBody ProductVariantCriteria criteria
      ) throws Exception {
    return new ResponseEntity<>(this.service.create(productId, criteria), HttpStatus.OK);
  }

  // update/replace a new product
  @PutMapping("/products/{productId}/variants/{variantId}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<ProductVariantDTO> put(
      @PathVariable(value = "productId") UUID productId,
      @PathVariable(value = "variantId") Long variantId,
      @Valid @RequestBody ProductVariantCriteria criteria
      ) throws Exception {
    
    // if criteria.variantId != variantId (path), reject to update.
    if (!variantId.toString().equals(criteria.getVariantId().toString())) {
      logger.debug("variant id in the request body does not match with the one in url.");
      throw new AppException(HttpStatus.BAD_REQUEST, "variant id in the request body does not match with the one in url.");
    }

    return new ResponseEntity<>(this.service.replace(productId, variantId, criteria), HttpStatus.OK);
  }

  // delete a new product
  @DeleteMapping("/products/{productId}/variants/{variantId}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<BaseResponse> delete(
      @PathVariable(value = "productId") UUID productId,
      @PathVariable(value = "variantId") Long variantId
      ) throws Exception {
    this.service.delete(productId, variantId);
    return new ResponseEntity<>(new BaseResponse("successfuly deleted."), HttpStatus.OK);
  }

}
