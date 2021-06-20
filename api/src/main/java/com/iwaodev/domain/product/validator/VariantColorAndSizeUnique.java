package com.iwaodev.domain.product.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE })
@Retention( RetentionPolicy.RUNTIME)
@Constraint(validatedBy = VariantColorAndSizeUniqueValidator.class)
@Documented
public @interface VariantColorAndSizeUnique {

  String message() default "{productVariant.colorAndSize.unique}";

  boolean optional() default true;

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}


