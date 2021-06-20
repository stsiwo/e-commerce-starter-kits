package com.iwaodev.domain.order.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE })
@Retention( RetentionPolicy.RUNTIME)
@Constraint(validatedBy = OrderEventValidationValidator.class)
@Documented
public @interface OrderEventValidation {

  String message() default "{orderEvent.user.invalidtype}";

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}



