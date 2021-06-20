package com.iwaodev.domain.product.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ ElementType.FIELD })
@Retention( RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProductPathUniqueValidator.class)
@Documented
public @interface ProductPathUnique {

  String message() default "{product.path.unique}";

  boolean optional() default true;

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}


