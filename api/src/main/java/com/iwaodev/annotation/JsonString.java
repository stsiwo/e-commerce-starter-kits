package com.iwaodev.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * still developing so don't use this.
 *
 *  - want to create custom annotation for parse json resource to string
 **/

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface JsonString {

  public String value() default "";
}
