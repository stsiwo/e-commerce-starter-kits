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
import com.iwaodev.ui.response.ErrorBaseResponse;
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
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
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

  @Autowired
  private ApplicationContext applicationContext;

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

  @Autowired
  private MessageSource messageSource;

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
    logger.info("start calling setup before - satoshi");

    this.baseDatabaseSetup.setup(this.entityManager);

    // send authentication request before testing
    this.authInfo = this.authenticateTestUser.setup(this.entityManager, this.mvc, UserTypeEnum.ADMIN, this.port);

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
    this.csrfCookie = new Cookie("csrf-token", this.authInfo.getCsrfToken());
  }

  @Test
  public void shouldAdminUserAccessToThisEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    mvc.perform(MockMvcRequestBuilders
        .get(targetUrl)
        .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/category/shouldAdminGetAllCategories.sql" })
  public void shouldAdminGetAllCategories() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    CategoryDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), CategoryDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (CategoryDTO categoryDto : responseBody) {
      assertThat(categoryDto.getCategoryId()).isNotNull();
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/category/shouldAdminGetAllCategoriesWithSearchQueryFilter.sql" })
  public void shouldAdminGetAllCategoriesWithSearchQueryFilter() throws Exception {

    // arrange
    String dummySearchQueryString = "game"; // make sure this match with sql
    String searchQuery = "?searchQuery=" + dummySearchQueryString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQuery;

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.get(targetUrl)
        .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    CategoryDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), CategoryDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (CategoryDTO categoryDto : responseBody) {
      assertThat(
      categoryDto.getCategoryName().contains(dummySearchQueryString) || categoryDto.getCategoryDescription().contains(dummySearchQueryString)
      ).isTrue();
      assertThat(categoryDto.getCategoryId()).isNotNull();
    }
  }

  @Test
  public void shouldAdminCreateNewCategory(
      @Value("classpath:/integration/category/shouldAdminCreateNewCategory.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.post(targetUrl) // create
        .content(dummyFormJsonString).contentType(MediaType.APPLICATION_JSON)
        .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    CategoryDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, CategoryDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getCategoryId()).isGreaterThan(0);
    assertThat(responseBody.getCategoryName()).isEqualTo(dummyFormJson.get("categoryName").asText());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/category/shouldNotAdminCreateNewCategorySinceNameDuplication.sql" })
  public void shouldNotAdminCreateNewCategorySinceNameDuplication(
      @Value("classpath:/integration/category/shouldNotAdminCreateNewCategorySinceNameDuplication.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.post(targetUrl) // create
        .content(dummyFormJsonString).contentType(MediaType.APPLICATION_JSON)
        .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isBadRequest());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/category/shouldNotAdminCreateNewCategorySincePathDuplication.sql" })
  public void shouldNotAdminCreateNewCategorySincePathDuplication(
      @Value("classpath:/integration/category/shouldNotAdminCreateNewCategorySincePathDuplication.json") Resource dummyFormJsonFile)
      throws Exception {

    String[] allBeanNames = this.applicationContext.getBeanDefinitionNames();
    for (String beanName : allBeanNames) {
      System.out.println(beanName);
    }

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.post(targetUrl) // create
        .content(dummyFormJsonString).contentType(MediaType.APPLICATION_JSON)
        .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isBadRequest());
  }

  @Test
  //@Sql(scripts = { "classpath:/integration/category/shouldNotAdminCreateNewCategorySincePathInvalidFormat.sql" })
  public void shouldNotAdminCreateNewCategorySincePathInvalidFormat(
      @Value("classpath:/integration/category/shouldNotAdminCreateNewCategorySincePathInvalidFormat.json") Resource dummyFormJsonFile)
      throws Exception {

    String[] allBeanNames = this.applicationContext.getBeanDefinitionNames();
    for (String beanName : allBeanNames) {
      System.out.println(beanName);
    }

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.post(targetUrl) // create
        .content(dummyFormJsonString).contentType(MediaType.APPLICATION_JSON)
        .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo(this.messageSource.getMessage("category.path.invalidformat", new Object[0], LocaleContextHolder.getLocale()));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/category/shouldAdminUpdateCategory.sql" })
  public void shouldAdminUpdateCategory(
      @Value("classpath:/integration/category/shouldAdminUpdateCategory.json") Resource dummyFormJsonFile)
      throws Exception {

    // make sure categoryId match the one in sql and json

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/"
        + dummyFormJson.get("categoryId").asText();

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.put(targetUrl) // update/replace
        .content(dummyFormJsonString).contentType(MediaType.APPLICATION_JSON)
        .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    CategoryDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, CategoryDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getCategoryId().toString()).isEqualTo(dummyFormJson.get("categoryId").asText());
    assertThat(responseBody.getCategoryName()).isEqualTo(dummyFormJson.get("categoryName").asText());
    assertThat(responseBody.getCategoryDescription()).isEqualTo(dummyFormJson.get("categoryDescription").asText());
    assertThat(responseBody.getCategoryPath()).isEqualTo(dummyFormJson.get("categoryPath").asText());


  }

  @Test
  @Sql(scripts = { "classpath:/integration/category/shouldAdminDeleteCategory.sql" })
  public void shouldAdminDeleteCategory() throws Exception {

    // make sure category id match the one in sql

    // arrange
    Long dummyCategoryId = 100L;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyCategoryId.toString();

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.delete(targetUrl) // delete
        .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }
}
