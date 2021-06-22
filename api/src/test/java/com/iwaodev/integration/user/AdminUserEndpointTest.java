package com.iwaodev.integration.user;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.persistence.EntityManager;
import javax.servlet.http.Cookie;

// MockMvc stuff
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.util.ResourceReader;

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
public class AdminUserEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(AdminUserEndpointTest.class);

  private static final String targetPath = "/users";

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
    this.authInfo = this.authenticateTestUser.setup(this.entityManager, this.mvc, UserTypeEnum.ADMIN, this.port);

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
  public void shouldAdminUserAccessToThisEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    mvc.perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminGetAllUsers.sql" })
  public void shouldAdminGetAllUsers() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());
    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), UserDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (UserDTO userDto : responseBody) {
      assertThat(userDto.getUserId()).isNotNull();
    }
  }

  /**
   * skip sort & pagination testing since those are functionalities of Spring
   * Framework
   **/

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminUserCanFilterUserListWithStartDate.sql" })
  public void shouldAdminUserCanFilterUserListWithStartDate() throws Exception {

    // arrange
    String dummyStartDateString = "2000-10-31T01:30:00.000-05:00";
    String startDateQueryString = "?startDate=" + dummyStartDateString;
    DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + startDateQueryString;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), UserDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (UserDTO userDto : responseBody) {
      assertThat(userDto.getCreatedAt().isAfter(LocalDateTime.parse(dummyStartDateString, formatter))).isEqualTo(true);
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminUserCanFilterUserListWithEndDate.sql" })
  public void shouldAdminUserCanFilterUserListWithEndDate() throws Exception {

    // arrange
    String dummyEndDateString = "2022-10-31T01:30:00.000-05:00";
    String endDateQueryString = "?endDate=" + dummyEndDateString;
    DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + endDateQueryString;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), UserDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    logger.info("abcd size: " + responseBody.length);
    for (UserDTO userDto : responseBody) {
      assertThat(userDto.getCreatedAt().isBefore(LocalDateTime.parse(dummyEndDateString, formatter))).isEqualTo(true);
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminUserCanFilterUserListWithSearchQuery.sql" })
  public void shouldAdminUserCanFilterUserListWithSearchQuery() throws Exception {

    // arrange
    String dummySearchQueryString = "satoshi";
    String searchQueryQueryString = "?searchQuery=" + dummySearchQueryString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQueryQueryString;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), UserDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    assertThat(responseBody.length).isLessThan(4);
    for (UserDTO userDto : responseBody) {
      // check if the dummy string contains either fistName, lastName, or email
      assertThat(
          userDto.getFirstName().contains(dummySearchQueryString) || userDto.getEmail().contains(dummySearchQueryString)
              || userDto.getLastName().contains(dummySearchQueryString)).isEqualTo(true);
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminUserAccessSpecificUser.sql" })
  public void shouldAdminUserAccessSpecificUser() throws Exception {

    // make sure id match with test sql script

    // arrange
    String dummyUserIdString = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(responseBody.getUserId().toString()).isEqualTo(dummyUserIdString);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminUserRecieveNotFoundResponse.sql" })
  public void shouldAdminUserRecieveNotFoundResponse() throws Exception {

    // make sure id does NOT match with test sql script

    // arrange
    String dummyUserIdString = "8ba48e5c-bac8-4d09-b3bc-a7d2154be6dc";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isNotFound());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(404);
  }

  @Test
  public void shouldAdminUserUpdateItsOwnData(/**
                                               * @Value("classpath:/integration/user/shouldAdminUserUpdateItsOwnData.json")
                                               * Resource dummyFormJsonFile
                                               **/
  ) throws Exception {

    // dummy form json
    // JsonNode dummyFormJson =
    // this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    // String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "update_email@test.com");
    dummyUserSignupForm.put("password", "test_PASSWORD");
    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.put(targetUrl).content(dummyUserSignupForm.toString())
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getLastName()).isEqualTo(dummyUserSignupForm.get("lastName"));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminUserUpdateOtherOwnData.sql" })
  public void shouldAdminUserUpdateOtherOwnData(
      /**@Value("classpath:/integration/user/shouldAdminUserUpdateOtherOwnData.json") Resource dummyFormJsonFile**/)
      throws Exception {

    // make sure id path matches with sql !!!!

    // dummy form json
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "update_email@test.com");
    dummyUserSignupForm.put("password", "test_PASSWORD");
    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.put(targetUrl).content(dummyUserSignupForm.toString())
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    assertThat(responseBody.getUserId().toString()).isEqualTo("29c845ad-54b1-430a-8a71-5caba98d5978");
    assertThat(responseBody.getLastName()).isEqualTo(dummyUserSignupForm.get("lastName"));

  }

  @Test
  public void shouldAdminUserUpdateSinceNoTargetUser(
      /**@Value("classpath:/integration/user/shouldAdminUserUpdateSinceNoTargetUser.json") Resource dummyFormJsonFile**/)
      throws Exception {

    // dummy form json
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = "6be8c838-8bf7-40c9-bd2d-bd38f90a0c02"; // does not exist
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "update_email@test.com");
    dummyUserSignupForm.put("password", "test_PASSWORD");
    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.put(targetUrl).content(dummyUserSignupForm.toString())
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isNotFound());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(404);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotAdminUserUpdateOtherOwnDataSinceEmailDuplcation.sql" })
  public void shouldNotAdminUserUpdateOtherOwnDataSinceEmailDuplcation(
      @Value("classpath:/integration/user/shouldNotAdminUserUpdateOtherOwnDataSinceEmailDuplcation.json") Resource dummyFormJsonFile)
      throws Exception {

    // make sure email is duplciated (the admin's email address) !!!!

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.put(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminUserUpdateStatus.sql" })
  public void shouldAdminUserUpdateStatus(
      @Value("classpath:/integration/user/shouldAdminUserUpdateStatus.json") Resource dummyFormJsonFile)
      throws Exception {

    // make sure id path matches with sql !!!!

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/status";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.patch(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    assertThat(responseBody.getUserId().toString()).isEqualTo("29c845ad-54b1-430a-8a71-5caba98d5978");
    assertThat(responseBody.getActive().toString()).isEqualTo(dummyFormJson.get("active").asText());
    assertThat(responseBody.getActiveNote()).isEqualTo(dummyFormJson.get("activeNote").asText());

  }

  @Test
  public void shouldAdminUserTempDeleteItsOwnAccount() throws Exception {

    // dummy form json
    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("activeNote", "");

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.patch(targetUrl).content(dummyFormJson.toString())
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminUserTempDeleteOtherUserAccount.sql" })
  public void shouldAdminUserTempDeleteOtherUserAccount() throws Exception {

    // dummy form json
    // arrange
    String dummyUserIdString = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("activeNote", "");

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.patch(targetUrl).content(dummyFormJson.toString())
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }

  @Test
  public void shouldNotAdminUserTempDeleteSinceNoTargetUser() throws Exception {

    // dummy form json
    // arrange
    String dummyUserIdString = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("activeNote", "");

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.patch(targetUrl).content(dummyFormJson.toString())
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isNotFound());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(404);
  }

  @Test
  public void shouldAdminUserDeleteItsOwnAccountCompletely() throws Exception {

    // dummy form json
    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.delete(targetUrl).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldAdminUserDeleteOtheruserAccountCompletely.sql" })
  public void shouldAdminUserDeleteOtheruserAccountCompletely() throws Exception {

    // dummy form json
    // arrange
    String dummyUserIdString = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.delete(targetUrl).cookie(this.authCookie).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }

}
