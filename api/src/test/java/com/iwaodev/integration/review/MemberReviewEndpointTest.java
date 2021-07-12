package com.iwaodev.integration.review;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
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
import com.iwaodev.config.MyTestConfiguration;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.review.event.NewReviewWasSubmittedEvent;
import com.iwaodev.domain.review.event.ReviewWasUpdatedByMemberEvent;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.util.ResourceReader;

import org.mockito.Mockito;
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
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
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
/**
 * bug: ApplicationEventPublisher with @MockBean does not create mocked ApplicationEventPublisher.
 *
 * workaournd: create this Testconfiguration class.
 *
 * ref: https://github.com/spring-projects/spring-framework/issues/18907
 *
 **/
@Import(MyTestConfiguration.class)
public class MemberReviewEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(MemberReviewEndpointTest.class);

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

  @MockBean
  private ApplicationEventPublisher publisher;

  private AuthenticationInfo authInfo;

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
    this.authInfo = this.authenticateTestUser.setup(this.entityManager, this.mvc, UserTypeEnum.MEMBER, this.port);

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
    this.csrfCookie = new Cookie("csrf-token", this.authInfo.getCsrfToken());
  }

  @Test
  public void shouldMemberUserAccessToThisGETEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/review/shouldMemberCreateNewReview.sql" })
  public void shouldMemberCreateNewReview(@Value("classpath:/integration/review/shouldMemberCreateNewReview.json") Resource dummyFormJsonFile) throws Exception {

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
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
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
    assertThat(responseBody.getIsVerified()).isEqualTo(false);
    assertThat(responseBody.getUser().getUserId().toString()).isEqualTo(dummyUserId);
    assertThat(responseBody.getProduct().getProductId().toString()).isEqualTo(dummyProductId);

    // event assert
    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(NewReviewWasSubmittedEvent.class));
    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(ReviewWasUpdatedByMemberEvent.class));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/review/shouldNotMemberCreateNewReviewSinceDuplication.sql" })
  public void shouldNotMemberCreateNewReviewSinceDuplication(@Value("classpath:/integration/review/shouldNotMemberCreateNewReviewSinceDuplication.json") Resource dummyFormJsonFile) throws Exception {

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
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
          .accept(MediaType.APPLICATION_JSON)
          )
      .andDo(print())
      .andExpect(status().isConflict());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(409);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/review/shouldMemberUpdateReview.sql" })
  public void shouldMemberUpdateReview(@Value("classpath:/integration/review/shouldMemberUpdateReview.json") Resource dummyFormJsonFile) throws Exception {

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
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
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
    assertThat(responseBody.getIsVerified()).isEqualTo(false);
    assertThat(responseBody.getUser().getUserId().toString()).isEqualTo(dummyUserId);
    assertThat(responseBody.getProduct().getProductId().toString()).isEqualTo(dummyProductId);

    // event
    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(ReviewWasUpdatedByMemberEvent.class));
  }
}

