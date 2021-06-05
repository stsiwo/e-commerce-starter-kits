package com.iwaodev.application.iservice;

import java.util.List;
import java.util.UUID;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.ui.criteria.ProductCriteria;
import com.iwaodev.ui.criteria.ProductQueryStringCriteria;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {

  public Page<ProductDTO> getAll(ProductQueryStringCriteria criteria, Integer page, Integer limit, ProductSortEnum sort);

  /**
   * retrieve products for public.
   *
   *  - product.isPublic = true.
   *  - product.reviews[].isVerified = true
   *
   **/
  public Page<ProductDTO> getPublicAll(ProductQueryStringCriteria criteria, Integer page, Integer limit, ProductSortEnum sort);

  public ProductDTO getById(UUID id);

  public ProductDTO getByPath(String path);

  public ProductDTO getByPathOrId(String path);

  public ProductDTO getPublicByPathOrId(String path);

  public ProductDTO create(ProductCriteria criteria, List<MultipartFile> files);

  public ProductDTO update(ProductCriteria criteria, UUID id, List<MultipartFile> files);

  public void delete(UUID id);

  //public void uploadProductImages(UUID productId, MultipartFile[] files);

  //public void removeProductImages(UUID productId);

  public byte[] getProductImage(UUID productId, String imageName);
}


