package com.iwaodev.integration.contact;

import static org.assertj.core.api.Assertions.assertThat;

import javax.persistence.EntityManager;
import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.application.iservice.ReCaptchaService;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.util.ResourceReader;

// MockMvc stuff
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

import java.util.UUID;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

// this is alias to SpringJUnit4ClassRunner
////@RunWith(SpringRunner.class)
/**
 * this allows you to use TestEntityManager instead of EntityManager.
 *
 * - if you use Real EntityManager, transaction does not work correctly. esp
 * there is no rollback.
 *
 * - you can't use @DataJpaTest since this includes @BootstrapWith which is
 * included in @SpringBootTest too. this complains that multiple use
 * of @Bootstrap when compile
 * 
 **/
@AutoConfigureTestEntityManager
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional
@ActiveProfiles("integtest")
@AutoConfigureMockMvc
public class MemberContactEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(MemberContactEndpointTest.class);

  private static final String targetPath = "/contact";

  @Autowired
  private MockMvc mvc;

  @LocalServerPort
  private int port;

  @Autowired
  private ObjectMapper objectMapper;

  /**
   * don't use this. this cause my app run in a independent server so we couldn't
   * share the records run by @Sql. (see note.md more detail)
   **/
  // @Autowired
  // private TestRestTemplate restTemplateForAuth;

  @Autowired
  private BaseDatabaseSetup baseDatabaseSetup;

  @Autowired
  private AuthenticateTestUser authenticateTestUser;

  @Autowired
  private TestEntityManager entityManager;

  @Value("${test.user.member.id}")
  private UUID testMemberId;

  private AuthenticationInfo authInfo;

  private Cookie authCookie;

  private Cookie csrfCookie;

  @MockBean
  private ReCaptchaService recaptchaService;

  @MockBean
  private EmailService emailService;

  @Autowired
  private ResourceReader resourceReader;


  /**
   * insert base test data into mysql database
   *
   * - such as user_types, test user
   *
   **/
  @BeforeTransaction
  void verifyInitialDatabaseState() throws Exception {
    this.baseDatabaseSetup.setup(this.entityManager);

    // send authentication request before testing
    this.authInfo = this.authenticateTestUser.setup(
        this.entityManager, 
        this.mvc, 
        UserTypeEnum.MEMBER, 
        this.port
        );

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
    this.csrfCookie = new Cookie("csrf-token", this.authInfo.getCsrfToken());

    /**
     * stop using TestRestTEmplate
     *
     **/
    // src:
    // https://stackoverflow.com/questions/32623407/add-my-custom-http-header-to-spring-resttemplate-request-extend-resttemplate
    // every restTemplate instance has this Authorization header with the jwt token
    // this.restTemplateBuilder = new RestTemplateBuilder(rt ->
    // rt.getInterceptors().add((request, body, execution) -> {
    // request.getHeaders().add("Authorization", "Bearer " + this.jwtToken);
    // return execution.execute(request, body);
    // }));
  }

  @Test
  public void shouldMemberSendContact() throws Exception {

    // arrange
    Mockito.doNothing().when(this.recaptchaService).verify(Mockito.anyString());

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("firstName", "Satoshi");
    dummyUserSignupForm.put("lastName", "Iwao");
    dummyUserSignupForm.put("email", "satoshi@test.com");
    dummyUserSignupForm.put("title", "my title");
    dummyUserSignupForm.put("description", "my desc");
    dummyUserSignupForm.put("recaptchaToken", "dummy_recaptcha_token");

    // act
    mvc.perform(MockMvcRequestBuilders
        .post(targetUrl)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("firstName", dummyUserSignupForm.get("firstName").toString())
            .param("lastName", dummyUserSignupForm.get("lastName").toString())
            .param("email", dummyUserSignupForm.get("email").toString())
            .param("title", dummyUserSignupForm.get("title").toString())
            .param("description", dummyUserSignupForm.get("description").toString())
            .param("recaptchaToken", dummyUserSignupForm.get("recaptchaToken").toString())
        .content(dummyUserSignupForm.toString())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk());

    // assert
    Mockito.verify(this.emailService, Mockito.times(1))
            .send(
                    Mockito.anyString(),
                    Mockito.eq(dummyUserSignupForm.get("email").toString()),
                    Mockito.any(),
                    Mockito.eq(dummyUserSignupForm.get("title").toString()),
                    Mockito.any());
    
  }
  @Test
  public void shouldNotMemberSendContactSinceInvalidRecaptcha() throws Exception {

    // arrange
    Mockito.doThrow(Exception.class).when(this.recaptchaService).verify(Mockito.anyString());

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("firstName", "Satoshi");
    dummyUserSignupForm.put("lastName", "Iwao");
    dummyUserSignupForm.put("email", "satoshi@test.com");
    dummyUserSignupForm.put("title", "my title");
    dummyUserSignupForm.put("description", "my desc");
    dummyUserSignupForm.put("recaptchaToken", "dummy_recaptcha_token");

    // act
    mvc.perform(MockMvcRequestBuilders
        .post(targetUrl)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .param("firstName", dummyUserSignupForm.get("firstName").toString())
            .param("lastName", dummyUserSignupForm.get("lastName").toString())
            .param("email", dummyUserSignupForm.get("email").toString())
            .param("title", dummyUserSignupForm.get("title").toString())
            .param("description", dummyUserSignupForm.get("description").toString())
            .param("recaptchaToken", dummyUserSignupForm.get("recaptchaToken").toString())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isBadRequest());

    // assert
    Mockito.verify(this.emailService, Mockito.never()).send(Mockito.anyString(), Mockito.eq(dummyUserSignupForm.get("email").toString()), Mockito.eq(dummyUserSignupForm.get("title").toString()), Mockito.any());
    
  }
}

