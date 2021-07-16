package com.iwaodev.integration.phone;

import static org.assertj.core.api.Assertions.assertThat;

import javax.persistence.EntityManager;
import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.application.dto.user.PhoneDTO;
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
@Transactional
@ActiveProfiles("integtest")
@AutoConfigureMockMvc
public class MemberPhoneEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(MemberPhoneEndpointTest.class);

  private String targetPath = "/users/%s/phones";

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
  //@Sql(scripts = { "classpath:/integration/phone/shouldMemberUserUpdateItsOwnData.sql" })
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

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldMemberGetAllOfItsOwnPhone.sql" })
  public void shouldMemberGetAllOfItsOwnPhone(/*@Value("classpath:/integration/user/shouldMemberGetAllOfItsOwnPhone.json") Resource dummyFormJsonFile*/) throws Exception {

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());
    logger.info("target url: " + targetUrl);

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

    logger.info("body");
    logger.info(result.getResponse().getContentAsString());

    PhoneDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PhoneDTO[].class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.length).isGreaterThan(0);
    for (PhoneDTO phone : responseBody) {
      assertThat(phone.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    }
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/phone/shouldMemberGetAllOfItsOwnPhone.sql" })
  public void shouldNotMemberGetAllOfPhoneForOtherUser(/*@Value("classpath:/integration/user/shouldMemberGetAllOfItsOwnPhone.json") Resource dummyFormJsonFile*/) throws Exception {

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, "038b6f4c-b100-4b32-9c21-fd17ec52a605");
    logger.info("target url: " + targetUrl);

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
      .andExpect(status().isForbidden());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(403);
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/phone/shouldMemberGetAllOfItsOwnPhone.sql" })
  public void shouldMemberCreateNewPhone(@Value("classpath:/integration/phone/shouldMemberCreateNewPhone.json") Resource dummyFormJsonFile) throws Exception {

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
  //@Sql(scripts = { "classpath:/integration/phone/shouldMemberGetAllOfItsOwnPhone.sql" })
  public void shouldNotMemberCreateNewPhoneOfOtherUser(@Value("classpath:/integration/phone/shouldNotMemberCreateNewPhoneOfOtherUser.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserId = "6a52508a-9266-4267-a3d9-d7d48182a0e7";
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
      .andExpect(status().isForbidden());

    MvcResult result = resultActions.andReturn();
    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(403);
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/phone/shouldMemberGetAllOfItsOwnPhone.sql" })
  public void shouldNotMemberCreateNewPhoneSinceBadRequest(@Value("classpath:/integration/phone/shouldNotMemberCreateNewPhoneSinceBadRequest.json") Resource dummyFormJsonFile) throws Exception {

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

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(400);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldMemberUpdatePhone.sql" })
  public void shouldMemberUpdatePhone(@Value("classpath:/integration/phone/shouldMemberUpdatePhone.json") Resource dummyFormJsonFile) throws Exception {

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
  //@Sql(scripts = { "classpath:/integration/phone/shouldMemberUpdatePhone.sql" })
  public void shouldNotMemberUpdatePhoneSinceNotFound(@Value("classpath:/integration/phone/shouldNotMemberUpdatePhoneSinceNotFound.json") Resource dummyFormJsonFile) throws Exception {

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
      .andExpect(status().isNotFound());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(404);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldMemberTogglePhoneSelection.sql" })
  public void shouldMemberTogglePhoneSelection(/**@Value("classpath:/integration/phone/shouldMemberTogglePhoneSelection.json") Resource dummyFormJsonFile**/) throws Exception {

    // make sure phone_id match with sql and json
    
    String dummyNewSelectedPhoneId = "100"; // must match with sql
    String dummyOldSelectedPhoneId = "101"; // must match with sql

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyNewSelectedPhoneId;

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
    PhoneDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PhoneDTO[].class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    for (PhoneDTO phone : responseBody) {
      // lombok kills type system!!! don't forget to match the type!!
      if (phone.getPhoneId().toString().equals(dummyNewSelectedPhoneId)) {
        assertThat(phone.getIsSelected()).isEqualTo(true);
      } else {
        assertThat(phone.getIsSelected()).isEqualTo(false);
      }
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/phone/shouldMemberDeletePhone.sql" })
  public void shouldMemberDeletePhone() throws Exception {

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
  //@Sql(scripts = { "classpath:/integration/phone/shouldNotMemberDeletePhoneOfOtherUser.sql" })
  public void shouldNotMemberDeletePhoneOfOtherUser() throws Exception {

    // arrange
    String dummyUserId = "d8f06104-0ab4-42e6-933e-9ba303beb7a9";
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
      .andExpect(status().isForbidden());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(403);
  }
}

