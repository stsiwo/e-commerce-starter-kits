package com.iwaodev.domain.order.validator;

import java.util.List;

import com.iwaodev.domain.validator.Validator;
import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.OrderEvent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderEventValidatorBag implements ValidatorBag<OrderEvent> {

  @Autowired
  private List<Validator<OrderEvent>> validators;

	@Override
	public boolean validateAll(OrderEvent domain, String when) throws DomainValidationException {

    boolean result = false;

    for (Validator<OrderEvent> validator : this.validators) {
      result = validator.validateWhenBoth(domain);

      // run only if @PrePersist
      if (when.equals("create")) {
        result = validator.validateWhenCreate(domain);
      }
      // run only if @PreUpdate
      if (when.equals("update")) {
        result = validator.validateWhenUpdate(domain);
      }
    }

    return result;
	}
}

