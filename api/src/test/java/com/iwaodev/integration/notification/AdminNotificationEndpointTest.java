package com.iwaodev.integration.notification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.notification.NotificationDTO;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.util.ResourceReader;

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
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

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
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
@ActiveProfiles("integtest")
@AutoConfigureMockMvc
public class AdminNotificationEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(AdminNotificationEndpointTest.class);

  private String targetPath = "/users/%s/notifications";

  @LocalServerPort
  private int port;

  @Autowired
  private MockMvc mvc;

  @Autowired
  private BaseDatabaseSetup baseDatabaseSetup;

  @Autowired
  private AuthenticateTestUser authenticateTestUser;

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private ResourceReader resourceReader;

  private Cookie authCookie;

  private AuthenticationInfo authInfo;
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
       UserTypeEnum.ADMIN,
       this.port);

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
  }

  @Test
  // the name of a bean start lowercase char so don't confused with its class
  // name.
  // #TODO: get this email value from test.properties. for now I don't know how to
  // do this. see note.md more details
  // stop using this @WithUserDetails. this does not work with TestRestTemplate
  // @WithUserDetails(value = "test_admin@test.com", userDetailsServiceBeanName =
  // "springSecurityUserDetailsService")
  // @Sql(scripts={"classpath:test.sql"})
  public void shouldAdminAccessToThisEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());

    // act & assert
    mvc.perform(
        MockMvcRequestBuilders
          .get(targetUrl)
          .cookie(this.authCookie)
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
  @Sql(scripts = { "classpath:/integration/notification/shouldAdminGetAllOfItsOwnNotification.sql" })
  public void shouldAdminGetAllOfItsOwnNotification(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnNotification.json") Resource dummyFormJsonFile*/) throws Exception {

    // make sure user_id in the sql match test admin user id

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
  @Sql(scripts = { "classpath:/integration/notification/shouldAdminUpdateNotification.sql" })
  public void shouldAdminUpdateNotification(/**@Value("classpath:/integration/notification/shouldAdminUpdateNotification.json") Resource dummyFormJsonFile**/) throws Exception {

    // make sure notification_id match with sql and json

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    //String dummyFormJsonString = dummyFormJson.toString();
    String dummyNotificationId = "ntf_JkWsJXIGNH3";

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyNotificationId;

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .patch(targetUrl) // update
          .cookie(this.authCookie)
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


