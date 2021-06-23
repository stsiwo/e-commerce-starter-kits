package com.iwaodev.domain.user.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.iwaodev.infrastructure.model.Phone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * validating an associate from the parent entity with javax.validation annotation cause this errors: java.lang.NullPointerException: null
 *	at org.hibernate.collection.internal.AbstractPersistentCollection$5.hasNext(AbstractPersistentCollection.java:822) ~[hibernate-core-5.4.32.Final.jar:5.4.32.Final].
 *
 *	ex) like this @PhoneValidation at Phone Entity and try to save from User Entity which is the parent of this Phone entity.
 *
 **/
/**
 * don't use this at any JPA class (e.g., Entity class, EntityListner).
 *
 **/
// if this is used by another package, don't forget to add 'public' otherwise, they cannot access.
@Component
public class PhoneValidationValidator implements ConstraintValidator<PhoneValidation, Phone> {

  private static final Logger logger = LoggerFactory.getLogger(PhoneValidationValidator.class);

  @Override
  public boolean isValid(Phone domain, ConstraintValidatorContext context) {

    logger.info("start validating custom phone ....");
    logger.info("size of phones: " + domain.getUser().getPhones().size());

    // phones max 3
    //if (domain.getUser().getPhones().size() > 3) {
    //  //throw new DomainValidationException(String.format("phone phones must be less than or equal to 3."));
    //  context.disableDefaultConstraintViolation();
    //        context.buildConstraintViolationWithTemplate("{order.phone.max3}")
    //        .addConstraintViolation();
    //  return false;
    //}

    logger.info("pass all custom domain validation");
    // if pass all of them,
    return true;
  }
}

