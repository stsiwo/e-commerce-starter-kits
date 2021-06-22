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
      // throw new DomainValidationException(String.format("order event's user must be
      // null since this is added by guest (status: %s).", domain.getOrderStatus()));
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{orderEvent.user.null}").addConstraintViolation();
      // you need to unwrap to set parameter to the message.
      // ref:
      // https://stackoverflow.com/questions/45510986/is-it-possible-to-add-message-parameter-for-constraint-violation-template-messag/45511264
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.addMessageParameter("0", domain.getOrderStatus());
      return false;
    }

    // order status by guest user.
    if (domain.getUser() == null && !orderEventInfo.getAddableBy().contains(UserTypeEnum.ANONYMOUS)) {
      // throw new DomainValidationException(String.format("order status is not
      // addable by guest user (status: %s)", domain.getOrderStatus()));
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{orderEvent.orderStatus.notaddablebyguest}")
          .addConstraintViolation();
      // you need to unwrap to set parameter to the message.
      // ref:
      // https://stackoverflow.com/questions/45510986/is-it-possible-to-add-message-parameter-for-constraint-violation-template-messag/45511264
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.addMessageParameter("0", domain.getOrderStatus());
      return false;
    }

    // user not null: admin/member
    if (!domain.getIsGuest() && domain.getUser() == null) {
      // throw new DomainValidationException(String.format("order event's user cannot
      // be null since this is added by admin/member (status: %s).",
      // domain.getOrderStatus()));
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{orderEvent.user.notnull}").addConstraintViolation();
      // you need to unwrap to set parameter to the message.
      // ref:
      // https://stackoverflow.com/questions/45510986/is-it-possible-to-add-message-parameter-for-constraint-violation-template-messag/45511264
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.addMessageParameter("0", domain.getOrderStatus());
      return false;
    }

    // order status by admin/member user.
    if (!domain.getIsGuest() && !orderEventInfo.getAddableBy().contains(domain.getUser().getUserType().getUserType())) {
      // throw new DomainValidationException(String.format("order status is not
      // addable by this user (status: %s and addable by %s)",
      // domain.getOrderStatus(), orderEventInfo.addableByToString()));
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("{orderEvent.orderStatus.notnull}").addConstraintViolation();
      // you need to unwrap to set parameter to the message.
      // ref:
      // https://stackoverflow.com/questions/45510986/is-it-possible-to-add-message-parameter-for-constraint-violation-template-messag/45511264
      HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
          .unwrap(HibernateConstraintValidatorContext.class);
      hibernateConstraintValidatorContext.addMessageParameter("0", domain.getOrderStatus());
      hibernateConstraintValidatorContext.addMessageParameter("1", orderEventInfo.addableByToString());
      return false;
    }

    // if pass all of them,
    return true;
  }
}
