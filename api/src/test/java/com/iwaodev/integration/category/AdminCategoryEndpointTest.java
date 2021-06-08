package com.iwaodev.integration.category;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.category.CategoryDTO;
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
/**
 * use real mysql
 **/
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
/**
 * test booster with spring boot
 **/
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
@ActiveProfiles("integtest")
/**
 * use mvcMock 
 **/
@AutoConfigureMockMvc
public class AdminCategoryEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(AdminCategoryEndpointTest.class);

  private static final String targetPath = "/categories";

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
  public void shouldAdminUserAccessToThisEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

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

  @Test
  public void shouldAdminCreateNewCategory(@Value("classpath:/integration/category/shouldAdminCreateNewCategory.json") Resource dummyFormJsonFile) throws Exception {

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .post(targetUrl) // create
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());


    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    CategoryDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, CategoryDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getCategoryId()).isGreaterThan(0);
    assertThat(responseBody.getCategoryName()).isEqualTo(dummyFormJson.get("categoryName").asText());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/category/shouldAdminUpdateCategory.sql" })
  public void shouldAdminUpdateCategory(@Value("classpath:/integration/category/shouldAdminUpdateCategory.json") Resource dummyFormJsonFile) throws Exception {

    // make sure categoryId match the one in sql and json

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyFormJson.get("categoryId").asText();

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .put(targetUrl) // update/replace
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());


    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    CategoryDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, CategoryDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getCategoryId()).isEqualTo(dummyFormJson.get("categoryId").asLong());
    assertThat(responseBody.getCategoryName()).isEqualTo(dummyFormJson.get("categoryName").asText());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/category/shouldAdminDeleteCategory.sql" })
  public void shouldAdminDeleteCategory() throws Exception {

    // make sure category id match the one in sql

    // arrange
    Long dummyCategoryId = 100L;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyCategoryId.toString();

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .delete(targetUrl) // delete 
          .cookie(this.authCookie)
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());


    MvcResult result = resultActions.andReturn();

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }
}
