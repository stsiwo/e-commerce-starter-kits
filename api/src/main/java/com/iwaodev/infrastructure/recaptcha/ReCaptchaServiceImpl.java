package com.iwaodev.infrastructure.recaptcha;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.iwaodev.application.iservice.ReCaptchaService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * recaptch verification service.
 *
 * ref: https://developers.google.com/recaptcha/docs/verify
 *
 **/
@Service
public class ReCaptchaServiceImpl implements ReCaptchaService {

  @Autowired
  @Qualifier("recatchaRestTemplate")
  private RestTemplate restTemplate;

  @Value("${recaptcha.secret}")
  private String recaptchaSecret;

  @Autowired
  private ObjectMapper objectMapper;


  private final String url = "https://www.google.com/recaptcha/api/siteverify";

  private static final Logger logger = LoggerFactory.getLogger(ReCaptchaServiceImpl.class);

  @Override
  public void verify(String recaptchaToken) throws Exception {

    // prep for inputs
    ObjectNode inputs = this.objectMapper.createObjectNode();
    inputs.put("secret", this.recaptchaSecret);
    inputs.put("response", recaptchaToken);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<String> entity = new HttpEntity<String>(inputs.toString(), headers);

    // send request
    String responseString = this.restTemplate.postForObject(this.url, entity, String.class);
    JsonNode responseObject = this.objectMapper.readTree(responseString);

    // verify
    Boolean isSuccess = responseObject.get("success").asBoolean();

    if (!isSuccess) {
      ArrayNode errors = (ArrayNode) responseObject.get("error-codes");
      if (responseObject.get("error-codes").isArray()) {
        logger.info("recaptcha error: " + errors.get(0).asText());
        throw new Exception(errors.get(0).asText());
      }
    }
  }
}
