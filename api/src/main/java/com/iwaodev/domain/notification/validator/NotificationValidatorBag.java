package com.iwaodev.domain.notification.validator;

import java.util.List;

import com.iwaodev.domain.validator.Validator;
import com.iwaodev.domain.validator.ValidatorBag;
import com.iwaodev.exception.DomainValidationException;
import com.iwaodev.infrastructure.model.Notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NotificationValidatorBag implements ValidatorBag<Notification> {

  @Autowired
  private List<Validator<Notification>> validators;

	@Override
	public boolean validateAll(Notification domain, String when) throws DomainValidationException {

    boolean result = false;

    for (Validator<Notification> validator : this.validators) {
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
