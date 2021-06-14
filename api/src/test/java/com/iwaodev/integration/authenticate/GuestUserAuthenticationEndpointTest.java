package com.iwaodev.integration.authenticate;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.data.BaseDatabaseSetup;

// MockMvc stuff
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
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
public class GuestUserAuthenticationEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(GuestUserAuthenticationEndpointTest.class);

  private static final String targetPath = "/authenticate";

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
  public void shouldGuestGet404ResponseSinceEmailDoesNotExist() throws Exception {

    // arrange
    String dummyEmail = "test_member1@does-not-exist.com"; // must match test user 
    String dummyPassword = "test_password"; // must match test user 
    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("email", dummyEmail);
    dummyUserSignupForm.put("password", dummyPassword);

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    mvc.perform(MockMvcRequestBuilders
        .post(targetUrl)
        .contentType(MediaType.APPLICATION_JSON)
        .content(dummyUserSignupForm.toString())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isNotFound());
  }

  @Test
  public void shouldGuestGet400ResponseSinceWrongPassword() throws Exception {

    // arrange
    String dummyEmail = "test_member@test.com"; // must match test user 
    String dummyPassword = "wrong_password"; // must match test user 
    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("email", dummyEmail);
    dummyUserSignupForm.put("password", dummyPassword);

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    mvc.perform(MockMvcRequestBuilders
        .post(targetUrl)
        .contentType(MediaType.APPLICATION_JSON)
        .content(dummyUserSignupForm.toString())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isBadRequest());
  }

  @Test
  public void shouldGuestCanLogin() throws Exception {

    // arrange
    String dummyEmail = "test_member@test.com"; // must match test user 
    String dummyPassword = "test_password"; // must match test user 
    JSONObject dummyUserSignupForm = new JSONObject();
    dummyUserSignupForm.put("email", dummyEmail);
    dummyUserSignupForm.put("password", dummyPassword);

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    mvc.perform(MockMvcRequestBuilders
        .post(targetUrl)
        .contentType(MediaType.APPLICATION_JSON)
        .content(dummyUserSignupForm.toString())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk());
  }

  //@Test
  //@Sql(scripts = { "classpath:/integration/category/shouldGuestUserFilterCategoryListWithSearchQuery.sql" })
  //public void shouldGuestUserFilterCategoryListWithSearchQuery() throws Exception {

  //  // arrange
  //  String dummySearchQueryString = "game";
  //  String searchQueryString = "?searchQuery=" + dummySearchQueryString;
  //  String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQueryString;

  //  // act
  //  ResultActions resultActions = mvc.perform(
  //      MockMvcRequestBuilders
  //      .get(targetUrl)
  //      .accept(MediaType.APPLICATION_JSON)
  //      )
  //      .andDo(print())
  //      .andExpect(status().isOk());

  //  MvcResult result = resultActions.andReturn();

  //  JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
  //  CategoryDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), CategoryDTO[].class);

  //  // assert
  //  assertThat(responseBody.length).isGreaterThan(0);
  //  for (CategoryDTO categoryDto : responseBody) {
  //    // check if the dummy string contains either name, or description
  //    assertThat(
  //        categoryDto.getCategoryName().contains(dummySearchQueryString) || categoryDto.getCategoryDescription().contains(dummySearchQueryString)
  //            ).isEqualTo(true);
  //  }
  //}

  //@Test
  //@Sql(scripts = { "classpath:/integration/category/shouldGuestUserObtainTotalProductCountProperty.sql" })
  //public void shouldGuestUserObtainTotalProductCountProperty() throws Exception {

  //  // arrange
  //  String targetUrl = "http://localhost:" + this.port + this.targetPath;

  //  // act
  //  ResultActions resultActions = mvc.perform(
  //      MockMvcRequestBuilders
  //      .get(targetUrl)
  //      .accept(MediaType.APPLICATION_JSON)
  //      )
  //      .andDo(print())
  //      .andExpect(status().isOk());

  //  MvcResult result = resultActions.andReturn();

  //  JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
  //  CategoryDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), CategoryDTO[].class);

  //  // assert
  //  assertThat(responseBody.length).isGreaterThan(0);
  //  for (CategoryDTO categoryDto : responseBody) {
  //    // check if the dummy string contains either name, or description
  //    assertThat(categoryDto.getTotalProductCount()).isEqualTo(0);
  //  }
  //}

  //@Test
  //public void shouldNotGuestUserAccessToThisPostEndpoint() throws Exception {

  //  String targetUrl = "http://localhost:" + this.port + this.targetPath;

  //  // act
  //  mvc.perform(MockMvcRequestBuilders.post(targetUrl).accept(MediaType.APPLICATION_JSON))
  //      .andDo(print())
  //      .andExpect(status().isForbidden());
  //}

  //@Test
  //public void shouldNotGuestUserAccessToThisPutEndpoint() throws Exception {

  //  String targetUrl = "http://localhost:" + this.port + this.targetPath + "/100"; // <- does not exist

  //  // act
  //  mvc.perform(MockMvcRequestBuilders.put(targetUrl).accept(MediaType.APPLICATION_JSON))
  //      .andDo(print())
  //      .andExpect(status().isForbidden());
  //}

  //@Test
  //public void shouldNotGuestUserAccessToThisDeleteEndpoint() throws Exception {

  //  String targetUrl = "http://localhost:" + this.port + this.targetPath + "/100"; // <- does not exist

  //  // act
  //  mvc.perform(MockMvcRequestBuilders.delete(targetUrl).accept(MediaType.APPLICATION_JSON))
  //      .andDo(print())
  //      .andExpect(status().isForbidden());
  //}
}

