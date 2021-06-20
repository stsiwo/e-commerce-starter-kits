package com.iwaodev.domain.user.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ ElementType.FIELD })
@Retention( RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UserEmailUniqueValidator.class)
@Documented
public @interface UserEmailUnique {

  //
  String message() default "{user.email.unique}";

  boolean optional() default true;

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}


