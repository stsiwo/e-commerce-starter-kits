package com.iwaodev.ui.validator.optional.digit;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ ElementType.FIELD })
@Retention( RetentionPolicy.RUNTIME)
@Constraint(validatedBy = OptionalDigitValidator.class)
@Documented
public @interface OptionalDigit {

  String message() default "{invalid input}";

  int integer() default 6;

  int fraction() default 2;

  int min() default 1;

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}


