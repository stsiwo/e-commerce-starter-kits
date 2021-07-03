package com.iwaodev.integration.user;

import static org.assertj.core.api.Assertions.assertThat;

import javax.persistence.EntityManager;
import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.iservice.S3Service;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.OrderStatusEnum;
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
import org.springframework.mock.web.MockMultipartFile;
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
    mvc.perform(
        MockMvcRequestBuilders
          .get(targetUrl)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
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
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(responseBody.getUserId().toString()).isEqualTo(dummyUserIdString);
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
  //@Sql(scripts = { "classpath:/integration/user/shouldMemberUserUpdateItsOwnData.sql" })
  public void shouldMemberUserUpdateItsOwnData(/**@Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json") Resource dummyFormJsonFile**/) throws Exception {

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    //String dummyFormJsonString = dummyFormJson.toString();

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
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .put(targetUrl)
        .content(dummyUserSignupForm.toString())
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
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getLastName()).isEqualTo(dummyUserSignupForm.get("lastName"));

  }

  @Test
  //@Sql(scripts = { "classpath:/integration/user/shouldMemberUserUpdateOnlyNotNullProperty.sql" })
  public void shouldMemberUserUpdateOnlyNotNullProperty(/**@Value("classpath:/integration/user/shouldMemberUserUpdateOnlyNotNullProperty.json") Resource dummyFormJsonFile**/) throws Exception {

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    //String dummyFormJsonString = dummyFormJson.toString();

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
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .put(targetUrl)
        .content(dummyUserSignupForm.toString())
        .contentType(MediaType.APPLICATION_JSON)
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
    UserDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, UserDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getLastName()).isEqualTo(dummyUserSignupForm.get("lastName"));


  }
  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberUserUpdateOtherOwnData.sql" })
  public void shouldNotMemberUserUpdateOtherOwnData(/**@Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json") Resource dummyFormJsonFile**/) throws Exception {

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
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .put(targetUrl)
        .content(dummyUserSignupForm.toString())
        .contentType(MediaType.APPLICATION_JSON)
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
  //@Sql(scripts = { "classpath:/integration/user/shouldMemberUserUploadAvatar.sql" })
  public void shouldMemberUserUploadAvatar(/**@Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json") Resource dummyFormJsonFile**/) throws Exception {

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/avatar-image";

    MockMultipartFile fileAtZeroIndex = new MockMultipartFile("avatarImage", "product-image-0.jpeg", "image/jpeg", "some jpg".getBytes());

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .multipart(targetUrl) // create
        .file(fileAtZeroIndex)
        .contentType(MediaType.MULTIPART_FORM_DATA)
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
  //@Sql(scripts = { "classpath:/integration/user/shouldMemberUserUploadAvatar.sql" })
  public void shouldMemberUserDeleteAvatar(/**@Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json") Resource dummyFormJsonFile**/) throws Exception {

    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());
    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/avatar-image";

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .delete(targetUrl)
        .contentType(MediaType.APPLICATION_JSON)
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
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserGetAvatar.sql" })
  public void shouldMemberUserGetAvatar(/**@Value("classpath:/integration/user/shouldMemberUserUpdateItsOwnData.json") Resource dummyFormJsonFile**/) throws Exception {

    byte[] dummyImage = "samoe bytes".getBytes();
    Mockito.when(this.s3Service.get(Mockito.any())).thenReturn(dummyImage);
    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyAvatarImageName = "dummy-avatar-image.jpeg";
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetImagePath + dummyUserPath + "/avatar-image/" + dummyAvatarImageName;

    // act
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

    //JsonNode contentAsJsonNode = this.objectMapper.readValue(.getContentAsString(), JsonNode.class);
    //byte[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, byte[].class);
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

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .patch(targetUrl)
        .content(dummyFormJson.toString())
        .contentType(MediaType.APPLICATION_JSON)
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
  public void shouldMemberUserTempDeleteItsOwnAccountWithNoReason() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("activeNote", "");

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .patch(targetUrl)
        .content(dummyFormJson.toString())
        .contentType(MediaType.APPLICATION_JSON)
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
  public void shouldNotMemberUserDeleteItsOwnAccountCompletely() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .delete(targetUrl)
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
  @Sql(scripts = { "classpath:/integration/user/shouldMemberUserGetSpecificOrderCompletely.sql" })
  public void shouldMemberUserGetSpecificOrderCompletely() throws Exception {

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyOrderIdString = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String dummyUserPath = "/" + dummyUserIdString + "/orders/" + dummyOrderIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath;

    // act
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
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    // assert
    assertThat(responseBody.getOrderId().toString()).isEqualTo(dummyOrderIdString);
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(3);
    assertThat(responseBody.getOrderDetails().size()).isEqualTo(3);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.PAID);

    for (OrderEventDTO orderEventDTO : responseBody.getOrderEvents()) {
      logger.info(orderEventDTO.toString());
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
    }

    // assert
  }
  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldMemberAddCancelOrderEventSuccessfully.sql" })
  public void shouldMemberAddCancelOrderEventSuccessfully(@Value("classpath:/integration/user/shouldMemberAddCancelOrderEventSuccessfully.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId + "/events";

    // act
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
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId().toString()).isEqualTo(dummyOrderId);
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(4);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.CANCEL_REQUEST);
    assertThat(responseBody.getLatestOrderEvent().getUser().getUserId().toString()).isEqualTo(dummyUserIdString);

    for (OrderEventDTO orderEventDTO : responseBody.getOrderEvents()) {
      logger.info(orderEventDTO.toString());
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
    }
  }
  
  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberAddCancelOrderEventSinceNoAddableAsNext.sql" })
  public void shouldNotMemberAddCancelOrderEventSinceNoAddableAsNext(@Value("classpath:/integration/user/shouldNotMemberAddCancelOrderEventSinceNoAddableAsNext.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId + "/events";

    // act
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
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberAddCancelOrderEventSinceDuplication.sql" })
  public void shouldNotMemberAddCancelOrderEventSinceDuplication(@Value("classpath:/integration/user/shouldNotMemberAddCancelOrderEventSinceDuplication.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId + "/events";

    // act
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
  @Sql(scripts = { "classpath:/integration/user/shouldMemberAddReturnOrderEventSuccessfully.sql" })
  public void shouldMemberAddReturnOrderEventSuccessfully(@Value("classpath:/integration/user/shouldMemberAddReturnOrderEventSuccessfully.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId + "/events";

    // act
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
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId().toString()).isEqualTo(dummyOrderId);
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(5);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.RETURN_REQUEST);
    assertThat(responseBody.getLatestOrderEvent().getUser().getUserId().toString()).isEqualTo(dummyUserIdString);

    for (OrderEventDTO orderEventDTO : responseBody.getOrderEvents()) {
      logger.info(orderEventDTO.toString());
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
    }
  }
  
  @Test
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberAddReturnOrderEventSinceNoAddableAsNext.sql" })
  public void shouldNotMemberAddReturnOrderEventSinceNoAddableAsNext(@Value("classpath:/integration/user/shouldNotMemberAddReturnOrderEventSinceNoAddableAsNext.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId + "/events";

    // act
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
  @Sql(scripts = { "classpath:/integration/user/shouldNotMemberAddReturnOrderEventSinceDuplication.sql" })
  public void shouldNotMemberAddReturnOrderEventSinceDuplication(@Value("classpath:/integration/user/shouldNotMemberAddReturnOrderEventSinceDuplication.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";

    // arrange
    String dummyUserIdString = this.authInfo.getAuthUser().getUserId().toString();
    String dummyUserPath = "/" + dummyUserIdString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + dummyUserPath + "/orders/" + dummyOrderId + "/events";

    // act
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
}
