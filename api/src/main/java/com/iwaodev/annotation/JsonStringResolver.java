package com.iwaodev.annotation;

import com.iwaodev.util.ResourceReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * still developing so don't use this.
 *
 *  - want to create custom annotation for parse json resource to string
 **/

@Component
public class JsonStringResolver implements HandlerMethodArgumentResolver {

  @Autowired
  private ResourceReader resourceReader;

  @Autowired
  private ResourceLoader resourceLoader;

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.getParameterAnnotation(JsonString.class) != null;
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest,
			WebDataBinderFactory binderFactory) throws Exception {

    JsonString jsonString = parameter.getParameterAnnotation(JsonString.class);

    Resource jsonResource = this.resourceLoader.getResource(jsonString.value());

    return this.resourceReader.asString(jsonResource);
	}

}
