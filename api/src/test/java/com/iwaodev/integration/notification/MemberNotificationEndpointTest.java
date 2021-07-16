package com.iwaodev.integration.notification;

import static org.assertj.core.api.Assertions.assertThat;

import javax.persistence.EntityManager;
import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.notification.NotificationDTO;
import com.iwaodev.application.dto.user.UserDTO;
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
public class MemberNotificationEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(MemberNotificationEndpointTest.class);

  private String targetPath = "/users/%s/notifications";

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

  @Autowired
  private ResourceReader resourceReader;

  private Cookie authCookie;

  private Cookie csrfCookie;
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
  // the name of a bean start lowercase char so don't confused with its class
  // name.
  // #TODO: get this email value from test.properties. for now I don't know how to
  // do this. see note.md more details
  // stop using this @WithUserDetails. this does not work with TestRestTemplate
  // @WithUserDetails(value = "test_member@test.com", userDetailsServiceBeanName =
  // "springSecurityUserDetailsService")
  // @Sql(scripts={"classpath:test.sql"})
  public void shouldMemberAccessToThisEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());

    // act & assert
    mvc.perform(
        MockMvcRequestBuilders
          .get(targetUrl)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());
  }

  /**
   * skip sort & pagination testing since those are functionalities of Spring
   * Framework
   **/

  @Test
  @Sql(scripts = { "classpath:/integration/notification/shouldMemberGetAllOfItsOwnNotification.sql" })
  public void shouldMemberGetAllOfItsOwnNotification(/*@Value("classpath:/integration/user/shouldMemberGetAllOfItsOwnNotification.json") Resource dummyFormJsonFile*/) throws Exception {

    // make sure user_id in the sql match test member user id

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .get(targetUrl)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
   NotificationDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), NotificationDTO[].class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.length).isGreaterThan(0);
    for (NotificationDTO notification : responseBody) {
      assertThat(notification.getNotificationId().toString()).isNotNull();
      assertThat(notification.getNotificationType().toString()).isNotNull();
      assertThat(notification.getNotificationTitle().toString()).isNotNull();
      assertThat(notification.getNotificationDescription().toString()).isNotNull();
      assertThat(notification.getRecipient().getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
      assertThat(notification.getIssuer().toString()).isNotNull();
      assertThat(notification.getIsRead()).isEqualTo(false);
      assertThat(notification.getCreatedAt()).isNotNull();
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/notification/shouldMemberUpdateNotification.sql" })
  public void shouldMemberUpdateNotification(/**@Value("classpath:/integration/notification/shouldMemberUpdateNotification.json") Resource dummyFormJsonFile**/) throws Exception {

    // make sure notification_id match with sql and json

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    //String dummyFormJsonString = dummyFormJson.toString();
    String dummyNotificationId = "ntf_UUDciAU-DI6"; // must recipient id match with auth user id.

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyNotificationId;

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .patch(targetUrl) // update
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    NotificationDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, NotificationDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getNotificationId()).isEqualTo(dummyNotificationId);
    assertThat(responseBody.getIsRead()).isEqualTo(true);
    assertThat(responseBody.getRecipient().getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
  }
}

