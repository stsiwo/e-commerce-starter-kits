package com.iwaodev.domain.product.validator;

import java.util.List;

import com.iwaodev.domain.validator.Validator;
import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductValidatorBag implements ValidatorBag<Product> {

  @Autowired
  private List<Validator<Product>> validators;

	@Override
	public boolean validateAll(Product domain) throws DomainValidationException {

    boolean result = false;

    for (Validator<Product> validator : this.validators) {
      result = validator.validate(domain);
    }

    return result;
	}
}
