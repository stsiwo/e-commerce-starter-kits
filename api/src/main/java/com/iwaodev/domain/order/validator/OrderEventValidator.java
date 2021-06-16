package com.iwaodev.domain.order.validator;

import java.math.BigDecimal;
import java.util.List;

import com.iwaodev.config.auth.CurAuthentication;
import com.iwaodev.config.auth.CurAuthenticationImpl;
import com.iwaodev.domain.order.OrderEventBag;
import com.iwaodev.domain.order.OrderEventInfo;
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

    OrderEventInfo orderEventInfo = OrderEventBag.map.get(domain.getOrderStatus());

    logger.info("where is my bug");

    // user null
    if (domain.getIsGuest() && domain.getUser() != null) {
      throw new DomainValidationException(String.format("order event's user must be null since this is added by guest (status: %s).", domain.getOrderStatus()));
    }

    logger.info("where is my bug");
    // order status by guest user. 
    if (domain.getUser() == null && !orderEventInfo.getAddableBy().contains(UserTypeEnum.ANONYMOUS)) {
      throw new DomainValidationException(String.format("order status is not addable by guest user (status: %s)", domain.getOrderStatus()));
    }

    logger.info("where is my bug");
    // user not null: admin/member
    if (!domain.getIsGuest() && domain.getUser() == null) {
      throw new DomainValidationException(String.format("order event's user cannot be null since this is added by admin/member (status: %s).", domain.getOrderStatus()));
    }

    logger.info("where is my bug");
    // order status by admin/member user. 
    if (!domain.getIsGuest() && !orderEventInfo.getAddableBy().contains(domain.getUser().getUserType().getUserType())) {
      throw new DomainValidationException(String.format("order status is not addable by this user (status: %s and addable by %s)", domain.getOrderStatus(), orderEventInfo.addableByToString()));
    }

    logger.info("where is my bug");
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
