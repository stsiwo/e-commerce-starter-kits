package com.iwaodev.domain.validator;

import com.iwaodev.exception.DomainValidationException;

public interface Validator<D> {

  public boolean validateWhenBoth(D domain) throws DomainValidationException;

  public boolean validateWhenCreate(D domain) throws DomainValidationException;

  public boolean validateWhenUpdate(D domain) throws DomainValidationException;
}
