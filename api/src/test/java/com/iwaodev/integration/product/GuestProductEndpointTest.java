package com.iwaodev.integration.product;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.product.ProductVariantDTO;
import com.iwaodev.application.dto.product.ReviewDTO;
import com.iwaodev.data.BaseDatabaseSetup;

// MockMvc stuff
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

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
public class GuestProductEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(GuestProductEndpointTest.class);

  private static final String targetPath = "/products";

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
  public void shouldNotGuestUserAccessToThisGETEndpoint() throws Exception {

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    mvc.perform(MockMvcRequestBuilders.get(targetUrl).accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isForbidden());
  }

  @Test
  public void shouldGuestUserAccessToThisGETEndpoint() throws Exception {

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public";

    // act
    mvc.perform(MockMvcRequestBuilders.get(targetUrl).accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk());
  }


  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserFilterProductListWithSearchQuery.sql" })
  public void shouldGuestUserFilterProductListWithSearchQuery() throws Exception {

    // arrange
    String dummySearchQueryString = "game";
    String searchQueryString = "?searchQuery=" + dummySearchQueryString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public" + searchQueryString;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (ProductDTO productDto : responseBody) {
      // check if the dummy string contains either name, or description
      assertThat(
          productDto.getProductName().contains(dummySearchQueryString) || productDto.getProductDescription().contains(dummySearchQueryString)
              ).isEqualTo(true);
      assertThat(productDto.getIsPublic()).isEqualTo(true);
      assertThat(productDto.getCategory().getCategoryId()).isNotNull();
      assertThat(productDto.getVariants().size()).isGreaterThan(0);
      assertThat(productDto.getReviews().size()).isEqualTo(1); // adjusted that all product verfied review number is 1. check sql.
      for (ProductVariantDTO variantDTO : productDto.getVariants()) {
        assertThat(variantDTO.getCurrentPrice()).isNotNull();
      }
    }
  }

  // filter: isDiscount
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserFilterProductListWithIsDiscount.sql" })
  public void shouldGuestUserFilterProductListWithIsDiscount() throws Exception {

    // arrange
    String dummySearchQueryString = "true";
    String searchQueryString = "?isDiscount=" + dummySearchQueryString;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public" + searchQueryString;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (ProductDTO productDto : responseBody) {
      // check if the dummy string contains either name, or description
      assertThat(productDto.getIsDiscountAvailable()).isEqualTo(true);
      assertThat(productDto.getIsPublic()).isEqualTo(true);
      assertThat(productDto.getCategory().getCategoryId()).isNotNull();
      assertThat(productDto.getVariants().size()).isGreaterThan(0);
      for (ProductVariantDTO variantDTO : productDto.getVariants()) {
        assertThat(variantDTO.getCurrentPrice()).isNotNull();
      }
    }
  }

  // filter: maxPrice
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserFilterProductListWithMaxPrice.sql" })
  public void shouldGuestUserFilterProductListWithMaxPrice() throws Exception {

    // arrange
    BigDecimal dummyMaxPrice = new BigDecimal("50.00");
    String searchQueryString = "?maxPrice=" + dummyMaxPrice.toString();
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public" + searchQueryString;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (ProductDTO productDto : responseBody) {
      // check if the dummy string contains either name, or description
      assertThat(productDto.getIsPublic()).isEqualTo(true);
      assertThat(productDto.getCategory().getCategoryId()).isNotNull();
      assertThat(productDto.getVariants().size()).isGreaterThan(0);
      assertThat(productDto.getCheapestPrice()).isLessThan(dummyMaxPrice);
      for (ProductVariantDTO variantDTO : productDto.getVariants()) {
        assertThat(variantDTO.getCurrentPrice()).isNotNull();
      }
    }
  }

  // filter: minPrice
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserFilterProductListWithMinPrice.sql" })
  public void shouldGuestUserFilterProductListWithMinPrice() throws Exception {

    // arrange
    BigDecimal dummyMinPrice = new BigDecimal("100.00");
    String searchQueryString = "?minPrice=" + dummyMinPrice.toString();
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public" + searchQueryString;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (ProductDTO productDto : responseBody) {
      // check if the dummy string contains either name, or description
      assertThat(productDto.getIsPublic()).isEqualTo(true);
      assertThat(productDto.getCategory().getCategoryId()).isNotNull();
      assertThat(productDto.getVariants().size()).isGreaterThan(0);
      assertThat(productDto.getHighestPrice()).isGreaterThan(dummyMinPrice);
      for (ProductVariantDTO variantDTO : productDto.getVariants()) {
        assertThat(variantDTO.getCurrentPrice()).isNotNull();
      }
    }
  }

  // filter: category
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserFilterProductListWithCategory.sql" })
  public void shouldGuestUserFilterProductListWithCategory() throws Exception {

    // arrange
    String dummyCategoryIdString = "3"; 
    String searchQueryString = "?categoryId=" + dummyCategoryIdString; 
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public" + searchQueryString;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (ProductDTO productDto : responseBody) {
      // check if the dummy string contains either name, or description
      assertThat(productDto.getIsPublic()).isEqualTo(true);
      assertThat(productDto.getCategory().getCategoryId().toString()).isEqualTo(dummyCategoryIdString);
      assertThat(productDto.getVariants().size()).isGreaterThan(0);
      for (ProductVariantDTO variantDTO : productDto.getVariants()) {
        assertThat(variantDTO.getCurrentPrice()).isNotNull();
      }
    }
  }

  // filter: releaseDate
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserFilterProductListWithStartDate.sql" })
  public void shouldGuestUserFilterProductListWithStartDate() throws Exception {

    // arrange
    LocalDateTime dummyStartDate = LocalDateTime.of(2020, 1, 1, 0, 0, 0); 
    String searchQueryString = "?startDate=" + dummyStartDate.toString(); 
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public" + searchQueryString;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (ProductDTO productDto : responseBody) {
      // check if the dummy string contains either name, or description
      assertThat(productDto.getIsPublic()).isEqualTo(true);
      assertThat(productDto.getCategory().getCategoryId().toString()).isNotNull();
      assertThat(productDto.getVariants().size()).isGreaterThan(0);
      assertThat(productDto.getReleaseDate()).isAfter(dummyStartDate);
      for (ProductVariantDTO variantDTO : productDto.getVariants()) {
        assertThat(variantDTO.getCurrentPrice()).isNotNull();
      }
    }
  }

  // filter: releaseDate
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserFilterProductListWithReviewPoint.sql" })
  public void shouldGuestUserFilterProductListWithReviewPoint() throws Exception {

    // arrange
    Double dummyReviewPoint = 3.00; 
    String searchQueryString = "?reviewPoint=" + dummyReviewPoint; 
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public" + searchQueryString;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (ProductDTO productDto : responseBody) {
      // check if the dummy string contains either name, or description
      assertThat(productDto.getIsPublic()).isEqualTo(true);
      assertThat(productDto.getCategory().getCategoryId().toString()).isNotNull();
      assertThat(productDto.getVariants().size()).isGreaterThan(0);
      assertThat(productDto.getAverageReviewPoint()).isGreaterThanOrEqualTo(dummyReviewPoint);
      for (ProductVariantDTO variantDTO : productDto.getVariants()) {
        assertThat(variantDTO.getCurrentPrice()).isNotNull();
      }
    }
  }

  // filter: releaseDate
  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserFilterProductListWithEndDate.sql" })
  public void shouldGuestUserFilterProductListWithEndDate() throws Exception {

    // arrange
    LocalDateTime dummyEndDate = LocalDateTime.of(2020, 1, 1, 0, 0, 0); 
    String searchQueryString = "?endDate=" + dummyEndDate.toString(); 
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public" + searchQueryString;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    for (ProductDTO productDto : responseBody) {
      // check if the dummy string contains either name, or description
      assertThat(productDto.getIsPublic()).isEqualTo(true);
      assertThat(productDto.getCategory().getCategoryId().toString()).isNotNull();
      assertThat(productDto.getVariants().size()).isGreaterThan(0);
      assertThat(productDto.getReleaseDate()).isBefore(dummyEndDate);
      for (ProductVariantDTO variantDTO : productDto.getVariants()) {
        assertThat(variantDTO.getCurrentPrice()).isNotNull();
      }
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserPaginateProductList.sql" })
  public void shouldGuestUserPaginateProductList() throws Exception {

    // arrange
    String dummyPageNumber = "0";
    String searchQueryString = "?page=" + dummyPageNumber;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public" + searchQueryString;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), ProductDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    assertThat(contentAsJsonNode.get("totalElements").asInt()).isEqualTo(2);
  }

  // #TODO: test the rest of filter/sort/pagination

  @Test
  public void shouldNotGuestUserAccessToThisGetSingleEndpoint() throws Exception {

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/randome-path";

    // act
    mvc.perform(MockMvcRequestBuilders.get(targetUrl).accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isForbidden());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/product/shouldGuestUserGetSpecificProduct.sql" })
  public void shouldGuestUserGetSpecificProduct() throws Exception {

    // make sure product id match the one in sql

    // arrange
    String dummyProductPath = "test-path-1";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/public/" + dummyProductPath;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .get(targetUrl)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ProductDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ProductDTO.class);

    // assert
    assertThat(responseBody.getProductPath().toString()).isEqualTo(dummyProductPath);
    assertThat(responseBody.getProductName()).isNotNull();

    for (ReviewDTO reviewDto: responseBody.getReviews()) {
      assertThat(reviewDto.getIsVerified()).isEqualTo(true);
    }
  }

  // not found testing

  @Test
  public void shouldNotGuestUserAccessToThisPostEndpoint() throws Exception {

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    mvc.perform(MockMvcRequestBuilders.post(targetUrl).accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isForbidden());
  }
}
