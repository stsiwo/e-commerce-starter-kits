package com.iwaodev.domain.category.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ ElementType.FIELD })
@Retention( RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CategoryPathUniqueValidator.class)
@Documented
public @interface CategoryPathUnique {

  String message() default "{category.path.unique}";

  boolean optional() default true;

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}


