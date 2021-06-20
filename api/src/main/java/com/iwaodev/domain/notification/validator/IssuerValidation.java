package com.iwaodev.domain.notification.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE })
@Retention( RetentionPolicy.RUNTIME)
@Constraint(validatedBy = IssuerValidationValidator.class)
@Documented
public @interface IssuerValidation {

  String message() default "{notification.issuer.invaliduser}";

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}
