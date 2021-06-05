package com.iwaodev.domain.validator;

import com.iwaodev.exception.DomainValidationException;

public interface ValidatorBag<D> {

  public boolean validateAll(D domain) throws DomainValidationException;
}
