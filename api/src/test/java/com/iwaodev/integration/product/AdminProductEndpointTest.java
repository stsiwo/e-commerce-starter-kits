package com.iwaodev.integration.product;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.product.ProductImageDTO;
import com.iwaodev.application.dto.product.ProductVariantDTO;
import com.iwaodev.application.iservice.S3Service;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.ui.response.ErrorBaseResponse;
import com.iwaodev.util.ResourceReader;

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
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
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
public class AdminProductEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(AdminProductEndpointTest.class);

  private static final String targetPath = "/products";

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
  @Value("${file.product.path}")
  private String fileProductPath;

  @Autowired
  private MessageSource messageSource;

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
    this.authInfo = this.authenticateTestUser.setup(this.entityManager, this.mvc, UserTypeEnum.ADMIN, this.port);

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
    this.csrfCookie = new Cookie("csrf-token", this.authInfo.getCsrfToken());
  }

  @Test
  public void shouldAdminUserAccessToThisGETEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act & assert
    mvc.perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).cookie(this.csrfCookie)
        .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON)).andDo(print())
        .andExpect(status().isOk());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldAdminUserFilterProductListWithSearchQuery.sql" })
  public void shouldAdminUserFilterProductListWithSearchQuery() throws Exception {

    // arrange
    String dummySearchQueryString = "game";
    String searchQueryString = "?searchQuery=" + dummySearchQueryString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQueryString;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl).cookie(this.authCookie).cookie(this.csrfCookie)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    String eTag = result.getResponse().getHeader("ETag");
    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    assertThat(eTag).isNotNull();
    assertThat(eTag).isNotEmpty();
    for (ProductDTO productDto : responseBody) {
      // check if the dummy string contains either name, or description
      assertThat(productDto.getProductName().contains(dummySearchQueryString)
          || productDto.getProductDescription().contains(dummySearchQueryString)).isEqualTo(true);
      assertThat(productDto.getCategory().getCategoryId()).isNotNull();
      // assertThat(productDto.getVariants().size()).isGreaterThan(0);
      // assertThat(productDto.getReviews().size()).isEqualTo(2); // this will include
      // non-verified one too since no filter.
      for (ProductVariantDTO variantDTO : productDto.getVariants()) {
        assertThat(variantDTO.getCurrentPrice()).isNotNull();
      }
    }
  }

  // test if product.reviews only include 'verified'

  @Test
  @Sql(scripts = {
      "classpath:/integration/product/shouldNotAdminCreateProductSinceProductMustHaveAtLeastOneVariantToPublish.sql" })
  public void shouldNotAdminCreateProductSinceProductMustHaveAtLeastOneVariantToPublish(
      @Value("classpath:/integration/product/shouldNotAdminCreateProductSinceProductMustHaveAtLeastOneVariantToPublish.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
        dummyFormJsonString.getBytes());

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.multipart(targetUrl) // create
        .file(jsonFile).contentType(MediaType.MULTIPART_FORM_DATA).cookie(this.authCookie).cookie(this.csrfCookie)
        .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON)).andDo(print())
        .andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);
    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(400);
    // if this error from responseStatusException, you have to use
    // 'result.getResponse().getErrorMessage()'
    // if this error from @ControllerAdvice, you have to use
    // 'responseBody.getMessage()' to access the body message.
    assertThat(responseBody.getMessage()).isEqualTo(this.messageSource
        .getMessage("product.isPublic.onevariantandafterreleasedate", new Object[0], LocaleContextHolder.getLocale()));
  }

  /**
   * multipart testing.
   *
   * ref:
   * https://stackoverflow.com/questions/21800726/using-spring-mvc-test-to-unit-test-multipart-post-request
   * 
   **/
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldAdminUserCreateNewProduct.sql" })
  public void shouldAdminUserCreateNewProduct(
      @Value("classpath:/integration/product/shouldAdminUserCreateNewProduct.json") Resource dummyFormJsonFile)
      throws Exception {

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // make sure the file name match with json script (e.g.,
    // shouldAdminUserCreateNewProduct.json)
    MockMultipartFile fileAtZeroIndex = new MockMultipartFile("files", "product-image-0.jpeg", "image/jpeg",
        "some jpg".getBytes());
    MockMultipartFile fileAtFirstIndex = new MockMultipartFile("files", "product-image-1.png", "image/png",
        "some png".getBytes());
    MockMultipartFile fileAtThirdIndex = new MockMultipartFile("files", "product-image-3.jpeg", "image/jpeg",
        "some jpeg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
        dummyFormJsonString.getBytes());

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.multipart(targetUrl) // create
        .file(fileAtZeroIndex).file(fileAtFirstIndex).file(fileAtThirdIndex).file(jsonFile)
        .contentType(MediaType.MULTIPART_FORM_DATA).cookie(this.authCookie).cookie(this.csrfCookie)
        .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON)).andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String eTag = result.getResponse().getHeader("ETag");

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductDTO.class);

    assertThat(eTag).isEqualTo("\"0\"");
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getProductId()).isNotNull();
    assertThat(responseBody.getProductName()).isEqualTo(dummyFormJson.get("productName").asText());
    assertThat(responseBody.getAverageReviewPoint()).isEqualTo(0.0D);
    assertThat(responseBody.getCategory().getCategoryId().toString())
        .isEqualTo(dummyFormJson.get("category").get("categoryId").asText());
    assertThat(responseBody.getCheapestPrice()).isEqualTo(responseBody.getProductBaseUnitPrice());
    assertThat(responseBody.getHighestPrice()).isEqualTo(responseBody.getProductBaseUnitPrice());

    List<ProductImageDTO> productImages = responseBody.getProductImages();

    for (int i = 0; i < productImages.size(); i++) {

      assertThat(productImages.get(i).getIsChange()).isEqualTo(false);

      if (i == 0 || i == 1 || i == 3) {
        if (i == 0) {
          assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-0");
          assertThat(productImages.get(i).getProductImagePath()).matches(
              "domain/products/" + responseBody.getProductId().toString() + "/images/product-image-0-.+.jpeg");
        } else if (i == 1) {
          assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-1");
          assertThat(productImages.get(i).getProductImagePath())
              .matches("domain/products/" + responseBody.getProductId().toString() + "/images/product-image-1-.+.png");
        } else if (i == 3) {
          assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-3");
          assertThat(productImages.get(i).getProductImagePath()).matches(
              "domain/products/" + responseBody.getProductId().toString() + "/images/product-image-3-.+.jpeg");
        }
      } else {
        assertThat(productImages.get(i).getProductImagePath()).isEqualTo("");
        assertThat(productImages.get(i).getVersion()).isEqualTo(0L);
      }
    }
    // make sure any variant is not created.
    assertThat(0).isEqualTo(responseBody.getVariants().size());
  }

  /**
   * multipart testing.
   *
   * ref:
   * https://stackoverflow.com/questions/21800726/using-spring-mvc-test-to-unit-test-multipart-post-request
   * 
   **/
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldAdminUserCreateNewProductWithMax5Images.sql" })
  public void shouldAdminUserCreateNewProductWithMax5Images(
      @Value("classpath:/integration/product/shouldAdminUserCreateNewProductWithMax5Images.json") Resource dummyFormJsonFile)
      throws Exception {

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // make sure the file name match with json script (e.g.,
    // shouldAdminUserCreateNewProduct.json)
    MockMultipartFile fileAtZeroIndex = new MockMultipartFile("files", "product-image-0.jpeg", "image/jpeg",
        "some jpg".getBytes());
    MockMultipartFile fileAtFirstIndex = new MockMultipartFile("files", "product-image-1.png", "image/png",
        "some png".getBytes());
    MockMultipartFile fileAtSecondIndex = new MockMultipartFile("files", "product-image-2.jpeg", "image/jpeg",
        "some png".getBytes());
    MockMultipartFile fileAtThirdIndex = new MockMultipartFile("files", "product-image-3.jpeg", "image/jpeg",
        "some jpeg".getBytes());
    MockMultipartFile fileAtFourthIndex = new MockMultipartFile("files", "product-image-4.jpeg", "image/jpeg",
        "some jpeg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
        dummyFormJsonString.getBytes());

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.multipart(targetUrl) // create
        .file(fileAtZeroIndex).file(fileAtFirstIndex).file(fileAtSecondIndex).file(fileAtThirdIndex)
        .file(fileAtFourthIndex).file(jsonFile).contentType(MediaType.MULTIPART_FORM_DATA).cookie(this.authCookie)
        .cookie(this.csrfCookie).header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getProductId()).isNotNull();
    assertThat(responseBody.getProductName()).isEqualTo(dummyFormJson.get("productName").asText());
    assertThat(responseBody.getAverageReviewPoint()).isEqualTo(0.0D);
    assertThat(responseBody.getCategory().getCategoryId().toString())
        .isEqualTo(dummyFormJson.get("category").get("categoryId").asText());
    assertThat(responseBody.getCheapestPrice()).isEqualTo(responseBody.getProductBaseUnitPrice());
    assertThat(responseBody.getHighestPrice()).isEqualTo(responseBody.getProductBaseUnitPrice());

    List<ProductImageDTO> productImages = responseBody.getProductImages();

    for (int i = 0; i < productImages.size(); i++) {

      assertThat(productImages.get(i).getIsChange()).isEqualTo(false);

      if (i == 0) {
        assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-0");
        assertThat(productImages.get(i).getProductImagePath())
            .matches("domain/products/" + responseBody.getProductId().toString() + "/images/product-image-0-.+.jpeg");
      } else if (i == 1) {
        assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-1");
        assertThat(productImages.get(i).getProductImagePath())
            .matches("domain/products/" + responseBody.getProductId().toString() + "/images/product-image-1-.+.png");
      } else if (i == 2) {
        assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-2");
        assertThat(productImages.get(i).getProductImagePath())
            .matches("domain/products/" + responseBody.getProductId().toString() + "/images/product-image-2-.+.jpeg");
      } else if (i == 3) {
        assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-3");
        assertThat(productImages.get(i).getProductImagePath())
            .matches("domain/products/" + responseBody.getProductId().toString() + "/images/product-image-3-.+.jpeg");
      } else if (i == 4) {
        assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-4");
        assertThat(productImages.get(i).getProductImagePath())
            .matches("domain/products/" + responseBody.getProductId().toString() + "/images/product-image-4-.+.jpeg");
      }
    }
    // make sure any variant is not created.
    assertThat(0).isEqualTo(responseBody.getVariants().size());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldAdminUserCreateNewProduct.sql" })
  public void shouldNotAdminUserCreateNewProductSinceInvalidPath(
      @Value("classpath:/integration/product/shouldNotAdminUserCreateNewProductSinceInvalidPath.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // make sure the file name match with json script (e.g.,
    // shouldAdminUserCreateNewProduct.json)
    MockMultipartFile fileAtZeroIndex = new MockMultipartFile("files", "product-image-0.jpeg", "image/jpeg",
        "some jpg".getBytes());
    MockMultipartFile fileAtFirstIndex = new MockMultipartFile("files", "product-image-1.png", "image/png",
        "some png".getBytes());
    MockMultipartFile fileAtThirdIndex = new MockMultipartFile("files", "product-image-3.jpeg", "image/jpeg",
        "some jpeg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
        dummyFormJsonString.getBytes());

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.multipart(targetUrl) // create
        .file(fileAtZeroIndex).file(fileAtFirstIndex).file(fileAtThirdIndex).file(jsonFile)
        .contentType(MediaType.MULTIPART_FORM_DATA).cookie(this.authCookie).cookie(this.csrfCookie)
        .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON)).andDo(print())
        .andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(400);
    assertThat(responseBody.getMessage()).isEqualTo(this.messageSource.getMessage("product.productPath.invalidformat",
        new Object[0], LocaleContextHolder.getLocale()));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldNotAdminUserCreateNewProductSinceDuplicatedName.sql" })
  public void shouldNotAdminUserCreateNewProductSinceDuplicatedName(
      @Value("classpath:/integration/product/shouldNotAdminUserCreateNewProductSinceDuplicatedName.json") Resource dummyFormJsonFile)
      throws Exception {

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // make sure the file name match with json script (e.g.,
    // shouldAdminUserCreateNewProduct.json)
    MockMultipartFile fileAtZeroIndex = new MockMultipartFile("files", "product-image-0.jpeg", "image/jpeg",
        "some jpg".getBytes());
    MockMultipartFile fileAtFirstIndex = new MockMultipartFile("files", "product-image-1.png", "image/png",
        "some png".getBytes());
    MockMultipartFile fileAtThirdIndex = new MockMultipartFile("files", "product-image-3.jpeg", "image/jpeg",
        "some jpeg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
        dummyFormJsonString.getBytes());

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.multipart(targetUrl) // create
        .file(fileAtZeroIndex).file(fileAtFirstIndex).file(fileAtThirdIndex).file(jsonFile)
        .contentType(MediaType.MULTIPART_FORM_DATA).cookie(this.authCookie).cookie(this.csrfCookie)
        .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON)).andDo(print())
        .andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(400);
  }

  // 400 bad request (bad input) testing

  /**
   * senario: update first image and remove 3rd image and leave 2nd image as it
   * is.
   *
   **/

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldAdminUserUpdateProduct.sql" })
  public void shouldAdminUserUpdateProduct(
      @Value("classpath:/integration/product/shouldAdminUserUpdateProduct.json") Resource dummyFormJsonFile)
      throws Exception {

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());
    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyVersion = "\"0\"";

    String dummyProductId = dummyFormJson.get("productId").asText();

    // create dummy files in the directory
    // - must match with input json script
    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyProductId;

    // make sure the file name match with input json script.
    MockMultipartFile newFileAtZeroIndex = new MockMultipartFile("files", "product-image-0.svg", "image/svg+xml",
        "some svg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
        dummyFormJsonString.getBytes());

    // act & assert

    // multipart & PUT, you need this
    MockMultipartHttpServletRequestBuilder builder = (MockMultipartHttpServletRequestBuilder) MockMvcRequestBuilders
        .multipart(targetUrl) // update
        .with(new RequestPostProcessor() {
          @Override
          public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
            request.setMethod("PUT");
            return request;
          }
        });

    ResultActions resultActions = mvc
        .perform(builder.file(newFileAtZeroIndex).file(jsonFile).contentType(MediaType.MULTIPART_FORM_DATA)
            .content(dummyFormJsonString).cookie(this.authCookie).cookie(this.csrfCookie)
            .header("If-Match", dummyVersion)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String etag = result.getResponse().getHeader("ETag");

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getProductId()).isNotNull();
    assertThat(etag).isEqualTo("\"1\"");
    assertThat(responseBody.getProductName()).isEqualTo(dummyFormJson.get("productName").asText());
    // check the sql file to get each review point (only verified)
    assertThat(responseBody.getAverageReviewPoint()).isEqualTo(Arrays.asList(3.9, 4.9).stream().mapToDouble(val -> val).average().orElse(0.0));
    assertThat(responseBody.getCategory().getCategoryId().toString())
        .isEqualTo(dummyFormJson.get("category").get("categoryId").asText());
    assertThat(responseBody.getCategory().getVersion()).isEqualTo(0L); // make sure category version is not updated.
    assertThat(responseBody.getCheapestPrice()).isEqualTo(new BigDecimal("123.0"));
    assertThat(responseBody.getHighestPrice()).isEqualTo(new BigDecimal("123.0"));
    assertThat(1).isEqualTo(responseBody.getVariants().size());

    List<ProductImageDTO> productImages = responseBody.getProductImages();

    for (int i = 0; i < productImages.size(); i++) {

      assertThat(productImages.get(i).getIsChange()).isEqualTo(false);

      if (i == 0 || i == 1 || i == 3) {
        if (i == 0) {
          // update
          assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-0");
          assertThat(productImages.get(i).getProductImagePath())
              .matches("domain/products/" + responseBody.getProductId().toString() + "/images/product-image-0-.+.svg");
          assertThat(productImages.get(i).getVersion()).isEqualTo(1L);
        } else if (i == 1) {
          // unchange
          assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-1");
          assertThat(productImages.get(i).getProductImagePath())
              .matches("domain/products/" + responseBody.getProductId().toString() + "/images/product-image-1-.+.png");
          assertThat(productImages.get(i).getVersion()).isEqualTo(0L);
        } else if (i == 3) {
          // remove
          assertThat(productImages.get(i).getProductImageName()).isEqualTo("product-image-3");
          assertThat(productImages.get(i).getProductImagePath()).isEqualTo("");
          assertThat(productImages.get(i).getVersion()).isEqualTo(1L);
        }
      } else {
        assertThat(productImages.get(i).getProductImagePath()).isEqualTo("");
      }
    }

    for (ProductVariantDTO variantDTO : responseBody.getVariants()) {
      assertThat(variantDTO.getVariantId()).isNotNull();
    }
  }

  @Test
  @Sql(scripts = {
          "classpath:/integration/product/shouldNotAdminUserUpdateProductSinceProductUnitPriceLessThanDiscountPriceAtItsVariant.sql" })
  public void shouldNotAdminUserUpdateProductSinceNoIfMatchHeader(
          @Value("classpath:/integration/product/shouldNotAdminUserUpdateProductSinceProductUnitPriceLessThanDiscountPriceAtItsVariant.json") Resource dummyFormJsonFile)
          throws Exception {

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());
    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    String dummyProductId = dummyFormJson.get("productId").asText();

    // create dummy files in the directory
    // - must match with input json script
    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyProductId;

    // make sure the file name match with input json script.
    MockMultipartFile newFileAtZeroIndex = new MockMultipartFile("files", "product-image-0.svg", "image/svg+xml",
            "some svg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
            dummyFormJsonString.getBytes());

    // act & assert

    // multipart & PUT, you need this
    MockMultipartHttpServletRequestBuilder builder = (MockMultipartHttpServletRequestBuilder) MockMvcRequestBuilders
            .multipart(targetUrl) // update
            .with(new RequestPostProcessor() {
              @Override
              public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setMethod("PUT");
                return request;
              }
            });

    ResultActions resultActions = mvc
            .perform(builder.file(newFileAtZeroIndex).file(jsonFile).contentType(MediaType.MULTIPART_FORM_DATA)
                    .content(dummyFormJsonString).cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("you are missing version (If-Match) header.");
  }

  @Test
  @Sql(scripts = {
          "classpath:/integration/product/shouldNotAdminUserUpdateProductSinceProductUnitPriceLessThanDiscountPriceAtItsVariant.sql" })
  public void shouldNotAdminUserUpdateProductSinceVersionMisMatch(
          @Value("classpath:/integration/product/shouldNotAdminUserUpdateProductSinceProductUnitPriceLessThanDiscountPriceAtItsVariant.json") Resource dummyFormJsonFile)
          throws Exception {

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());
    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyVersion = "\"3\"";

    String dummyProductId = dummyFormJson.get("productId").asText();

    // create dummy files in the directory
    // - must match with input json script
    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyProductId;

    // make sure the file name match with input json script.
    MockMultipartFile newFileAtZeroIndex = new MockMultipartFile("files", "product-image-0.svg", "image/svg+xml",
            "some svg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
            dummyFormJsonString.getBytes());

    // act & assert

    // multipart & PUT, you need this
    MockMultipartHttpServletRequestBuilder builder = (MockMultipartHttpServletRequestBuilder) MockMvcRequestBuilders
            .multipart(targetUrl) // update
            .with(new RequestPostProcessor() {
              @Override
              public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setMethod("PUT");
                return request;
              }
            });

    ResultActions resultActions = mvc
            .perform(builder.file(newFileAtZeroIndex).file(jsonFile).contentType(MediaType.MULTIPART_FORM_DATA)
                    .content(dummyFormJsonString).cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("If-Match", dummyVersion)
                    .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isPreconditionFailed());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the data was updated by others. please refresh.");
  }
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldAdminUserUpdateProductVersionWhenChildEntityIsUpdated.sql" })
  public void shouldAdminUserUpdateProductVersionWhenChildEntityIsUpdated(
          @Value("classpath:/integration/product/shouldAdminUserUpdateProductVersionWhenChildEntityIsUpdated.json") Resource dummyFormJsonFile)
          throws Exception {

    /**
     * only update child entities such as category, product-images so that i can check product entity's version is udpated or not
     */

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());
    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyVersion = "\"0\"";

    String dummyProductId = dummyFormJson.get("productId").asText();

    // create dummy files in the directory
    // - must match with input json script
    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyProductId;

    // make sure the file name match with input json script.
    MockMultipartFile newFileAtZeroIndex = new MockMultipartFile("files", "product-image-0.svg", "image/svg+xml",
            "some svg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
            dummyFormJsonString.getBytes());

    // act & assert

    // multipart & PUT, you need this
    MockMultipartHttpServletRequestBuilder builder = (MockMultipartHttpServletRequestBuilder) MockMvcRequestBuilders
            .multipart(targetUrl) // update
            .with(new RequestPostProcessor() {
              @Override
              public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setMethod("PUT");
                return request;
              }
            });

    ResultActions resultActions = mvc
            .perform(builder.file(newFileAtZeroIndex).file(jsonFile).contentType(MediaType.MULTIPART_FORM_DATA)
                    .content(dummyFormJsonString).cookie(this.authCookie).cookie(this.csrfCookie)
                    .header("If-Match", dummyVersion)
                    .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String etag = result.getResponse().getHeader("ETag");

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductDTO.class);

    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    // must dump up when child entity is changed
    assertThat(etag).isEqualTo("\"1\"");
  }

  @Test
  @Sql(scripts = {
      "classpath:/integration/product/shouldNotAdminUserUpdateProductSinceProductUnitPriceLessThanDiscountPriceAtItsVariant.sql" })
  public void shouldNotAdminUserUpdateProductSinceProductUnitPriceLessThanDiscountPriceAtItsVariant(
      @Value("classpath:/integration/product/shouldNotAdminUserUpdateProductSinceProductUnitPriceLessThanDiscountPriceAtItsVariant.json") Resource dummyFormJsonFile)
      throws Exception {

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());
    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyVersion = "\"0\"";

    String dummyProductId = dummyFormJson.get("productId").asText();

    // create dummy files in the directory
    // - must match with input json script
    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyProductId;

    // make sure the file name match with input json script.
    MockMultipartFile newFileAtZeroIndex = new MockMultipartFile("files", "product-image-0.svg", "image/svg+xml",
        "some svg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
        dummyFormJsonString.getBytes());

    // act & assert

    // multipart & PUT, you need this
    MockMultipartHttpServletRequestBuilder builder = (MockMultipartHttpServletRequestBuilder) MockMvcRequestBuilders
        .multipart(targetUrl) // update
        .with(new RequestPostProcessor() {
          @Override
          public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
            request.setMethod("PUT");
            return request;
          }
        });

    ResultActions resultActions = mvc
        .perform(builder.file(newFileAtZeroIndex).file(jsonFile).contentType(MediaType.MULTIPART_FORM_DATA)
            .content(dummyFormJsonString).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

            MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the base unit price is less than the discount price of one of variants of this product.");
  }

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldNotAdminUserUpdateProductSinceDuplicatedName.sql" })
  public void shouldNotAdminUserUpdateProductSinceDuplicatedName(
      @Value("classpath:/integration/product/shouldNotAdminUserUpdateProductSinceDuplicatedName.json") Resource dummyFormJsonFile)
      throws Exception {

    Mockito.doNothing().when(this.s3Service).upload(Mockito.any(), Mockito.any());
    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());

    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyVersion = "\"0\"";

    String dummyProductId = dummyFormJson.get("productId").asText();

    // create dummy files in the directory
    // - must match with input json script
    // arrange
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyProductId;

    // make sure the file name match with input json script.
    MockMultipartFile newFileAtZeroIndex = new MockMultipartFile("files", "product-image-0.svg", "image/svg+xml",
        "some svg".getBytes());
    MockMultipartFile jsonFile = new MockMultipartFile("criteria", "", "application/json",
        dummyFormJsonString.getBytes());

    // act & assert

    // multipart & PUT, you need this
    MockMultipartHttpServletRequestBuilder builder = (MockMultipartHttpServletRequestBuilder) MockMvcRequestBuilders
        .multipart(targetUrl) // update
        .with(new RequestPostProcessor() {
          @Override
          public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
            request.setMethod("PUT");
            return request;
          }
        });

    ResultActions resultActions = mvc
        .perform(builder.file(newFileAtZeroIndex).file(jsonFile).contentType(MediaType.MULTIPART_FORM_DATA)
            .content(dummyFormJsonString).cookie(this.authCookie).cookie(this.csrfCookie)
                .header("If-Match", dummyVersion)
            .header("csrf-token", this.authInfo.getCsrfToken()).accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the product name already taken.");
  }

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldAdminUserDeleteProduct.sql" })
  public void shouldAdminUserDeleteProduct() throws Exception {

    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyProductId;
    String dummyVersion = "\"0\"";

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.delete(targetUrl) // delete
        .cookie(this.authCookie).cookie(this.csrfCookie).header("csrf-token", this.authInfo.getCsrfToken())
            .header("If-Match", dummyVersion)
        .accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);

    // association assert
    // - category (exist)
    // - product iamges (deleted)
    // - reviews (deleted)
    // - product variant (deleted)
    // - order_details (exist)
    Boolean isCategoryExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(c) > 0)  then true else false end from categories c where c.categoryId = :categoryId",
        Boolean.class).setParameter("categoryId", 1L).getSingleResult();
    Boolean isProductImagesExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(pi) > 0)  then true else false end from productImages pi inner join pi.product p where p.productId = :productId",
        Boolean.class).setParameter("productId", UUID.fromString(dummyProductId)).getSingleResult();
    Boolean isReviewsExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(r) > 0)  then true else false end from reviews r inner join r.product p where p.productId = :productId",
        Boolean.class).setParameter("productId", UUID.fromString(dummyProductId)).getSingleResult();
    Boolean isProductVariantsExist = this.entityManager.getEntityManager().createQuery(
        "select case when (count(pv) > 0)  then true else false end from productVariants pv inner join pv.product p where p.productId = :productId",
        Boolean.class).setParameter("productId", UUID.fromString(dummyProductId)).getSingleResult();
    Boolean isOrderDetailExist = this.entityManager.getEntityManager().createQuery(
            "select case when (count(od) > 0)  then true else false end from orderDetails od where od.orderDetailId = :orderDetailId",
            Boolean.class).setParameter("orderDetailId", 1L).getSingleResult();


    assertThat(isCategoryExist).isTrue();
    assertThat(isProductImagesExist).isFalse();
    assertThat(isReviewsExist).isFalse();
    assertThat(isProductVariantsExist).isFalse();
    assertThat(isOrderDetailExist).isTrue();

    
  }

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldAdminUserDeleteProduct.sql" })
  public void shouldNotAdminUserDeleteProductSinceNoIfMatchHeader() throws Exception {

    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyProductId;

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.delete(targetUrl) // delete
            .cookie(this.authCookie).cookie(this.csrfCookie).header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("you are missing version (If-Match) header.");

  }

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldAdminUserDeleteProduct.sql" })
  public void shouldNotAdminUserDeleteProductSinceVersionMisMatch() throws Exception {

    Mockito.doNothing().when(this.s3Service).delete(Mockito.any());

    // arrange
    String dummyProductId = "9e3e67ca-d058-41f0-aad5-4f09c956a81f";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyProductId;
    String dummyVersion = "\"3\"";

    // act & assert
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders.delete(targetUrl) // delete
            .cookie(this.authCookie).cookie(this.csrfCookie).header("csrf-token", this.authInfo.getCsrfToken())
            .header("If-Match", dummyVersion)
            .accept(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isPreconditionFailed());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the data was updated by others. please refresh.");


  }
}
