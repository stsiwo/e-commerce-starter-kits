package com.iwaodev.domain.product.validator;

import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Product;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ProductMustHaveAtLeastOneVariantToPublicValidator implements Validator<Product> {

  private static final Logger logger = LoggerFactory.getLogger(ProductMustHaveAtLeastOneVariantToPublicValidator.class);
	@Override
	public boolean validate(Product domain) throws DomainValidationException  {

    logger.info("start ProductMustHaveAtLeastOneVariantToPublicValidator");
    logger.info("public?: " + domain.getIsPublic());
    logger.info("variant size?: " + domain.getVariants().size());
    
    if (domain.getIsPublic()) {

      if (domain.getVariants().size() == 0) {
        throw new DomainValidationException("you need to have at least one variant to publish this product. (product name: " + domain.getProductName() + ")");
      }
    }

    return true;
	}
}
