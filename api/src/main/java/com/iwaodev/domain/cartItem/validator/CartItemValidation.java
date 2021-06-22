package com.iwaodev.domain.cartItem.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE })
@Retention( RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CartItemValidationValidator.class)
@Documented
public @interface CartItemValidation {

  String message() default "{cartitem.invalid}";

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}



