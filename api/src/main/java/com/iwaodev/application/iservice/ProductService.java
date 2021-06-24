package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.ui.criteria.product.ProductCriteria;
import com.iwaodev.ui.criteria.product.ProductQueryStringCriteria;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {

  public Page<ProductDTO> getAll(ProductQueryStringCriteria criteria, Integer page, Integer limit, ProductSortEnum sort) throws Exception;

  /**
   * retrieve products for public.
   *
   *  - product.isPublic = true.
   *  - product.reviews[].isVerified = true
   *
   **/
  public Page<ProductDTO> getPublicAll(ProductQueryStringCriteria criteria, Integer page, Integer limit, ProductSortEnum sort) throws Exception;

  public ProductDTO getById(UUID id) throws Exception;

  public ProductDTO getByPath(String path) throws Exception;

  public ProductDTO getByPathOrId(String path) throws Exception;

  public ProductDTO getPublicByPathOrId(String path) throws Exception;

  public ProductDTO create(ProductCriteria criteria, List<MultipartFile> files) throws Exception;

  public ProductDTO update(ProductCriteria criteria, UUID id, List<MultipartFile> files) throws Exception;

  public void delete(UUID id) throws Exception;

  //public void uploadProductImages(UUID productId, MultipartFile[] files) throws Exception;

  //public void removeProductImages(UUID productId) throws Exception;

  public byte[] getProductImage(UUID productId, String imageName) throws Exception;
}


