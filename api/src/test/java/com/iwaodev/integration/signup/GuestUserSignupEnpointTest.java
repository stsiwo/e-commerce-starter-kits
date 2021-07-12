package com.iwaodev.integration.signup;

import org.awaitility.Awaitility;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.awaitility.Awaitility.await;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.config.MyTestConfiguration;
import com.iwaodev.domain.user.UserActiveEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.domain.user.event.GeneratedVerificationTokenEvent;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.response.AuthenticationResponse;
import com.iwaodev.ui.response.ErrorBaseResponse;

import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Import;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

/**
 * User Endpoint For Member User Testing
 *
 **/

// this is alias to SpringJUnit4ClassRunner
@RunWith(SpringRunner.class)
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
/**
 * bug: ApplicationEventPublisher with @MockBean does not create mocked ApplicationEventPublisher.
 *
 * workaournd: create this Testconfiguration class.
 *
 * ref: https://github.com/spring-projects/spring-framework/issues/18907
 *
 **/
@Import(MyTestConfiguration.class)
public class GuestUserSignupEnpointTest {

  private static final Logger logger = LoggerFactory.getLogger(GuestUserSignupEnpointTest.class);

  private static final String targetPath = "/signup";

  @Autowired
  private MockMvc mvc;

  @LocalServerPort
  private int port;

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private UserRepository userRepository;

  @MockBean
  private EmailService emailService;

  @Autowired
  private MessageSource messageSource;

  @MockBean
  private ApplicationEventPublisher publisher;

  @Test
  public void shouldGuestUserSignupSuccessfully() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;
    String dummyFirstName = "Kaoru";
    String dummyLastName = "Iwao";
    String dummyEmail = "kaoru@gmail.com";
    String dummyPassword = "kaoru_PASSWORD";  // lower and upper & min(8) & no space
    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("firstName", dummyFirstName);
    dummyUserSignupForm.put("lastName", dummyLastName);
    dummyUserSignupForm.put("email", dummyEmail);
    dummyUserSignupForm.put("password", dummyPassword);

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).contentType(MediaType.APPLICATION_JSON)
            .content(dummyUserSignupForm.toString()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    AuthenticationResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, AuthenticationResponse.class);

    // assert
    UserDTO user = responseBody.getUser(); 
    String jwt = responseBody.getJwt(); 
    assertThat(jwt).isNotNull();
    assertThat(user).isNotNull();
    assertThat(user.getEmail()).isEqualTo(dummyEmail);
    assertThat(user.getUserType().getUserType()).isEqualTo(UserTypeEnum.MEMBER.toString());
    assertThat(user.getActive()).isEqualTo(UserActiveEnum.TEMP);
    assertThat(user.getVerificationTokenExpiryDate()).isAfter(LocalDateTime.now());
    assertThat(user.getVerificationTokenExpiryDate().minusHours(2)).isBefore(LocalDateTime.now());

    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(GeneratedVerificationTokenEvent.class));
  }

  @Test
  public void shouldGuestUserSignupButGot400SinceInvalidRequestForm() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;
    String dummyFirstName = ""; // <- this
    String dummyLastName = "Iwao";
    String dummyEmail = "kaoru@gmail.com";
    String dummyPassword = "kaoru_PASSWORD";  // lower and upper & min(8) & no space
    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("firstName", dummyFirstName);
    dummyUserSignupForm.put("lastName", dummyLastName);
    dummyUserSignupForm.put("email", dummyEmail);
    dummyUserSignupForm.put("password", dummyPassword);

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .post(targetUrl)
            .contentType(MediaType.APPLICATION_JSON)
            .content(dummyUserSignupForm.toString())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isBadRequest())
        .andDo(mvcResult -> {
           
        });

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);
    // assert
    // if this error from responseStatusException, you have to use 'result.getResponse().getErrorMessage()'
    // if this error from @ControllerAdvice, you have to use 'responseBody.getMessage()' to access the body message.
    assertThat(responseBody.getMessage()).isEqualTo(this.messageSource.getMessage("user.firstName.notempty", new Object[0], LocaleContextHolder.getLocale()));
  }

  @Test
  public void shouldGuestUserSignupButGot400SinceInvalidPassword() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;
    String dummyFirstName = "Kaoru"; // <- this
    String dummyLastName = "Iwao";
    String dummyEmail = "kaoru@gmail.com";
    String dummyPassword = "kaoru_password";  // invalid password 
    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("firstName", dummyFirstName);
    dummyUserSignupForm.put("lastName", dummyLastName);
    dummyUserSignupForm.put("email", dummyEmail);
    dummyUserSignupForm.put("password", dummyPassword);

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).contentType(MediaType.APPLICATION_JSON)
            .content(dummyUserSignupForm.toString()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/signup/shouldNotGuestUserSignupSinceDuplicated.sql" })
  public void shouldNotGuestUserSignupSinceDuplicated() throws Exception {

    // make sure the dummy data and setup sql email match

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;
    String dummyFirstName = "Kaoru";
    String dummyLastName = "Iwao";
    String dummyEmail = "kaoru@gmail.com";
    String dummyPassword = "kaoru_PASSWORD";  // lower and upper & min(8) & no space
    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("firstName", dummyFirstName);
    dummyUserSignupForm.put("lastName", dummyLastName);
    dummyUserSignupForm.put("email", dummyEmail);
    dummyUserSignupForm.put("password", dummyPassword);

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).contentType(MediaType.APPLICATION_JSON)
            .content(dummyUserSignupForm.toString()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().is4xxClientError());

    MvcResult result = resultActions.andReturn();
    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(409);
  }
}
