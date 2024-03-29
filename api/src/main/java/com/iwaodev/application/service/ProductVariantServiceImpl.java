package com.iwaodev.application.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.productVariant.ProductVariantDTO;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.iservice.ProductVariantService;
import com.iwaodev.application.mapper.ProductMapper;
import com.iwaodev.application.mapper.ProductVariantMapper;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductSize;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.product.ProductVariantCriteria;

import com.iwaodev.util.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class ProductVariantServiceImpl implements ProductVariantService {

  private static final Logger logger = LoggerFactory.getLogger(ProductVariantServiceImpl.class);

  private ProductRepository repository;

  @Autowired
  public ProductVariantServiceImpl(ProductRepository repository) {
    this.repository = repository;
  }

  @Autowired
  private HttpServletRequest httpServletRequest;

  public List<ProductVariantDTO> getAll(UUID productId) throws Exception {

    Optional<Product> targetEntityOption = this.repository.findById(productId);

    if (!targetEntityOption.isPresent()) {
      logger.debug("the given product does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given product does not exist.");
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
  public ProductDTO create(UUID productId, ProductVariantCriteria criteria) throws Exception {

    // duplication
    if (this.repository.findVariantByColorAndSize(productId, criteria.getVariantColor(), criteria.getProductSize().getProductSizeName()).isPresent()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the variant already exist.");
    }

    Product targetEntity = this.repository.findById(productId).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given product does not exist."));

    ProductSize productSize = this.repository.findProductSizeById(criteria.getProductSize().getProductSizeId()).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given product size does not exist."));

    // map criteria to entity
    ProductVariant newEntity = ProductVariantMapper.INSTANCE.toProductVariantEntityFromProductVariantCriteria(criteria);

    newEntity.setProductSize(productSize);

    targetEntity.addVariant(newEntity);

    /**
     * bug: when throw AppEception instead of ResponseStatusException, it causes 'detached entity passed to persist: com.iwaodev.infrastructure.model.ProductVariant' in response message.
     *
     **/
    // must be cheaper than the unit price validaiton
    if (!newEntity.isUnitPriceGraterThanDiscountPrice()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "the discount price must be less than the unit price.");
    }
    // recalculate product cheapest & highest price.
    targetEntity.setUp();

    // save it
    Product savedEntity = this.repository.save(targetEntity);

    // issue-qPl7MheYUdW
    //this.repository.flush();
    /**
     * if this entity use '@Formula' and '@Transient' you need to refresh.
     **/
    this.repository.refresh(savedEntity);

    return ProductMapper.INSTANCE.toProductDTO(savedEntity);
  }

  @Override
  public ProductDTO replace(UUID productId, Long variantId, ProductVariantCriteria criteria) throws Exception {

    // duplication
    if (this.repository.isOthersHaveColorAndSize(productId, variantId, criteria.getVariantColor(), criteria.getProductSize().getProductSizeName())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the variant already exist.");
    }

    Product targetEntity = this.repository.findById(productId).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given product does not exist."));
    ProductVariant targetVariant = targetEntity.findVariantById(criteria.getVariantId());
    ProductSize productSize = this.repository.findProductSizeById(criteria.getProductSize().getProductSizeId()).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given product size does not exist."));

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetVariant.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    // map criteria to entity
    ProductVariant updateEntity = ProductVariantMapper.INSTANCE
        .toProductVariantEntityFromProductVariantCriteria(criteria);

    // issue-k0rdIGEQ91U
    targetEntity.updateVariant(variantId, updateEntity);

    targetVariant.setProductSize(productSize);
    /**
     * bug: when throw AppEception instead of ResponseStatusException, it causes 'detached entity passed to persist: com.iwaodev.infrastructure.model.ProductVariant' in response message.
     **/
    // must be cheaper than the unit price validaiton
    if (!targetVariant.isUnitPriceGraterThanDiscountPrice()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "the discount price must be less than the unit price.");
    }

    // recalculate product cheapest & highest price.
    targetEntity.setUp();

    // save it

    Product savedEntity;
    try {
      // don't forget flush otherwise version number is updated.
      savedEntity = this.repository.saveAndFlush(targetEntity);
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    logger.debug("saved product version: " + savedEntity.getVersion());

    /**
     * you need to flush otherwise, update statement is never executed (esp testing).
     * I don't know why.
     **/
    this.repository.flush();
    /**
     * if this entity use '@Formula' and '@Transient' you need to refresh.
     **/
    this.repository.refresh(savedEntity);

    return ProductMapper.INSTANCE.toProductDTO(savedEntity);
  }

  @Override
  public void delete(UUID productId, Long variantId) throws Exception {

    Optional<Product> targetEntityOption = this.repository.findById(productId);

    if (targetEntityOption.isPresent()) {

      Product targetEntity = targetEntityOption.get();
      ProductVariant targetVariant = targetEntity.findVariantById(variantId);

      // version check for concurrency update
      String receivedVersion = this.httpServletRequest.getHeader("If-Match");
      if (receivedVersion == null || receivedVersion.isEmpty()) {
        throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
      }
      if (!Util.checkETagVersion(targetVariant.getVersion(), receivedVersion)) {
        throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
      };

      targetEntity.removeVariantById(variantId);

      // recalculate 'cheapestPrice' and 'highestPrice'
      targetEntity.setUp();

      // if the product does not have any variant after this deletion, make public disable to follow the business rule.
      if (!targetEntity.hasVariants()) {
        targetEntity.setIsPublic(false);
      }

      // save it
      try {
        this.repository.save(targetEntity);
      } catch (OptimisticLockingFailureException ex) {
        throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
      }
    }
  }
}
