package com.iwaodev.domain.order.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.domain.order.OrderEventBag;
import com.iwaodev.domain.order.OrderEventInfo;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.OrderEvent;

import org.hibernate.validator.constraintvalidation.HibernateConstraintValidatorContext;
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
public class OrderEventValidationValidator implements ConstraintValidator<OrderEventValidation, OrderEvent> {

  private static final Logger logger = LoggerFactory.getLogger(OrderEventValidationValidator.class);

  @Override
  public boolean isValid(OrderEvent domain, ConstraintValidatorContext context) {

    OrderEventInfo orderEventInfo = OrderEventBag.map.get(domain.getOrderStatus());

    // user null
    if (domain.getIsGuest() && domain.getUser() != null) {
        // https://stackoverflow.com/questions/23702975/building-dynamic-constraintviolation-error-messages
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.disableDefaultConstraintViolation();
      hibernateConstraintValidatorContext.addMessageParameter("0", domain.getOrderStatus()).buildConstraintViolationWithTemplate("{orderEvent.user.null}").addConstraintViolation();
      return false;
    }

    // order status by guest user.
    if (domain.getUser() == null && !orderEventInfo.getAddableBy().contains(UserTypeEnum.ANONYMOUS)) {
        // https://stackoverflow.com/questions/23702975/building-dynamic-constraintviolation-error-messages
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.disableDefaultConstraintViolation();
      hibernateConstraintValidatorContext.addMessageParameter("0", domain.getOrderStatus()).buildConstraintViolationWithTemplate("{orderEvent.orderStatus.notaddablebyguest}")
          .addConstraintViolation();
;
      return false;
    }

    // user not null: admin/member
    if (!domain.getIsGuest() && domain.getUser() == null) {
        // https://stackoverflow.com/questions/23702975/building-dynamic-constraintviolation-error-messages
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.disableDefaultConstraintViolation();
      hibernateConstraintValidatorContext.addMessageParameter("0", domain.getOrderStatus()).buildConstraintViolationWithTemplate("{orderEvent.user.notnull}").addConstraintViolation();
      return false;
    }

    // order status by admin/member user.
    if (!domain.getIsGuest() && !orderEventInfo.getAddableBy().contains(domain.getUser().getUserType().getUserType())) {
        // https://stackoverflow.com/questions/23702975/building-dynamic-constraintviolation-error-messages
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.disableDefaultConstraintViolation();
      hibernateConstraintValidatorContext.addMessageParameter("0", domain.getOrderStatus()).addMessageParameter("1", orderEventInfo.addableByToString()).buildConstraintViolationWithTemplate("{orderEvent.orderStatus.notaddablebythisuser}").addConstraintViolation();
      return false;
    }

    // if pass all of them,
    return true;
  }
}
