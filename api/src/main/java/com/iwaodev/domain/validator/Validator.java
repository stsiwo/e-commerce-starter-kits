package com.iwaodev.domain.validator;

import com.iwaodev.exception.DomainValidationException;

public interface Validator<D> {

  public boolean validate(D domain) throws DomainValidationException;
}
