package com.iwaodev.integration.user;

import static org.assertj.core.api.Assertions.assertThat;

import javax.persistence.EntityManager;
import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.application.dto.review.FindReviewDTO;
import com.iwaodev.application.dto.review.ReviewDTO;
import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.iservice.S3Service;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.config.MyTestConfiguration;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedByMemberEvent;
import com.iwaodev.domain.review.event.NewReviewWasSubmittedEvent;
import com.iwaodev.domain.user.UserActiveEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.response.ErrorBaseResponse;
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
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
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
/**
 * bug: ApplicationEventPublisher with @MockBean does not create mocked ApplicationEventPublisher.
 *
 * workaournd: create this Testconfiguration class.
 *
 * ref: https://github.com/spring-projects/spring-framework/issues/18907
 *
 **/
@Import(MyTestConfiguration.class)
public class MemberUserEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(MemberUserEndpointTest.class);

  private static final String targetPath = "/users";

  private static final String targetImagePath = "/domain/users";

  @Autowired
  private MockMvc mvc;

  @LocalServerPort
  private int port;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private ApplicationEventPublisher publisher;

  @Autowired
  private PasswordEncoder passwordEncoder;

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

  @MockBean
  private S3Service s3Service;

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
    this.authInfo = this.authenticateTestUser.setup(this.entityManager, this.mvc, UserTypeEnum.MEMBER, this.port);

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
  // the name of a bean start lowercase char so don't confused with its class
  // name.
  // #TODO: get this email value from test.properties. for now I don't know how to
  // do this. see note.md more details
  // @WithUserDetails(value = "test_member@test.com", userDetailsServiceBeanName =
  // "springSecurityUserDetailsService")
  // @Sql(scripts={"classpath:test.sql"})
  public void shouldNotMemberUserAccessToThisEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    mvc.perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).cookie(this.csrfCookie)
        .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON)).andDo(print())
        .andExpect(status().isForbidden());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserAccessItsOwnData.sql" })
  public void shouldMemberUserAccessItsOwnData() throws Exception {

    // make sure id does match with test sql script

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String etag = result.getResponse().getHeader("ETag");

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(responseBody.getUserId().toString()).isEqualTo(dummyUserIdString);
    assertThat(etag).isEqualTo("\"0\"");
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberUserAccessOtherUserData.sql" })
  public void shouldNotMemberUserAccessOtherUserData() throws Exception {

    // make sure id does NOT match with test sql script

    // arrange
    String dummyUserIdString = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isForbidden());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(403);
  }

  @Test
  // @Sql(scripts = {
  // "classpath:/integration/user/shouldMemberUserUpdateItsOwnData.sql" })
  public void shouldMemberUserUpdateItsOwnData(/**
                                                * @Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json")
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
    String dummyVersion = "\"0\"";

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "update_email@test.com");
    dummyUserSignupForm.put("password", "test_PASSWORD");
    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.put(targetUrl)
            .content(dummyUserSignupForm.toString())
            .contentType(MediaType.APPLICATION_JSON)
            .cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String etag = result.getResponse().getHeader("ETag");

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(etag).isEqualTo("\"2\""); // bumped up twice - issue-YPnuFX8S01a
    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getFirstName()).isEqualTo(dummyUserSignupForm.get("firstName"));
    assertThat(responseBody.getLastName()).isEqualTo(dummyUserSignupForm.get("lastName"));
    assertThat(responseBody.getEmail()).isEqualTo(dummyUserSignupForm.get("email"));
    // since the user change the email, need to set active = temp
    assertThat(responseBody.getActive()).isEqualTo(UserActiveEnum.TEMP);

    // password
    User updatedUser = this.entityManager.getEntityManager()
            .createQuery("select u from users u where u.userId = :userId", User.class)
            .setParameter("userId", UUID.fromString(dummyUserIdString))
            .getSingleResult();

    // to verify the bcrypted (hash) password, use 'matches(<raw_password>, <encrypted_password>)'
    assertThat(this.passwordEncoder.matches(dummyUserSignupForm.get("password").toString(), updatedUser.getPassword())).isTrue();
  }

  @Test
  // @Sql(scripts = {
  // "classpath:/integration/user/shouldMemberUserUpdateItsOwnData.sql" })
  public void shouldNotMemberUserUpdateItsOwnDataSinceNoIfMatch(/**
                                                * @Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json")
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
    String dummyVersion = "\"0\"";

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "update_email@test.com");
    dummyUserSignupForm.put("password", "test_PASSWORD");
    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders.put(targetUrl)
                    .content(dummyUserSignupForm.toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("you are missing version (If-Match) header.");
  }
  @Test
  // @Sql(scripts = {
  // "classpath:/integration/user/shouldMemberUserUpdateItsOwnData.sql" })
  public void shouldNotMemberUserUpdateItsOwnDataSinceVersionMismatch(/**
                                                                 * @Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json")
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
    String dummyVersion = "\"3\"";

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "update_email@test.com");
    dummyUserSignupForm.put("password", "test_PASSWORD");
    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders.put(targetUrl)
                    .content(dummyUserSignupForm.toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("If-Match", dummyVersion)
                    .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isPreconditionFailed());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the data was updated by others. please refresh.");
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserWhoVerifiedEmailUpdateItsOwnDataWithoutEmail.sql" })
  public void shouldMemberUserWhoVerifiedEmailUpdateItsOwnDataWithoutEmail() throws Exception {

    // dummy form json
    // JsonNode dummyFormJson =
    // this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    // String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;
    String dummyVersion = "\"0\"";

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "test_member@test.com"); // <- keep the same address
    dummyUserSignupForm.put("password", "test_PASSWORD");
    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders.put(targetUrl)
                    .content(dummyUserSignupForm.toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("If-Match", dummyVersion)
                    .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String etag = result.getResponse().getHeader("ETag");
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(etag).isEqualTo("\"2\""); // bumped up twice - issue-YPnuFX8S01a
    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getFirstName()).isEqualTo(dummyUserSignupForm.get("firstName"));
    assertThat(responseBody.getLastName()).isEqualTo(dummyUserSignupForm.get("lastName"));
    assertThat(responseBody.getEmail()).isEqualTo(dummyUserSignupForm.get("email"));
    // since the user change the email, need to set active = temp
    assertThat(responseBody.getActive()).isEqualTo(UserActiveEnum.ACTIVE);
    // password
    User updatedUser = this.entityManager.getEntityManager()
            .createQuery("select u from users u where u.userId = :userId", User.class)
            .setParameter("userId", UUID.fromString(dummyUserIdString))
            .getSingleResult();

    // to verify the bcrypted (hash) password, use 'matches(<raw_password>, <encrypted_password>)'
    assertThat(this.passwordEncoder.matches(dummyUserSignupForm.get("password").toString(), updatedUser.getPassword())).isTrue();

  }

  @Test
  // @Sql(scripts = {
  // "classpath:/integration/user/shouldMemberUserUpdateItsOwnData.sql" })
  public void shouldMemberUserUpdateItsOwnDataWithoutPassword() throws Exception {

    // dummy form json
    // JsonNode dummyFormJson =
    // this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    // String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;
    String dummyPassword = "test_PASSWORD";
    String dummyVersion = "\"0\"";

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "test_member@test.com"); // <- keep the same address
    //dummyUserSignupForm.put("password", "test_PASSWORD"); // <- ignore password so the same
    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders.put(targetUrl)
                    .content(dummyUserSignupForm.toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("If-Match", dummyVersion)
                    .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String etag = result.getResponse().getHeader("ETag");

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(etag).isEqualTo("\"1\"");
    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getFirstName()).isEqualTo(dummyUserSignupForm.get("firstName"));
    assertThat(responseBody.getLastName()).isEqualTo(dummyUserSignupForm.get("lastName"));
    assertThat(responseBody.getEmail()).isEqualTo(dummyUserSignupForm.get("email"));
    // this user does not verify the email so its active = temp and this request does not change the the email and ends up 'temp'
    assertThat(responseBody.getActive()).isEqualTo(UserActiveEnum.TEMP);
    // password
    User updatedUser = this.entityManager.getEntityManager()
            .createQuery("select u from users u where u.userId = :userId", User.class)
            .setParameter("userId", UUID.fromString(dummyUserIdString))
            .getSingleResult();

    // to verify the bcrypted (hash) password, use 'matches(<raw_password>, <encrypted_password>)'
    assertThat(this.passwordEncoder.matches(dummyPassword, updatedUser.getPassword())).isTrue();

  }
  @Test
  // @Sql(scripts = {
  // "classpath:/integration/user/shouldMemberUserUpdateOnlyNotNullProperty.sql"
  // })
  public void shouldMemberUserUpdateOnlyNotNullProperty(/**
                                                         * @Value("classpath:/integration/user/shouldMemberUserUpdateOnlyNotNullProperty.json")
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
    String dummyVersion = "\"0\"";

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "update_email@test.com");
    dummyUserSignupForm.put("password", "test_PASSWORD");
    // act
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.put(targetUrl)
        .content(dummyUserSignupForm.toString()).contentType(MediaType.APPLICATION_JSON)
        .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("If-Match", dummyVersion)
        .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON)).andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String etag = result.getResponse().getHeader("ETag");

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(etag).isEqualTo("\"2\""); // bumped up twice be careful. issue-YPnuFX8S01a

    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getLastName()).isEqualTo(dummyUserSignupForm.get("lastName"));

  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberUserUpdateOtherOwnData.sql" })
  public void shouldNotMemberUserUpdateOtherOwnData(/**
                                                     * @Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json")
                                                     * Resource dummyFormJsonFile
                                                     **/
  ) throws Exception {

    // dummy form json
    // JsonNode dummyFormJson =
    // this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    // String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = "29c845ad-54b1-430a-8a71-5caba98d5978";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;
    String dummyVersion = "\"0\"";

    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("userId", dummyUserIdString);
    dummyUserSignupForm.put("firstName", "updated first name");
    dummyUserSignupForm.put("lastName", "updated last name");
    dummyUserSignupForm.put("email", "update_email@test.com");
    dummyUserSignupForm.put("password", "test_PASSWORD");
    // act
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.put(targetUrl)
        .content(dummyUserSignupForm.toString()).contentType(MediaType.APPLICATION_JSON)
        .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("If-Match", dummyVersion)
        .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON)).andDo(print())
        .andExpect(status().isForbidden());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(403);
  }

  @Test
  // @Sql(scripts = {
  // "classpath:/integration/user/shouldMemberUserUploadAvatar.sql" })
  public void shouldMemberUserUploadAvatar(/**
                                            * @Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json")
                                            * Resource dummyFormJsonFile
                                            **/
  ) throws Exception {

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());

    // dummy form json
    // JsonNode dummyFormJson =
    // this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    // String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/avatar-image";
    String dummyVersion = "\"0\"";

    MockMultipartFile fileAtZeroIndex = new MockMultipartFile("avatarImage", "product-image-0.jpeg", "image/jpeg",
        "some jpg".getBytes());

    // act
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.multipart(targetUrl) // create
        .file(fileAtZeroIndex).contentType(MediaType.MULTIPART_FORM_DATA).cookie(this.authCookie)
                    .header("If-Match", dummyVersion)
        .cookie(this.csrfCookie).header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }

  /**
   * this does not work since MockMVC not trigger the spring.servlet.multipart.max-size.
   * see: https://stackoverflow.com/questions/55514396/spring-multipartfile-parameter-not-respecting-configured-maxfilesize
   *
   * need to find the workaround.
   *
   * @throws Exception
   */
  //@Test
  //// @Sql(scripts = {
  //// "classpath:/integration/user/shouldMemberUserUploadAvatar.sql" })
  //public void shouldNotMemberUserUploadAvatarSinceExceedMaxFileSize(
  //) throws Exception {

  //  Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());

  //  // dummy form json
  //  // JsonNode dummyFormJson =
  //  // this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

  //  // String dummyFormJsonString = dummyFormJson.toString();

  //  // arrange
  //  String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
  //  String dummyUserPath = "/" + dummyUserIdString;
  //  String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/avatar-image";

  //  byte[] bytes = new byte[1024 * 1024 * 1000]; // 100 mb
  //  MockMultipartFile fileAtZeroIndex = new MockMultipartFile("avatarImage", "product-image-0.jpeg", "image/jpeg",
  //          bytes);

  //  logger.info("satoshi");
  //  logger.info("" + fileAtZeroIndex.getBytes().length);

  //  // act
  //  ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.multipart(targetUrl) // create
  //                  .file(fileAtZeroIndex).contentType(MediaType.MULTIPART_FORM_DATA).cookie(this.authCookie)
  //                  .cookie(this.csrfCookie).header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
  //          .andDo(print()).andExpect(status().isBadRequest());

  //  MvcResult result = resultActions.andReturn();

  //  // assert
  //  assertThat(result.getResponse().getErrorMessage()).isEqualTo("file too big.");
  //}

  @Test
  // @Sql(scripts = {
  // "classpath:/integration/user/shouldMemberUserUploadAvatar.sql" })
  public void shouldMemberUserDeleteAvatar(/**
                                            * @Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json")
                                            * Resource dummyFormJsonFile
                                            **/
  ) throws Exception {

    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());
    // dummy form json
    // JsonNode dummyFormJson =
    // this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    // String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/avatar-image";
    String dummyVersion = "\"0\"";

    // act
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.delete(targetUrl)
        .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("If-Match", dummyVersion)
        .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON)).andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserGetAvatar.sql" })
  public void shouldMemberUserGetAvatar(/**
                                         * @Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json")
                                         * Resource dummyFormJsonFile
                                         **/
  ) throws Exception {

    byte[] dummyImage = "samoe bytes".getBytes();
    Mockito.when(this.s3Service.get(Mockito.any())).thenReturn(dummyImage);
    // dummy form json
    // JsonNode dummyFormJson =
    // this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    // String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyAvatarImageName = "dummy-avatar-image.jpeg";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetImagePath + dummyUserPath + "/avatar-image/"
        + dummyAvatarImageName;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // JsonNode contentAsJsonNode =
    // this.objectMapper.readValue(.getContentAsString(), JsonNode.class);
    // byte[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode,
    // byte[].class);
    // assert

    assertThat(result.getResponse().getContentAsByteArray()).isEqualTo(dummyImage);
  }

  @Test
  public void shouldMemberUserTempDeleteItsOwnAccountWithReason() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("activeNote", "some reason.");
    String dummyVersion = "\"0\"";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.patch(targetUrl).content(dummyFormJson.toString())
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    for (Cookie cookie: result.getResponse().getCookies()) {
      assertThat(cookie.getMaxAge()).isEqualTo(0); 
    }
  }

  @Test
  public void shouldMemberUserTempDeleteItsOwnAccountWithNoReason() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("activeNote", "");
    String dummyVersion = "\"0\"";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.patch(targetUrl).content(dummyFormJson.toString())
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    
    for (Cookie cookie: result.getResponse().getCookies()) {
      assertThat(cookie.getMaxAge()).isEqualTo(0); 
    }
  }

  @Test
  public void shouldNotMemberUserDeleteItsOwnAccountCompletely() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.delete(targetUrl).cookie(this.authCookie).cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isForbidden());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(403);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserGetAllOfItsOwnOrders.sql" })
  public void shouldMemberUserGetAllOfItsOwnOrders() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString + "/orders";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    for (OrderDTO orderDTO : responseBody) {
      // assert
      assertThat(orderDTO.getUser().getUserId().toString()).isEqualTo(dummyUserIdString);
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserGetSpecificOrderCompletely.sql" })
  public void shouldMemberUserGetSpecificOrderCompletely() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyOrderIdString = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String dummyUserPath = "/" + dummyUserIdString + "/orders/" + dummyOrderIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    // assert
    assertThat(responseBody.getOrderId().toString()).isEqualTo(dummyOrderIdString);
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(3);
    assertThat(responseBody.getOrderDetails().size()).isEqualTo(3);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.PAID);

    for (OrderEventDTO orderEventDTO : responseBody.getOrderEvents()) {
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
    }

    // assert
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberAddCancelOrderEventSuccessfully.sql" })
  public void shouldMemberAddCancelOrderEventSuccessfully(
      @Value("classpath:/integration/user/shouldMemberAddCancelOrderEventSuccessfully.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String dummyVersion = "\"0\"";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId
        + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    String etag = result.getResponse().getHeader("ETag");
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId().toString()).isEqualTo(dummyOrderId);
    assertThat(etag).isEqualTo("\"1\"");
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(4);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.CANCEL_REQUEST);
    assertThat(responseBody.getLatestOrderEvent().getUser().getUserId().toString()).isEqualTo(dummyUserIdString);

    for (OrderEventDTO orderEventDTO : responseBody.getOrderEvents()) {
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
    }

    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(OrderEventWasAddedByMemberEvent.class));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberAddCancelOrderEventSinceNoAddableAsNext.sql" })
  public void shouldNotMemberAddCancelOrderEventSinceNoAddableAsNext(
      @Value("classpath:/integration/user/shouldNotMemberAddCancelOrderEventSinceNoAddableAsNext.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String dummyVersion = "\"0\"";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId
        + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the order status is not addable as next one (target status: CANCEL_REQUEST and latest status: SHIPPED).");
    Mockito.verify(this.publisher, Mockito.never()).publishEvent(Mockito.any(OrderEventWasAddedByMemberEvent.class));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberAddCancelOrderEventSinceDuplication.sql" })
  public void shouldNotMemberAddCancelOrderEventSinceDuplication(
      @Value("classpath:/integration/user/shouldNotMemberAddCancelOrderEventSinceDuplication.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String dummyVersion = "\"0\"";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId
        + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the order status is not addable as next one (target status: CANCEL_REQUEST and latest status: CANCEL_REQUEST).");
    Mockito.verify(this.publisher, Mockito.never()).publishEvent(Mockito.any(OrderEventWasAddedByMemberEvent.class));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberAddReturnOrderEventSuccessfully.sql" })
  public void shouldMemberAddReturnOrderEventSuccessfully(
      @Value("classpath:/integration/user/shouldMemberAddReturnOrderEventSuccessfully.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String dummyVersion = "\"0\"";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId
        + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    String etag = result.getResponse().getHeader("ETag");
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId().toString()).isEqualTo(dummyOrderId);
    assertThat(etag).isEqualTo("\"1\"");
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(5);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.RETURN_REQUEST);
    assertThat(responseBody.getLatestOrderEvent().getUser().getUserId().toString()).isEqualTo(dummyUserIdString);

    for (OrderEventDTO orderEventDTO : responseBody.getOrderEvents()) {
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
    }
    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(OrderEventWasAddedByMemberEvent.class));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberAddReturnOrderEventSinceNoAddableAsNext.sql" })
  public void shouldNotMemberAddReturnOrderEventSinceNoAddableAsNext(
      @Value("classpath:/integration/user/shouldNotMemberAddReturnOrderEventSinceNoAddableAsNext.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String dummyVersion = "\"0\"";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId
        + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the order status is not addable as next one (target status: RETURN_REQUEST and latest status: PAID).");
    Mockito.verify(this.publisher, Mockito.never()).publishEvent(Mockito.any(OrderEventWasAddedByMemberEvent.class));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberAddReturnOrderEventSinceDuplication.sql" })
  public void shouldNotMemberAddReturnOrderEventSinceDuplication(
      @Value("classpath:/integration/user/shouldNotMemberAddReturnOrderEventSinceDuplication.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String dummyVersion = "\"0\"";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId
        + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the order status is not addable as next one (target status: RETURN_REQUEST and latest status: RETURN_REQUEST).");
    Mockito.verify(this.publisher, Mockito.never()).publishEvent(Mockito.any(OrderEventWasAddedByMemberEvent.class));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserVerifyItsAccount.sql" })
  public void shouldMemberUserVerifyItsAccount() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyToken = "dummy_token";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/account-verify?account-verify-token=" + dummyToken;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .get(targetUrl)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);
    assertThat(responseBody.getActive()).isEqualTo(UserActiveEnum.ACTIVE);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberUserVerifyItsAccountSinceInvalidToken.sql" })
  public void shouldNotMemberUserVerifyItsAccountSinceInvalidToken() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyToken = "invalid_token";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/account-verify?account-verify-token=" + dummyToken;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .get(targetUrl)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("verification token is invalid because of wrong value or expired.");

  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberUserVerifyItsAccountSinceExpiredToken.sql" })
  public void shouldNotMemberUserVerifyItsAccountSinceExpiredToken() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyToken = "dummy_token";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/account-verify?account-verify-token=" + dummyToken;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .get(targetUrl)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());


    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("verification token is invalid because of wrong value or expired.");

  }
  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberUserVerifyItsAccountSinceAlreadyVerified.sql" })
  public void shouldNotMemberUserVerifyItsAccountSinceAlreadyVerified() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyToken = "dummy_token";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/account-verify?account-verify-token=" + dummyToken;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .get(targetUrl)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("your account is already verified.");
  }

  // review
  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserGetReviewByProductIdAndUserId.sql" })
  public void shouldMemberUserGetReviewByProductIdAndUserId() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyProductIdString = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String dummyProductQueryString = "?productId=" + dummyProductIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/review" + dummyProductQueryString;
    String dummyReviewIdString = "100"; // check sql

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .get(targetUrl)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    String etag = result.getResponse().getHeader("ETag");
    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    FindReviewDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, FindReviewDTO.class);

    assertThat(responseBody.getIsExist()).isEqualTo(true);
    assertThat(etag).isEqualTo("\"0\"");
    assertThat(responseBody.getReview().getReviewId().toString()).isEqualTo(dummyReviewIdString);
    assertThat(responseBody.getUser().getUserId().toString()).isEqualTo(dummyUserIdString);
    assertThat(responseBody.getProduct().getProductId().toString()).isEqualTo(dummyProductIdString);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserReturnEmptyReviewByProductIdAndUserId.sql" })
  public void shouldMemberUserReturnEmptyReviewByProductIdAndUserId() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyProductIdString = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String dummyProductQueryString = "?productId=" + dummyProductIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/review" + dummyProductQueryString;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .get(targetUrl)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    String etag = result.getResponse().getHeader("ETag");
    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    FindReviewDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, FindReviewDTO.class);

    assertThat(responseBody.getIsExist()).isEqualTo(false);
    assertThat(responseBody.getReview()).isNull();
    assertThat(responseBody.getUser().getUserId().toString()).isEqualTo(dummyUserIdString);
    assertThat(responseBody.getProduct().getProductId().toString()).isEqualTo(dummyProductIdString);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserCreateNewReview.sql" })
  public void shouldMemberUserCreateNewReview(@Value("classpath:/integration/user/shouldMemberUserCreateNewReview.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json
    JsonNode dummyFormJson =this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyProductIdString = dummyFormJson.get("productId").asText();
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/reviews";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .post(targetUrl)
            .content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String etag = result.getResponse().getHeader("ETag");

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ReviewDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ReviewDTO.class);

    assertThat(responseBody.getIsVerified()).isEqualTo(false);
    assertThat(etag).isEqualTo("\"0\"");
    assertThat(responseBody.getReviewId()).isNotNull();
    assertThat(responseBody.getReviewTitle()).isEqualTo(dummyFormJson.get("reviewTitle").asText());
    assertThat(responseBody.getReviewDescription()).isEqualTo(dummyFormJson.get("reviewDescription").asText());
    assertThat(responseBody.getReviewPoint().toString()).isEqualTo(dummyFormJson.get("reviewPoint").asText());
    assertThat(responseBody.getUser().getUserId().toString()).isEqualTo(dummyUserIdString);
    assertThat(responseBody.getProduct().getProductId().toString()).isEqualTo(dummyProductIdString);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserUpdateNewReview.sql" })
  public void shouldMemberUserUpdateNewReview(@Value("classpath:/integration/user/shouldMemberUserUpdateNewReview.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json
    JsonNode dummyFormJson =this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyProductIdString = dummyFormJson.get("productId").asText();
    String dummyReviewIdString = "100";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/reviews/" + dummyReviewIdString;
    String dummyVersion = "\"0\"";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .put(targetUrl)
            .content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    String etag = result.getResponse().getHeader("ETag");
    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ReviewDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ReviewDTO.class);

    assertThat(responseBody.getIsVerified()).isEqualTo(false);
    assertThat(etag).isEqualTo("\"1\"");
    assertThat(responseBody.getReviewId().toString()).isEqualTo("100");
    assertThat(responseBody.getReviewTitle()).isEqualTo(dummyFormJson.get("reviewTitle").asText());
    assertThat(responseBody.getReviewDescription()).isEqualTo(dummyFormJson.get("reviewDescription").asText());
    assertThat(responseBody.getReviewPoint().toString()).isEqualTo(dummyFormJson.get("reviewPoint").asText());
    assertThat(responseBody.getUser().getUserId().toString()).isEqualTo(dummyUserIdString);
    assertThat(responseBody.getProduct().getProductId().toString()).isEqualTo(dummyProductIdString);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserUpdateNewReview.sql" })
  public void shouldMemberUserUpdateNewReviewSinceNoIfMatch(@Value("classpath:/integration/user/shouldMemberUserUpdateNewReview.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json
    JsonNode dummyFormJson =this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyProductIdString = dummyFormJson.get("productId").asText();
    String dummyReviewIdString = "100";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/reviews/" + dummyReviewIdString;
    String dummyVersion = "\"0\"";

    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders
                    .put(targetUrl)
                    .content(dummyFormJsonString)
                    .contentType(MediaType.APPLICATION_JSON)
                    .cookie(this.authCookie)
                    .cookie(this.csrfCookie)
                    .header("csrf-token", this.authInfo.getCsrfToken())
                    .accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("you are missing version (If-Match) header.");

  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserUpdateNewReview.sql" })
  public void shouldMemberUserUpdateNewReviewSinceVersionMismatch(@Value("classpath:/integration/user/shouldMemberUserUpdateNewReview.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json
    JsonNode dummyFormJson =this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyProductIdString = dummyFormJson.get("productId").asText();
    String dummyReviewIdString = "100";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/reviews/" + dummyReviewIdString;
    String dummyVersion = "\"3\"";

    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders
                    .put(targetUrl)
                    .content(dummyFormJsonString)
                    .contentType(MediaType.APPLICATION_JSON)
                    .cookie(this.authCookie)
                    .cookie(this.csrfCookie)
                    .header("csrf-token", this.authInfo.getCsrfToken())
                    .header("If-Match", dummyVersion)
                    .accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isPreconditionFailed());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the data was updated by others. please refresh.");
  }
  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserDeleteReview.sql" })
  public void shouldMemberUserDeleteReview() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyReviewIdString = "100"; // check sql
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/reviews/" + dummyReviewIdString;
    String dummyVersion = "\"0\"";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .delete(targetUrl)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
                .header("If-Match", dummyVersion)
                .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserDeleteReview.sql" })
  public void shouldNotMemberUserDeleteReviewSinceNoIfMatchHeader() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyReviewIdString = "100"; // check sql
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/reviews/" + dummyReviewIdString;
    String dummyVersion = "\"0\"";

    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders
                    .delete(targetUrl)
                    .cookie(this.authCookie)
                    .cookie(this.csrfCookie)
                    .header("csrf-token", this.authInfo.getCsrfToken())
                    .accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("you are missing version (If-Match) header.");
    // assert
  }

  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserDeleteReview.sql" })
  public void shouldNotMemberUserDeleteReviewSinceVersionMismatch() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String dummyReviewIdString = "100"; // check sql
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/reviews/" + dummyReviewIdString;
    String dummyVersion = "\"3\"";

    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders
                    .delete(targetUrl)
                    .cookie(this.authCookie)
                    .cookie(this.csrfCookie)
                    .header("csrf-token", this.authInfo.getCsrfToken())
                    .header("If-Match", dummyVersion)
                    .accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isPreconditionFailed());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the data was updated by others. please refresh.");
  }
}
