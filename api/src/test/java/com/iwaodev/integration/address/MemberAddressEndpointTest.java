package com.iwaodev.integration.address;

import static org.assertj.core.api.Assertions.assertThat;

import javax.persistence.EntityManager;
import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.user.AddressDTO;
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
public class MemberAddressEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(MemberAddressEndpointTest.class);

  private String targetPath = "/users/%s/addresses";

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
  //@Sql(scripts = { "classpath:/integration/address/shouldMemberUserUpdateItsOwnData.sql" })
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
  @Sql(scripts = { "classpath:/integration/address/shouldMemberGetAllOfItsOwnAddress.sql" })
  public void shouldMemberGetAllOfItsOwnAddress(/*@Value("classpath:/integration/user/shouldMemberGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

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

    AddressDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, AddressDTO[].class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.length).isGreaterThan(0);
    for (AddressDTO address : responseBody) {
      assertThat(address.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    }
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/address/shouldMemberGetAllOfItsOwnAddress.sql" })
  public void shouldNotMemberGetAllOfAddressForOtherUser(/*@Value("classpath:/integration/user/shouldMemberGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

    // dummy form json 
    //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    //String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, "038b6f4c-b100-4b32-9c21-fd17ec52a605");

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
  //@Sql(scripts = { "classpath:/integration/address/shouldMemberGetAllOfItsOwnAddress.sql" })
  public void shouldMemberCreateNewAddress(@Value("classpath:/integration/address/shouldMemberCreateNewAddress.json") Resource dummyFormJsonFile) throws Exception {

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
    AddressDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, AddressDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getAddress1()).isEqualTo(dummyFormJson.get("address1").asText());
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/address/shouldMemberGetAllOfItsOwnAddress.sql" })
  public void shouldNotMemberCreateNewAddressOfOtherUser(@Value("classpath:/integration/address/shouldNotMemberCreateNewAddressOfOtherUser.json") Resource dummyFormJsonFile) throws Exception {

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
  //@Sql(scripts = { "classpath:/integration/address/shouldMemberGetAllOfItsOwnAddress.sql" })
  public void shouldNotMemberCreateNewAddressSinceBadRequest(@Value("classpath:/integration/address/shouldNotMemberCreateNewAddressSinceBadRequest.json") Resource dummyFormJsonFile) throws Exception {

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
  @Sql(scripts = { "classpath:/integration/address/shouldMemberUpdateAddress.sql" })
  public void shouldMemberUpdateAddress(@Value("classpath:/integration/address/shouldMemberUpdateAddress.json") Resource dummyFormJsonFile) throws Exception {

    // make sure address_id match with sql and json

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyFormJson.get("addressId").asText();
    String dummyVersion = "\"0\"";

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .put(targetUrl) // update
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
                .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    AddressDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, AddressDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
    assertThat(responseBody.getAddressId()).isEqualTo(dummyFormJson.get("addressId").asLong());
    assertThat(responseBody.getAddress1()).isEqualTo(dummyFormJson.get("address1").asText());
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/address/shouldMemberUpdateAddress.sql" })
  public void shouldNotMemberUpdateAddressSinceNotFound(@Value("classpath:/integration/address/shouldNotMemberUpdateAddressSinceNotFound.json") Resource dummyFormJsonFile) throws Exception {

    // make sure address_id match with sql and json

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyFormJson.get("addressId").asText();

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
  @Sql(scripts = { "classpath:/integration/address/shouldMemberToggleBillingAddressSelection.sql" })
  public void shouldMemberToggleBillingAddressSelection(/**@Value("classpath:/integration/phone/shouldMemberTogglePhoneSelection.json") Resource dummyFormJsonFile**/) throws Exception {

    // make sure phone_id match with sql and json
    
    String dummyNewSelectedAddressId = "100"; // must match with sql
    String dummyOldSelectedAddressId = "101"; // must match with sql

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyNewSelectedAddressId;
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("type", "billing");
    String dummyVersion = "\"0\"";

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .patch(targetUrl) // update
          .content(dummyFormJson.toString())
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
                .header("If-Match", dummyVersion)
                .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    AddressDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, AddressDTO[].class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    for (AddressDTO address : responseBody) {
      // lombok kills type system!!! don't forget to match the type!!
      if (address.getAddressId().toString().equals(dummyNewSelectedAddressId)) {
        assertThat(address.getIsBillingAddress()).isEqualTo(true);
      } else {
        assertThat(address.getIsBillingAddress()).isEqualTo(false);
      }
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/address/shouldMemberToggleShippingAddressSelection.sql" })
  public void shouldMemberToggleShippingAddressSelection(/**@Value("classpath:/integration/phone/shouldMemberTogglePhoneSelection.json") Resource dummyFormJsonFile**/) throws Exception {

    // make sure phone_id match with sql and json
    
    String dummyNewSelectedAddressId = "100"; // must match with sql
    String dummyOldSelectedAddressId = "101"; // must match with sql

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyNewSelectedAddressId;
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("type", "shipping");
    String dummyVersion = "\"0\"";

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .patch(targetUrl) // update
          .content(dummyFormJson.toString())
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
                .header("If-Match", dummyVersion)
                .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    AddressDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, AddressDTO[].class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    for (AddressDTO address : responseBody) {
      // lombok kills type system!!! don't forget to match the type!!
      if (address.getAddressId().toString().equals(dummyNewSelectedAddressId)) {
        assertThat(address.getIsShippingAddress()).isEqualTo(true);
      } else {
        assertThat(address.getIsShippingAddress()).isEqualTo(false);
      }
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/address/shouldMemberDeleteAddress.sql" })
  public void shouldMemberDeleteAddress() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/100"; // check the sql to match address id (e.g., 100)
    String dummyVersion = "\"0\"";

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .delete(targetUrl) // remove
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
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
  //@Sql(scripts = { "classpath:/integration/address/shouldNotMemberDeleteAddressOfOtherUser.sql" })
  public void shouldNotMemberDeleteAddressOfOtherUser() throws Exception {

    // arrange
    String dummyUserId = "d8f06104-0ab4-42e6-933e-9ba303beb7a9";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyUserId) + "/100"; // check the sql to match address id (e.g., 100)

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

