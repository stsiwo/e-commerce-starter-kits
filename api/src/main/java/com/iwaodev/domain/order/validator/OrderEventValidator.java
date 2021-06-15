package com.iwaodev.domain.order.validator;

import java.math.BigDecimal;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.validator.Validator;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.OrderEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class OrderEventValidator implements Validator<OrderEvent> {

  private static final Logger logger = LoggerFactory.getLogger(OrderEventValidator.class);

  @Autowired
  private CurAuthentication curAuthentication;

  @Override
  public boolean validateWhenBoth(OrderEvent domain) throws DomainValidationException {

    logger.info("start OrderEventValidator");

    // undoable
    if (domain.getUndoable() == null) {
      throw new DomainValidationException(String.format("undoable can not be null."));
    }

    // order status
    if (domain.getOrderStatus() == null) {
      throw new DomainValidationException(String.format("order status can not be null."));
    }

    // order
    if (domain.getOrder() == null) {
      throw new DomainValidationException(String.format("order can not be null."));
    }

    // user guest
    List<UserTypeEnum> curAuthUserTypeList = this.curAuthentication.getRole();
    if (curAuthUserTypeList.contains(UserTypeEnum.GUEST) && domain.getUser() != null) {
      throw new DomainValidationException(String.format("order event's user should be null since this is guest user."));
    }

    // user member
    if (curAuthUserTypeList.contains(UserTypeEnum.MEMBER) && domain.getUser() == null) {
      throw new DomainValidationException(String.format("order event's user cannot be null."));
    }

    return true;
  }

  @Override
  public boolean validateWhenCreate(OrderEvent domain) throws DomainValidationException {
    return true;
  }

  @Override
  public boolean validateWhenUpdate(OrderEvent domain) throws DomainValidationException {
    return true;
  }
}
