package com.iwaodev.integration.phone;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.user.PhoneDTO;
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
//@RunWith(SpringRunner.class)
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
public class AdminPhoneEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(AdminPhoneEndpointTest.class);

  private String targetPath = "/users/%s/phones";

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

  private Cookie csrfCookie;
  private AuthenticationInfo authInfo;
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
       UserTypeEnum.ADMIN,
       this.port);

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
    this.csrfCookie = new Cookie("csrf-token", this.authInfo.getCsrfToken());
  }

  //
  // @AfterTransaction
  // void verifyFinalDatabaseState() {
  // // logic to verify the final state after transaction has rolled back
  // //
  // // you might want to delete some data (e.g., data created in
  // @BeforeTransaction)
  // //
  // }
  //
  // /**
  // * you can't set test user using this @BeforeEach
  // *
  // * - Spring Security run before this @BeforeEach and can't pass
  // authentication.
  // **/
  // @BeforeEach
  // public void setup() {
  // }

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
  @Sql(scripts = { "classpath:/integration/phone/shouldAdminGetAllOfItsOwnPhone.sql" })
  public void shouldAdminGetAllOfItsOwnPhone(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnPhone.json") Resource dummyFormJsonFile*/) throws Exception {

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
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    PhoneDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PhoneDTO[].class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.length).isGreaterThan(0);
    for (PhoneDTO phone : responseBody) {
      assertThat(phone.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldAdminGetAllOfPhoneForOtherUser.sql" })
  public void shouldAdminGetAllOfPhoneForOtherUser(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnPhone.json") Resource dummyFormJsonFile*/) throws Exception {

    // make sure user_id in the sql match test admin user id

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserId = "29c845ad-54b1-430a-8a71-5caba98d5978"; 
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyUserId); // see the corresponding sql file

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
    PhoneDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PhoneDTO[].class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.length).isGreaterThan(0);
    for (PhoneDTO phone : responseBody) {
      assertThat(phone.getUserId().toString()).isEqualTo(dummyUserId);
    }
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/phone/shouldAdminGetAllOfPhoneForOtherUser.sql" })
  public void shouldNotAdminGetAllOfPhoneForOtherUserSinceNoTargetUser(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnPhone.json") Resource dummyFormJsonFile*/) throws Exception {

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserId = "29c845ad-54b1-430a-8a71-5caba98d5978";  //// see the corresponding sql file
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyUserId); 

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
      .andExpect(status().isNotFound());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(404);
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/phone/shouldMemberGetAllOfItsOwnPhone.sql" })
  public void shouldAdminCreateNewPhone(@Value("classpath:/integration/phone/shouldAdminCreateNewPhone.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .post(targetUrl)
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    PhoneDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PhoneDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getPhoneNumber()).isEqualTo(dummyFormJson.get("phoneNumber").asText());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldAdminCreateNewPhoneOfOtherUser.sql" })
  public void shouldAdminCreateNewPhoneOfOtherUser(@Value("classpath:/integration/phone/shouldAdminCreateNewPhoneOfOtherUser.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserId = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyUserId);

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .post(targetUrl)
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    PhoneDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PhoneDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getUserId().toString()).isEqualTo(dummyUserId);
    assertThat(responseBody.getPhoneNumber()).isEqualTo(dummyFormJson.get("phoneNumber").asText());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldNotAdminCreateNewPhoneSinceExceedMax.sql" })
  public void shouldNotAdminCreateNewPhoneSinceExceedMax(@Value("classpath:/integration/phone/shouldNotAdminCreateNewPhoneSinceExceedMax.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .post(targetUrl)
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isBadRequest());
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/phone/shouldAdminCreateNewPhoneOfOtherUser.sql" })
  public void shouldNotAdminCreateNewPhoneOfOtherUserSinceNoTargetUser(@Value("classpath:/integration/phone/shouldNotAdminCreateNewPhoneOfOtherUserSinceNoTargetUser.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserId = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyUserId);

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .post(targetUrl)
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isNotFound());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(404);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldAdminUpdatePhone.sql" })
  public void shouldAdminUpdatePhone(@Value("classpath:/integration/phone/shouldAdminUpdatePhone.json") Resource dummyFormJsonFile) throws Exception {

    // make sure phone_id match with sql and json

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyFormJson.get("phoneId").asText();

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .put(targetUrl) // update
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    PhoneDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PhoneDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getPhoneId()).isEqualTo(dummyFormJson.get("phoneId").asLong());
    assertThat(responseBody.getPhoneNumber()).isEqualTo(dummyFormJson.get("phoneNumber").asText());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldAdminUpdatePhoneOfOtherUser.sql" })
  public void shouldAdminUpdatePhoneOfOtherUser(@Value("classpath:/integration/phone/shouldAdminUpdatePhoneOfOtherUser.json") Resource dummyFormJsonFile) throws Exception {

    // make sure phone_id match with sql and json

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyUserId = "29c845ad-54b1-430a-8a71-5caba98d5978"; 

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyUserId) + "/" + dummyFormJson.get("phoneId").asText();

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .put(targetUrl) // update
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    PhoneDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PhoneDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getUserId().toString()).isEqualTo(dummyUserId);
    assertThat(responseBody.getPhoneId()).isEqualTo(dummyFormJson.get("phoneId").asLong());
    assertThat(responseBody.getPhoneNumber()).isEqualTo(dummyFormJson.get("phoneNumber").asText());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldAdminDeletePhone.sql" })
  public void shouldAdminDeletePhone() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/100"; // check the sql to match phone id (e.g., 100)

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .delete(targetUrl) // remove
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldAdminDeletePhoneOfOtherUser.sql" })
  public void shouldAdminDeletePhoneOfOtherUser() throws Exception {

    // arrange
    String dummyUserId = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyUserId) + "/100"; // check the sql to match phone id (e.g., 100)

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .delete(targetUrl) // remove
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }
}

