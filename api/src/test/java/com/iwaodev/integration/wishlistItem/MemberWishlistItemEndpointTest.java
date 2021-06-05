package com.iwaodev.integration.wishlistItem;

import static org.assertj.core.api.Assertions.assertThat;

import javax.persistence.EntityManager;
import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.dto.wishlistItem.WishlistItemDTO;
import com.iwaodev.application.irepository.CartItemRepository;
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

import java.math.BigInteger;
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
public class MemberWishlistItemEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(MemberWishlistItemEndpointTest.class);

  private String targetPath = "/users/%s/wishlistItems";

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

  //@Autowired
  //private CartItemRepository cartItemRepository;

  @Autowired
  private ResourceReader resourceReader;

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
    this.authInfo = this.authenticateTestUser.setup(
        this.entityManager, 
        this.mvc, 
        UserTypeEnum.MEMBER, 
        this.port
        );

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
  }

  @Test
  public void shouldMemberUserAccessToThisGETEndpoint() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());

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
  @Sql(scripts = { "classpath:/integration/wishlistItem/shouldMemberUserGetItsOwnProductsInWishlistItem.sql" })
  public void shouldMemberUserGetItsOwnProductsInWishlistItem() throws Exception {

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());

    // act
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
    WishlistItemDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), WishlistItemDTO[].class);

    // assert
    assertThat(responseBody.length).isGreaterThan(0);
    assertThat(responseBody.length).isEqualTo(3);

    for (WishlistItemDTO wishlistItemDTO : responseBody) {
      assertThat(wishlistItemDTO.getUser().getUserId().toString()).isEqualTo(this.authInfo.getAuthUser().getUserId().toString());
      assertThat(wishlistItemDTO.getProduct().getVariants().size()).isEqualTo(1);
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/wishlistItem/shouldMemberUserAddProductInWishlistItem.sql" })
  public void shouldMemberUserAddProductInWishlistItem() throws Exception {

    // make sure product, variant, user id match with sql script

    // arrange
    String dummyVariantId = "12";
    String dummyProductId = "39dbf162-92c5-4528-bbda-e498ac3aa802";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("variantId", dummyVariantId);

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .post(targetUrl)
        .content(dummyFormJson.toString())
        .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    WishlistItemDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, WishlistItemDTO.class);

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    assertThat(responseBody.getProduct().getProductId().toString()).isEqualTo(dummyProductId);
    assertThat(responseBody.getProduct().getVariants().size()).isEqualTo(1);
    assertThat(responseBody.getProduct().getVariants().get(0).getVariantId().toString()).isEqualTo(dummyVariantId);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/wishlistItem/shouldNotMemberUserAddProductInWishlistItemSinceDuplication.sql" })
  public void shouldNotMemberUserAddProductInWishlistItemSinceDuplication() throws Exception {

    // make sure product, variant, user id match with sql script

    // arrange
    String dummyVariantId = "5";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());
    JSONObject dummyFormJson = new JSONObject();
    dummyFormJson.put("variantId", dummyVariantId);

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .post(targetUrl)
        .content(dummyFormJson.toString())
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
  @Sql(scripts = { "classpath:/integration/wishlistItem/shouldMemberUserMoveWishlistItemToCartItem.sql" })
  public void shouldMemberUserMoveWishlistItemToCartItem() throws Exception {

    // make sure product, variant, user id match with sql script

    // arrange
    String dummyWishlistItemId = "10";
    Long dummyVariantId = 2L;
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyWishlistItemId;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .patch(targetUrl)
        .cookie(this.authCookie)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    // check if it is saved to cart_items
    // repository does not work. the data is not sync with production code.??
    //BigInteger exist = this.cartItemRepository.isExist(dummyVariantId, this.authInfo.getAuthUser().getUserId());
    //assertThat(exist.intValue()).isEqualTo(1);
  }


  @Test
  @Sql(scripts = { "classpath:/integration/wishlistItem/shouldMemberUserDeleteSingleProductInWishlistItem.sql" })
  public void shouldMemberUserDeleteSingleProductInWishlistItem() throws Exception {

    // make sure product, variant, user id match with sql script

    // arrange
    String dummyCartItemId = "12";
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString()) + "/" + dummyCartItemId;

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .delete(targetUrl) // remove single cart item
          .cookie(this.authCookie)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    // assert
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
  }
  
  @Test
  @Sql(scripts = { "classpath:/integration/wishlistItem/shouldMemberUserDeleteAllProductInWishlistItem.sql" })
  public void shouldMemberUserDeleteAllProductInWishlistItem() throws Exception {

    // make sure product, variant, user id match with sql script

    // arrange
    String targetUrl = "http://localhost:" + this.port + String.format(this.targetPath, this.authInfo.getAuthUser().getUserId().toString());

    // act
    ResultActions resultActions = mvc.perform(
        MockMvcRequestBuilders
        .delete(targetUrl) // remove all cart item 
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
