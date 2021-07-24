package com.iwaodev.integration.productVariant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.productVariant.ProductVariantDTO;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.Product;
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
public class AdminProductVariantEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(AdminProductVariantEndpointTest.class);

  private static final String targetPath = "/products/%s/variants";

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
    this.authInfo = this.authenticateTestUser.setup(this.entityManager, this.mvc, UserTypeEnum.ADMIN, this.port);

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
    this.csrfCookie = new Cookie("csrf-token", this.authInfo.getCsrfToken());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserAccessToThisGETEndpoint.sql" })
  public void shouldAdminUserAccessToThisGETEndpoint() throws Exception {

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId);

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
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariant.sql" })
  public void shouldAdminUserCreateNewProductVariant(
      @Value("classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariant.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId);

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .post(targetUrl) // create
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductVariantDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductVariantDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getVariantId()).isNotNull();
    assertThat(responseBody.getProductSize().getProductSizeName()).isEqualTo(dummyFormJson.get("productSize").get("productSizeName").asText());
    // regular price = 10.00 (make sure match with sql & json)
    assertThat(responseBody.getRegularPrice().toString()).isEqualTo(dummyFormJson.get("variantUnitPrice").asText());
    assertThat(responseBody.getIsDiscountAvailable()).isEqualTo(true);
    assertThat(responseBody.getCurrentPrice().toString()).isEqualTo(dummyFormJson.get("variantDiscountPrice").asText());
    /**
     * need to check product.cheapestPrice/highestPrice but thsi variant endpoint just return the updated variant so need to refatcor
     **/
  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariantWithDiscountFalseSincePassedDate.sql" })
  public void shouldAdminUserCreateNewProductVariantWithDiscountFalseSincePassedDate(
      @Value("classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariantWithDiscountFalseSincePassedDate.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId);

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .post(targetUrl) // create
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductVariantDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductVariantDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getVariantId()).isNotNull();
    assertThat(responseBody.getProductSize().getProductSizeName()).isEqualTo(dummyFormJson.get("productSize").get("productSizeName").asText());
    // regular price = 10.00 (make sure match with sql & json)
    //assertThat(responseBody.getRegularPrice().toString()).isEqualTo(dummyFormJson.get("variantUnitPrice").asText());
    assertThat(responseBody.getIsDiscountAvailable()).isEqualTo(false);
    assertThat(responseBody.getCurrentPrice().toString()).isEqualTo(dummyFormJson.get("variantUnitPrice").asText());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariantWithDiscountTrueSinceDuringDate.sql" })
  public void shouldAdminUserCreateNewProductVariantWithDiscountTrueSinceDuringDate(
      @Value("classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariantWithDiscountTrueSinceDuringDate.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId);

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .post(targetUrl) // create
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductVariantDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductVariantDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getVariantId()).isNotNull();
    assertThat(responseBody.getProductSize().getProductSizeName()).isEqualTo(dummyFormJson.get("productSize").get("productSizeName").asText());
    // regular price = 10.00 (make sure match with sql & json)
    //assertThat(responseBody.getRegularPrice().toString()).isEqualTo(dummyFormJson.get("variantUnitPrice").asText());
    assertThat(responseBody.getIsDiscountAvailable()).isEqualTo(true);
    assertThat(responseBody.getCurrentPrice().toString()).isEqualTo(dummyFormJson.get("variantDiscountPrice").asText());
  }

  /**
   * this means discountStartDate and discountEndDate are the same date.
   * @param dummyFormJsonFile
   * @throws Exception
   */
  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariantWithDiscountTrueSinceSingleDayDiscount.sql" })
  public void shouldAdminUserCreateNewProductVariantWithDiscountTrueSinceSingleDayDiscount(
          @Value("classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariantWithDiscountTrueSinceSingleDayDiscount.json") Resource dummyFormJsonFile)
          throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));

    /**
     * value of discountStartDate and discountEndDate is overridden so be careful.
     */

    // override discountStartDate and discountEndDate
    ObjectNode tempObject = ((ObjectNode) dummyFormJson).put("variantDiscountStartDate", LocalDateTime.now().toString());
    tempObject = ((ObjectNode) dummyFormJson).put("variantDiscountEndDate", LocalDateTime.now().toString());
    // must be after the override.
    String dummyFormJsonString = tempObject.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId);

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
            .post(targetUrl) // create
            .content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductVariantDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductVariantDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getVariantId()).isNotNull();
    assertThat(responseBody.getProductSize().getProductSizeName()).isEqualTo(dummyFormJson.get("productSize").get("productSizeName").asText());
    // regular price = 10.00 (make sure match with sql & json)
    //assertThat(responseBody.getRegularPrice().toString()).isEqualTo(dummyFormJson.get("variantUnitPrice").asText());
    assertThat(responseBody.getIsDiscountAvailable()).isEqualTo(true);
    assertThat(responseBody.getCurrentPrice().toString()).isEqualTo(dummyFormJson.get("variantDiscountPrice").asText());
  }
  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariantWithProductBaseUnitPrice.sql" })
  public void shouldAdminUserCreateNewProductVariantWithProductBaseUnitPrice(
      @Value("classpath:/integration/productVariant/shouldAdminUserCreateNewProductVariantWithProductBaseUnitPrice.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId);

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .post(targetUrl) // create
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductVariantDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductVariantDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getVariantId()).isNotNull();
    assertThat(responseBody.getProductSize().getProductSizeName()).isEqualTo(dummyFormJson.get("productSize").get("productSizeName").asText());
    // regular price = 10.00 (make sure match with sql & json)
    assertThat(responseBody.getRegularPrice().toString()).isEqualTo("12.21");
    assertThat(responseBody.getIsDiscountAvailable()).isEqualTo(false);
    assertThat(responseBody.getCurrentPrice().toString()).isEqualTo("12.21");
  }

  // 400 bad request (bad input) testing
  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldNotAdminUserCreateNewProductVariantSinceDiscountStartDateIsAfterEndDate.sql" })
  public void shouldNotAdminUserCreateNewProductVariantSinceDiscountStartDateIsAfterEndDate(
      @Value("classpath:/integration/productVariant/shouldNotAdminUserCreateNewProductVariantSinceDiscountStartDateIsAfterEndDate.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId);

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .post(targetUrl) // create
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldNotAdminUserCreateNewProductVariantSinceVariantUnitPriceLessThanDiscountPrice.sql" })
  public void shouldNotAdminUserCreateNewProductVariantSinceVariantUnitPriceLessThanDiscountPrice(
      @Value("classpath:/integration/productVariant/shouldNotAdminUserCreateNewProductVariantSinceVariantUnitPriceLessThanDiscountPrice.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId);

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .post(targetUrl) // create
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldNotAdminUserCreateNewProductVariantSinceProductUnitPriceLessThanDiscountPrice.sql" })
  public void shouldNotAdminUserCreateNewProductVariantSinceProductUnitPriceLessThanDiscountPrice(
      @Value("classpath:/integration/productVariant/shouldNotAdminUserCreateNewProductVariantSinceProductUnitPriceLessThanDiscountPrice.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId);

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .post(targetUrl) // create
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserUpdateProductVariant.sql" })
  public void shouldAdminUserUpdateProductVariant(
      @Value("classpath:/integration/productVariant/shouldAdminUserUpdateProductVariant.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId) + "/" + dummyFormJson.get("variantId").asText();

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .put(targetUrl) // update/replace
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductVariantDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductVariantDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getVariantId()).isNotNull();
    assertThat(responseBody.getVariantId().toString()).isEqualTo(dummyFormJson.get("variantId").toString());
    assertThat(responseBody.getProductSize().getProductSizeName()).isEqualTo(dummyFormJson.get("productSize").get("productSizeName").asText());

    assertThat(responseBody.getRegularPrice().toString()).isEqualTo(dummyFormJson.get("variantUnitPrice").asText());
    assertThat(responseBody.getIsDiscountAvailable()).isEqualTo(true);
    assertThat(responseBody.getCurrentPrice().toString()).isEqualTo(dummyFormJson.get("variantDiscountPrice").asText());

    /**
     * need to check product.cheapestPrice/highestPrice but thsi variant endpoint just return the updated variant so need to refatcor
     **/
  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserUpdateProductVariantWithProductBaseUnitPrice.sql" })
  public void shouldAdminUserUpdateProductVariantWithProductBaseUnitPrice(
      @Value("classpath:/integration/productVariant/shouldAdminUserUpdateProductVariantWithProductBaseUnitPrice.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId) + "/" + dummyFormJson.get("variantId").asText();

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .put(targetUrl) // update/replace
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductVariantDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductVariantDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getVariantId()).isNotNull();
    assertThat(responseBody.getVariantId().toString()).isEqualTo(dummyFormJson.get("variantId").toString());
    assertThat(responseBody.getProductSize().getProductSizeName()).isEqualTo(dummyFormJson.get("productSize").get("productSizeName").asText());

    assertThat(responseBody.getRegularPrice().toString()).isEqualTo("12.21");
    assertThat(responseBody.getIsDiscountAvailable()).isEqualTo(false);
    assertThat(responseBody.getCurrentPrice().toString()).isEqualTo("12.21");
  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldNotAdminUserUpdateProductVariantWithVariantUnitPriceLessThanDiscountPrice.sql" })
  public void shouldNotAdminUserUpdateProductVariantWithVariantUnitPriceLessThanDiscountPrice(
      @Value("classpath:/integration/productVariant/shouldNotAdminUserUpdateProductVariantWithVariantUnitPriceLessThanDiscountPrice.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId) + "/" + dummyFormJson.get("variantId").asText();

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .put(targetUrl) // update/replace
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldNotAdminUserUpdateProductVariantWithProductUnitPriceLessThanDiscountPrice.sql" })
  public void shouldNotAdminUserUpdateProductVariantWithProductUnitPriceLessThanDiscountPrice(
      @Value("classpath:/integration/productVariant/shouldNotAdminUserUpdateProductVariantWithProductUnitPriceLessThanDiscountPrice.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId) + "/" + dummyFormJson.get("variantId").asText();

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .put(targetUrl) // update/replace
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

  }
  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserDeleteProductVariant.sql" })
  public void shouldAdminUserDeleteProductVariant() throws Exception {

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String dummyProductVariantId = "1";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId) + "/" + dummyProductVariantId;

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .delete(targetUrl) // delete 
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    // association assert
    // - product (exist)
    // - product size (exist)
    // - cartItems (deleted)
    // - wishlistItems (deleted)
    // - orderdetails (exists)
    Boolean isProductExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(p) > 0)  then true else false end from products p where p.productId = :productId",
        Boolean.class).setParameter("productId", UUID.fromString("9e3e67ca-d058-41f0-aad5-4f09c956a81f")).getSingleResult();
    Boolean isProductSizeExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(ps) > 0)  then true else false end from productSizes ps where ps.productSizeId = :productSizeId",
        Boolean.class).setParameter("productSizeId", 1L).getSingleResult();
    Boolean isCartItemExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(c) > 0)  then true else false end from cartItems c where c.cartItemId = :cartItemId",
        Boolean.class).setParameter("cartItemId", 1L).getSingleResult();
    Boolean isWishlistItemExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(c) > 0)  then true else false end from wishlistItems c where c.wishlistItemId = :wishlistItemId",
        Boolean.class).setParameter("wishlistItemId", 1L).getSingleResult();
    Boolean isOrderDetailExist = this.entityManager.getEntityManager().createQuery(
            "select case when (count(od) > 0)  then true else false end from orderDetails od where od.orderDetailId = :orderDetailId",
            Boolean.class).setParameter("orderDetailId", 1L).getSingleResult();

    assertThat(isProductExist).isTrue();
    assertThat(isProductSizeExist).isTrue();
    assertThat(isCartItemExist).isFalse();
    assertThat(isWishlistItemExist).isFalse();
    assertThat(isOrderDetailExist).isTrue();

  }

  @Test
  @Sql(scripts = { "classpath:/integration/productVariant/shouldAdminUserDeleteProductVariantAndMakeIsPublicFalseSinceNoVariantAnyMore.sql" })
  public void shouldAdminUserDeleteProductVariantAndMakeIsPublicFalseSinceNoVariantAnyMore() throws Exception {

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String dummyProductVariantId = "1";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, dummyProductId) + "/" + dummyProductVariantId;

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
            .delete(targetUrl) // delete
            .cookie(this.authCookie)
            .cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    Product targetProduct = this.entityManager.getEntityManager().createQuery("select p from products p where p.productId = :productId", Product.class).setParameter("productId", UUID.fromString(dummyProductId)).getSingleResult();
    assertThat(targetProduct.getIsPublic()).isFalse();

    // association assert
    // - product (exist)
    // - product size (exist)
    // - cartItems (deleted)
    // - wishlistItems (deleted)
    // - orderdetails (exists)
    Boolean isProductExist = this.entityManager.getEntityManager().createQuery(
            "select case when (count(p) > 0)  then true else false end from products p where p.productId = :productId",
            Boolean.class).setParameter("productId", UUID.fromString("9e3e67ca-d058-41f0-aad5-4f09c956a81f")).getSingleResult();
    Boolean isProductSizeExist = this.entityManager.getEntityManager().createQuery(
            "select case when (count(ps) > 0)  then true else false end from productSizes ps where ps.productSizeId = :productSizeId",
            Boolean.class).setParameter("productSizeId", 1L).getSingleResult();
    Boolean isCartItemExist = this.entityManager.getEntityManager().createQuery(
            "select case when (count(c) > 0)  then true else false end from cartItems c where c.cartItemId = :cartItemId",
            Boolean.class).setParameter("cartItemId", 1L).getSingleResult();
    Boolean isWishlistItemExist = this.entityManager.getEntityManager().createQuery(
            "select case when (count(c) > 0)  then true else false end from wishlistItems c where c.wishlistItemId = :wishlistItemId",
            Boolean.class).setParameter("wishlistItemId", 1L).getSingleResult();
    Boolean isOrderDetailExist = this.entityManager.getEntityManager().createQuery(
            "select case when (count(od) > 0)  then true else false end from orderDetails od where od.orderDetailId = :orderDetailId",
            Boolean.class).setParameter("orderDetailId", 1L).getSingleResult();

    assertThat(isProductExist).isTrue();
    assertThat(isProductSizeExist).isTrue();
    assertThat(isCartItemExist).isFalse();
    assertThat(isWishlistItemExist).isFalse();
    assertThat(isOrderDetailExist).isTrue();

  }
}
