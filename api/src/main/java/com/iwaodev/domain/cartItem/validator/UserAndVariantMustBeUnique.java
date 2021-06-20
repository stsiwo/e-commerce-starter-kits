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
@Constraint(validatedBy = UserAndVariantMustBeUniqueValidator.class)
@Documented
public @interface UserAndVariantMustBeUnique {

  String message() default "{cartItem.userAndVariant.unique}";

  Class<?>[] groups() default { };

  Class<? extends Payload>[] payload() default { };

}



