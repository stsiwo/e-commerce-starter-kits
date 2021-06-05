package com.iwaodev.domain.product.validator;

import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductVariant;

import org.springframework.stereotype.Component;

@Component
public class ProductVariantStockCannotBeNegativeValidator implements Validator<Product> {

	@Override
	public boolean validate(Product domain) throws DomainValidationException  {

    for (ProductVariant variant: domain.getVariants()) {
      if (variant.getVariantStock() < 0) {
        throw new DomainValidationException("Sorry, the given variant does not have enough stock. (variant id: " + variant.getVariantId() + " and current stock: " + variant.getVariantStock() + ")");
      }
    }
    return true;
	}
}

