package com.iwaodev.domain.order.validator;

import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Order;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class OrderValidator implements Validator<Order> {

  private static final Logger logger = LoggerFactory.getLogger(OrderValidator.class);

  /**
   * make sure this works.
   **/
  @Autowired
  private CurAuthentication curAuthentication;

  @Override
  public boolean validateWhenBoth(Order domain) throws DomainValidationException {

    logger.info("start OrderValidator");

    // orderNumber
    if (domain.getOrderNumber() == null) {
      throw new DomainValidationException(String.format("order number cannot be null."));
    }

    // orderFirstName
    if (domain.getOrderFirstName() == null) {
      throw new DomainValidationException(String.format("order first name cannot be null."));
    }

    // orderLastName
    if (domain.getOrderLastName() == null) {
      throw new DomainValidationException(String.format("order last name cannot be null."));
    }

    // orderEmail
    if (domain.getOrderEmail() == null) {
      throw new DomainValidationException(String.format("order email cannot be null."));
    }

    // orderPhone
    if (domain.getOrderPhone() == null) {
      throw new DomainValidationException(String.format("order phone cannot be null."));
    }

    if (!domain.getOrderPhone().matches("^+(?:[0-9] ?){6,14}[0-9]$")) {
      throw new DomainValidationException(
          String.format("invalid order phone format (phone: %s", domain.getOrderPhone()));
    }

    // orderStripePaymentIntentId
    if (domain.getStripePaymentIntentId() == null) {
      throw new DomainValidationException(String.format("order stripe payment intent id cannot be null."));
    }

    // currency
    if (domain.getCurrency() == null) {
      throw new DomainValidationException(String.format("order currency cannot be null."));
    }

    // shipping address
    if (domain.getShippingAddress() == null) {
      throw new DomainValidationException(String.format("order shipping address cannot be null."));
    }

    // billing address
    if (domain.getBillingAddress() == null) {
      throw new DomainValidationException(String.format("order billing address cannot be null."));
    }

    // these entities validation is delegated to OrderAddressValidator.java

    // orderEvent
    if (domain.getOrderEvents() == null) {
      throw new DomainValidationException(String.format("order events cannot be null."));
    }

    // orderEvents > 0
    if (domain.getOrderEvents().size() <= 0) {
      throw new DomainValidationException(String.format("order events must have at least one event."));
    }

    // orderDetails
    if (domain.getOrderDetails() == null) {
      throw new DomainValidationException(String.format("order details cannot be null."));
    }

    // orderDetails > 0
    if (domain.getOrderDetails().size() <= 0) {
      throw new DomainValidationException(String.format("order details must have at least one detail."));
    }

    // user guest
    List<UserTypeEnum> curAuthUserTypeList = this.curAuthentication.getRole();
    if (curAuthUserTypeList.contains(UserTypeEnum.GUEST) && domain.getUser() != null) {
      throw new DomainValidationException(String.format("order user should be null since this is guest user."));
    }

    // user member
    if (curAuthUserTypeList.contains(UserTypeEnum.MEMBER) && domain.getUser() == null) {
      throw new DomainValidationException(String.format("order user cannot be null."));
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(Order domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(Order domain) throws DomainValidationException {
    return true;
  }
}
