package com.iwaodev.integration.contact;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.dto.company.PublicCompanyDTO;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.application.iservice.ReCaptchaService;
import com.iwaodev.data.BaseDatabaseSetup;

// MockMvc stuff
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

import javax.mail.MessagingException;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

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
import org.springframework.http.MediaType;
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
public class GuestContactEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(GuestContactEndpointTest.class);

  private static final String targetPath = "/contact";

  @Autowired
  private MockMvc mvc;

  @LocalServerPort
  private int port;

  /**
   * don't use this.
   * this cause my app run in a independent server so we couldn't share the records run by @Sql. (see note.md more detail)
   **/
  //@Autowired
  //private TestRestTemplate restTemplateForNonAuth;

  @Autowired
  private BaseDatabaseSetup baseDatabaseSetup;

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private ReCaptchaService recaptchaService;

  @MockBean
  private EmailService emailService;

  /**
   * insert base test data into mysql database
   *
   * - such as user_types, test user
   *
   **/
  @BeforeTransaction
  void verifyInitialDatabaseState() throws Exception {
    logger.info("start calling setup before - satoshi");

    this.baseDatabaseSetup.setup(this.entityManager);
  }

  @Test
  public void shouldGuestSendContact() throws Exception {

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
        .contentType(MediaType.APPLICATION_JSON)
        .content(dummyUserSignupForm.toString())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk());

    // assert
    Mockito.verify(this.emailService, Mockito.times(1)).send(Mockito.anyString(), Mockito.eq(dummyUserSignupForm.get("email").toString()), Mockito.eq(dummyUserSignupForm.get("title").toString()), Mockito.any());
    
  }

  @Test
  public void shouldNotGuestSendContactSinceInvalidRecaptcha() throws Exception {

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
        .contentType(MediaType.APPLICATION_JSON)
        .content(dummyUserSignupForm.toString())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isBadRequest());

    // assert
    //Mockito.verify(this.emailService, Mockito.times(1)).send(Mockito.anyString(), Mockito.eq(dummyUserSignupForm.get("email").toString()), Mockito.eq(dummyUserSignupForm.get("title").toString()), Mockito.any());
    
  }
  @Test
  public void shouldNotGuestSendContactSinceEmailFailure() throws Exception {

    // arrange
    Mockito.doNothing().when(this.recaptchaService).verify(Mockito.anyString());
    Mockito.doThrow(MessagingException.class).when(this.emailService).send(Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyString());

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
        .contentType(MediaType.APPLICATION_JSON)
        .content(dummyUserSignupForm.toString())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isInternalServerError());

    // assert
    //Mockito.verify(this.emailService, Mockito.times(1)).send(Mockito.anyString(), Mockito.eq(dummyUserSignupForm.get("email").toString()), Mockito.eq(dummyUserSignupForm.get("title").toString()), Mockito.any());
    
  }
}


