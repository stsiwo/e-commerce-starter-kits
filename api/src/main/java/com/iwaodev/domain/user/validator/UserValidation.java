package com.iwaodev.domain.user.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE })
@Retention( RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UserValidationValidator.class)
@Documented
public @interface UserValidation {

  String message() default "{user.invalid}";

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}



