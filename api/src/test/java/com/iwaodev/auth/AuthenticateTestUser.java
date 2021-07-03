package com.iwaodev.auth;

import javax.persistence.EntityManager;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.response.AuthenticationResponse;

// MockMvc stuff
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
public class AuthenticateTestUser {

  private static final Logger logger = LoggerFactory.getLogger(AuthenticateTestUser.class);

  @Value("${test.user.all.password}")
  private String testPassword;

  @Autowired
  private ObjectMapper objectMapper;

  public AuthenticationInfo setup(TestEntityManager entityManager, MockMvc mvc, UserTypeEnum userTypeEnum, int port) throws Exception {
    
    // get a test user which has this role
    User authUser = entityManager.getEntityManager().createQuery(
        "SELECT u FROM users u INNER JOIN u.userType ut WHERE ut.userType = :userType",
        User.class
        ).setParameter("userType", userTypeEnum).getSingleResult();
    
    // send a request to /authenticate (POST) to get jwt token
    HttpHeaders headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");      

    JSONObject credentialRequestBody = new JSONObject();
    credentialRequestBody.put("email", authUser.getEmail());
    credentialRequestBody.put("password", this.testPassword);
    // DON'T USE 'user.getPassword()' since this is already encoded by bcrypt so does not work.
    //credentialRequestBody.put("password", user.getPassword());
 
     ResultActions resultAction = mvc.perform(MockMvcRequestBuilders
        .post("http://localhost:" + port + "/authenticate")
        .content(credentialRequestBody.toString())
        .contentType(MediaType.APPLICATION_JSON)
        .accept(MediaType.APPLICATION_JSON)
        );

      
     MvcResult result = resultAction.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    AuthenticationResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, AuthenticationResponse.class);

    logger.debug("test authentication response:");
    logger.debug("" + result.getResponse().getStatus());
    logger.debug("" + result.getResponse());
    

    if (result.getResponse().getStatus() != 200) {
      throw new Exception("test user FAILED to get authentication jwt: " + result.getResponse().getStatus());
    }

    return new AuthenticationInfo(authUser, responseBody.getJwt(), responseBody.getCsrfToken());
  }
}
