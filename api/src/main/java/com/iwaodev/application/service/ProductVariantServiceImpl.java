package com.iwaodev.application.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.productVariant.ProductVariantDTO;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.iservice.ProductVariantService;
import com.iwaodev.application.mapper.ProductVariantMapper;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductSize;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.product.ProductVariantCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

  public List<ProductVariantDTO> getAll(UUID productId) throws Exception {

    Optional<Product> targetEntityOption = this.repository.findById(productId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given product does not exist");
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
  public ProductVariantDTO create(UUID productId, ProductVariantCriteria criteria) throws Exception {

    // duplication
    if (this.repository.findVariantByColorAndSize(productId, criteria.getVariantColor(), criteria.getProductSize().getProductSizeName()).isPresent()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the variant already exist.");
    }

    Product targetEntity = this.repository.findById(productId).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given product does not exist."));

    logger.info("successfully fetch target product.");
    
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
    logger.info("pass the cheaper discount price validation.");

    // recalculate product cheapest & highest price.
    targetEntity.setUp();

    // save it
    Product savedEntity = this.repository.save(targetEntity);
    logger.info("after save");
    /**
     * if this entity use '@Formula' and '@Transient' you need to refresh.
     **/
    this.repository.refresh(savedEntity);
    logger.info("after refresh");

    // find updated entity
    Optional<ProductVariant> targetVariantOption = savedEntity.findVariantByColorAndSize(criteria.getVariantColor(),
        criteria.getProductSize().getProductSizeId());
    logger.info("after filter");
    // map entity to dto and return it.
    ProductVariantDTO variantDto = ProductVariantMapper.INSTANCE.toProductVariantDTO(targetVariantOption.get());

    logger.info("returning variant dto after service");
    return variantDto;
  }

  @Override
  public ProductVariantDTO replace(UUID productId, Long variantId, ProductVariantCriteria criteria) throws Exception {

    // duplication
    if (this.repository.isOthersHaveColorAndSize(productId, variantId, criteria.getVariantColor(), criteria.getProductSize().getProductSizeName())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the variant already exist.");
    }

    Product targetEntity = this.repository.findById(productId).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given product does not exist."));

    ProductSize productSize = this.repository.findProductSizeById(criteria.getProductSize().getProductSizeId()).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given product size does not exist."));

    // map criteria to entity
    ProductVariant updateEntity = ProductVariantMapper.INSTANCE
        .toProductVariantEntityFromProductVariantCriteria(criteria);

    updateEntity.setProductSize(productSize);

    targetEntity.updateVariant(variantId, updateEntity);

    // must be cheaper than the unit price validaiton
    if (!updateEntity.isUnitPriceGraterThanDiscountPrice()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the discount price must be less than the unit price.");
    }

    // recalculate product cheapest & highest price.
    targetEntity.setUp();

    // save it
    Product savedEntity = this.repository.save(targetEntity);

    /**
     * you need to flush otherwise, update statement is never executed (esp testing).
     * I don't know why.
     **/
    this.repository.flush();
    /**
     * if this entity use '@Formula' and '@Transient' you need to refresh.
     **/
    this.repository.refresh(savedEntity);

    logger.info("product variant create");
    //logger.info("product cheapest price " + savedEntity.getCheapestPrice());
    //logger.info("product highest price " + savedEntity.getHighestPrice());

    // find updated entity
    Optional<ProductVariant> targetVariantOption = savedEntity.findVariantByColorAndSize(criteria.getVariantColor(),
        criteria.getProductSize().getProductSizeId());

    // map entity to dto and return it.
    return ProductVariantMapper.INSTANCE.toProductVariantDTO(targetVariantOption.get());
  }

  @Override
  public void delete(UUID productId, Long variantId) throws Exception {

    Optional<Product> targetEntityOption = this.repository.findById(productId);

    if (!targetEntityOption.isEmpty()) {

      Product targetEntity = targetEntityOption.get();

      targetEntity.removeVariantById(variantId);

      // recalculate 'cheapestPrice' and 'highestPrice'
      targetEntity.setUp();

      // save it
      this.repository.save(targetEntity);
    }

  }
}
