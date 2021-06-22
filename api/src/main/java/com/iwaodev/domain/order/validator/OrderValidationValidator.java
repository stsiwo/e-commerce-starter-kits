package com.iwaodev.domain.order.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.infrastructure.model.Order;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise,
// they cannot access.
@Component
public class OrderValidationValidator implements ConstraintValidator<OrderValidation, Order> {

  private static final Logger logger = LoggerFactory.getLogger(OrderValidationValidator.class);

  @Override
  public boolean isValid(Order domain, ConstraintValidatorContext context) {

    // orderEvents > 0
    if (domain.getOrderEvents().size() <= 0) {
      // throw new DomainValidationException(String.format("order events must have at
      // least one event."));
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{order.orderEvents.min1}").addConstraintViolation();
      return false;
    }

    // orderDetails > 0
    if (domain.getOrderDetails().size() <= 0) {
      // throw new DomainValidationException(String.format("order details must have at
      // least one detail."));
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{order.orderDetails.min1}").addConstraintViolation();
      return false;
    }

    // user guest
    if (domain.getIsGuest() && domain.getUser() != null) {
      // throw new DomainValidationException(String.format("order user should be null
      // since this is guest user."));
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{order.user.null}").addConstraintViolation();
      return false;
    }

    // user member
    if (!domain.getIsGuest() && domain.getUser() == null) {
      // throw new DomainValidationException(String.format("order user cannot be null
      // since this is member user."));
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{order.user.notnull}").addConstraintViolation();
      return false;
    }

    // if pass all of them,
    return true;
  }
}
