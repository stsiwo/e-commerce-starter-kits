package com.iwaodev.integration.review;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.product.ProductImageDTO;
import com.iwaodev.application.dto.product.ProductVariantDTO;
import com.iwaodev.application.dto.review.ReviewDTO;
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
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
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
public class AdminReviewEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(AdminReviewEndpointTest.class);

  private static final String targetPath = "/reviews";

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

  private AuthenticationInfo authInfo;

  private Cookie authCookie;

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
  public void shouldAdminUserAccessToThisGETEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
          .cookie(this.authCookie)
        .accept(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/review/shouldAdminGetAllOfReview.sql" })
  public void shouldAdminGetAllOfReview(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnReview.json") Resource dummyFormJsonFile*/) throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

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
    ReviewDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ReviewDTO[].class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.length).isGreaterThan(0);
    for (ReviewDTO review : responseBody) {
      assertThat(review.getReviewId().toString()).isNotNull();
      assertThat(review.getUser().getUserId().toString()).isNotNull();
      assertThat(review.getProduct().getProductId().toString()).isNotNull();
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/review/shouldAdminCreateNewReview.sql" })
  public void shouldAdminCreateNewReview(@Value("classpath:/integration/review/shouldAdminCreateNewReview.json") Resource dummyFormJsonFile) throws Exception {

    // product id & user id must be corresponding to sql & json file and here.

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    String dummyProductId = dummyFormJson.get("productId").asText();
    String dummyUserId = dummyFormJson.get("userId").asText();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath; 

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .post(targetUrl)
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ReviewDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ReviewDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getReviewId().toString()).isNotNull();
    assertThat(responseBody.getUser().getUserId().toString()).isEqualTo(dummyUserId);
    assertThat(responseBody.getProduct().getProductId().toString()).isEqualTo(dummyProductId);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/review/shouldNotAdminCreateNewReviewSinceDuplication.sql" })
  public void shouldNotAdminCreateNewReviewSinceDuplication(@Value("classpath:/integration/review/shouldNotAdminCreateNewReviewSinceDuplication.json") Resource dummyFormJsonFile) throws Exception {

    // product id & user id must be corresponding to sql & json file and here.

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    String dummyProductId = dummyFormJson.get("productId").asText();
    String dummyUserId = dummyFormJson.get("userId").asText();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath; 

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .post(targetUrl)
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isConflict());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(409);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/review/shouldAdminUpdateReview.sql" })
  public void shouldAdminUpdateReview(@Value("classpath:/integration/review/shouldAdminUpdateReview.json") Resource dummyFormJsonFile) throws Exception {

    // product id & user id must be corresponding to sql & json file and here.

    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    String dummyReviewId = dummyFormJson.get("reviewId").asText();
    String dummyProductId = dummyFormJson.get("productId").asText();
    String dummyUserId = dummyFormJson.get("userId").asText();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyReviewId; 

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .put(targetUrl)
          .content(dummyFormJsonString)
          .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ReviewDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ReviewDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getReviewId().toString()).isEqualTo(dummyReviewId);
    assertThat(responseBody.getIsVerified()).isEqualTo(true);
    assertThat(responseBody.getUser().getUserId().toString()).isEqualTo(dummyUserId);
    assertThat(responseBody.getProduct().getProductId().toString()).isEqualTo(dummyProductId);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/review/shouldAdminDeleteReview.sql" })
  public void shouldAdminDeleteReview(/**@Value("classpath:/integration/review/shouldAdminDeleteReview.json") Resource dummyFormJsonFile**/) throws Exception {

    // product id & user id must be corresponding to sql & json file and here.

    String dummyReviewId = "100"; 

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyReviewId; 

    // act & assert
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
          .delete(targetUrl)
          .cookie(this.authCookie)
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }
}

