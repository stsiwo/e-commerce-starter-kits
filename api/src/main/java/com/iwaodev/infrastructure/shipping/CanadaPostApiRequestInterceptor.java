package com.iwaodev.infrastructure.shipping;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;


@Component
public class CanadaPostApiRequestInterceptor implements ClientHttpRequestInterceptor {

  @Value("${shipping.api.username}")
  private String shippingApiUserName;

  @Value("${shipping.api.password}")
  private String shippingApiPassword;
  

	@Override
	public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
			throws IOException {
      request.getHeaders().setBasicAuth(this.shippingApiUserName, this.shippingApiPassword);
      return execution.execute(request, body);
	}

}
