package com.iwaodev.application.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.productVariant.ProductVariantDTO;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.iservice.FileService;
import com.iwaodev.application.iservice.ProductService;
import com.iwaodev.application.iservice.ProductVariantService;
import com.iwaodev.application.mapper.ProductMapper;
import com.iwaodev.application.mapper.ProductVariantMapper;
import com.iwaodev.application.specification.factory.ProductSpecificationFactory;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductImage;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.product.ProductCriteria;
import com.iwaodev.ui.criteria.user.UserDeleteTempCriteria;
import com.iwaodev.ui.criteria.product.ProductQueryStringCriteria;
import com.iwaodev.ui.criteria.product.ProductVariantCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ProductVariantServiceImpl implements ProductVariantService {

  private static final Logger logger = LoggerFactory.getLogger(ProductVariantServiceImpl.class);

  private ProductRepository repository;

  @Autowired
  public ProductVariantServiceImpl(ProductRepository repository) {
    this.repository = repository;
  }

  public List<ProductVariantDTO> getAll(UUID productId) {

    Optional<Product> targetEntityOption = this.repository.findById(productId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given product does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    }

    Product targetEntity = targetEntityOption.get();

    return targetEntity.getVariants().stream().map(new Function<ProductVariant, ProductVariantDTO>() {

      @Override
      public ProductVariantDTO apply(ProductVariant productVariant) {
        return ProductVariantMapper.INSTANCE.toProductVariantDTO(productVariant);
      }
    }).collect(Collectors.toList());
  }

  @Override
  public ProductVariantDTO create(UUID productId, ProductVariantCriteria criteria) {

    Optional<Product> targetEntityOption = this.repository.findById(productId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given product does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    }

    Product targetEntity = targetEntityOption.get();

    // duplication
    if (this.repository.findVariantByColorAndSize(productId, criteria.getVariantColor(), criteria.getProductSize().getProductSizeName()).isPresent()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "the variant already exist.");
    }


    // map criteria to entity
    ProductVariant newEntity = ProductVariantMapper.INSTANCE.toProductVariantEntityFromProductVariantCriteria(criteria);

    targetEntity.addVariant(newEntity);

    // save it
    Product savedEntity = this.repository.save(targetEntity);

    // find updated entity
    Optional<ProductVariant> targetVariantOption = savedEntity.findVariantByColorAndSize(criteria.getVariantColor(),
        criteria.getProductSize().getProductSizeId());

    // map entity to dto and return it.
    return ProductVariantMapper.INSTANCE.toProductVariantDTO(targetVariantOption.get());
  }

  @Override
  public ProductVariantDTO replace(UUID productId, Long variantId, ProductVariantCriteria criteria) {
    Optional<Product> targetEntityOption = this.repository.findById(productId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given product does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    }

    Product targetEntity = targetEntityOption.get();

    // duplication
    if (this.repository.isOthersHaveColorAndSize(productId, variantId, criteria.getVariantColor(), criteria.getProductSize().getProductSizeName())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "the variant already exist.");
    }

    // map criteria to entity
    ProductVariant updateEntity = ProductVariantMapper.INSTANCE
        .toProductVariantEntityFromProductVariantCriteria(criteria);

    targetEntity.updateVariant(variantId, updateEntity);

    // save it
    this.repository.save(targetEntity);

    // map entity to dto and return it.
    return ProductVariantMapper.INSTANCE.toProductVariantDTO(updateEntity);
  }

  @Override
  public void delete(UUID productId, Long variantId) {

    Optional<Product> targetEntityOption = this.repository.findById(productId);

    if (!targetEntityOption.isEmpty()) {

      Product targetEntity = targetEntityOption.get();

      targetEntity.removeVariantById(variantId);

      // save it
      this.repository.save(targetEntity);
    }

  }
}
