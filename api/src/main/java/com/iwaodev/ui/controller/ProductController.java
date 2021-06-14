package com.iwaodev.ui.controller;

import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.iservice.ProductService;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.ui.criteria.ProductCriteria;
import com.iwaodev.ui.criteria.ProductQueryStringCriteria;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ProductController {

  private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

  @Autowired
  private ProductService service;

  @GetMapping("/products")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<Page<ProductDTO>> get(
      @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
      @RequestParam(value = "sort", required = false, defaultValue = "DATE_DESC") ProductSortEnum sort,
      ProductQueryStringCriteria criteria) {

    logger.info("product controller cur thread name: " + Thread.currentThread().getName());

    return new ResponseEntity<>(this.service.getAll(criteria, page, limit, sort), HttpStatus.OK);
  }

  @GetMapping("/products/public")
  public ResponseEntity<Page<ProductDTO>> getPublic(
      @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
      @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
      @RequestParam(value = "sort", required = false, defaultValue = "DATE_DESC") ProductSortEnum sort,
      ProductQueryStringCriteria criteria) {

    logger.info("product controller cur thread name: " + Thread.currentThread().getName());

    return new ResponseEntity<>(this.service.getPublicAll(criteria, page, limit, sort), HttpStatus.OK);
  }

  // get by id
  //@GetMapping("/products/{id}")
  //public ResponseEntity<ProductDTO> getWithId(@PathVariable(value = "id") UUID id) {
  //  return new ResponseEntity<>(this.service.getById(id), HttpStatus.OK);
  //}

  // get by path or id
  @GetMapping("/products/{path}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<ProductDTO> getWithPath(@PathVariable(value = "path") String path) {
    return new ResponseEntity<>(this.service.getByPathOrId(path), HttpStatus.OK);
  }
  // get by path or id (public)
  @GetMapping("/products/public/{path}")
  public ResponseEntity<ProductDTO> getPublicWithPath(@PathVariable(value = "path") String path) {
    return new ResponseEntity<>(this.service.getPublicByPathOrId(path), HttpStatus.OK);
  }
  // create a new product
  @RequestMapping(value = "/products", method = RequestMethod.POST, consumes = {"multipart/form-data"})
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<ProductDTO> post(
      @RequestPart(name = "files", required = false) List<MultipartFile> files,
      @Valid @RequestPart("criteria") ProductCriteria criteria
      ) {
    logger.info("start handling at /products POST");
    return new ResponseEntity<>(this.service.create(criteria, files), HttpStatus.OK);
  }

  // update/replace a new product
  @RequestMapping(value = "/products/{id}", method = RequestMethod.PUT, consumes = {"multipart/form-data"})
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<ProductDTO> put(
      @PathVariable(value = "id") UUID id,
      @Valid @RequestPart("criteria") ProductCriteria criteria,
      @RequestPart(name = "files", required = false) List<MultipartFile> files
      ) {
    logger.info("start handling at /products PUT");
    return new ResponseEntity<>(this.service.update(criteria, id, files), HttpStatus.OK);
  }

  // delete a new product
  @DeleteMapping("/products/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN')") // admin only
  public ResponseEntity<BaseResponse> delete(
      @PathVariable(value = "id") UUID id
      ) {
    logger.info("start handling at /products DELETE");
    this.service.delete(id);
    return new ResponseEntity<>(new BaseResponse("successfuly deleted."), HttpStatus.OK);
  }

  /**
   * disable this since I decided to mix files and other json values to create/update/remove product
   * 
   **/

  // add product image (multiple) 
  //@PostMapping("/products/{id}/images")
  //@PreAuthorize("hasRole('ROLE_ADMIN')") // admin only 
  //public ResponseEntity<String> uploadAvatarImage(@PathVariable(value = "id") UUID id,
  //    @RequestParam("productImages") MultipartFile[] files
  //    ) {
  //  this.service.uploadProductImages(id, files);

  //  return new ResponseEntity<String>("product images uploaded successfully.", HttpStatus.OK);
  //}

  //// delete all product image 
  //@DeleteMapping("/products/{id}/images")
  //@PreAuthorize("hasRole('ROLE_ADMIN')") // admin only 
  //public ResponseEntity<String> deleteAvatarImage(@PathVariable(value = "id") UUID id
  //    ) {
  //  this.service.removeProductImages(id);

  //  return new ResponseEntity<String>("product images deleted successfully.", HttpStatus.OK);
  //}

  // get user avatar image
  @GetMapping(value = "/products/{id}/images/{imageName}", produces = "image/*")
  public ResponseEntity<byte[]> getProductImage(@PathVariable(value = "id") UUID id,
      @PathVariable(value = "imageName") String imageName,
      HttpServletResponse response
      ) {

    // disable content sniffing to prevent content sniffing exploit
    response.addHeader("X-Content-Type-Options", "nosniff");
    // cache this image for one year
    response.addHeader("Cache-Control", "max-age=31536000, must-revalidate, no-transform");

    return new ResponseEntity<byte[]>(
        this.service.getProductImage(id, imageName),
        HttpStatus.OK)
      ;
  }
}
