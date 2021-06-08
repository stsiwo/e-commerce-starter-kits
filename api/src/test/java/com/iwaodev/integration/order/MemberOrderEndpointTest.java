package com.iwaodev.integration.order;

import static org.assertj.core.api.Assertions.assertThat;

import javax.persistence.EntityManager;
import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderDetailDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.response.PaymentIntentResponse;
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
public class MemberOrderEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(MemberOrderEndpointTest.class);

  private static final String targetPath = "/orders";

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

  @Autowired
  private UserRepository userRepository;

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
  public void shouldNotMemberOrderAccessToThisEndpoint() throws Exception {

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    mvc.perform(MockMvcRequestBuilders
        .get(targetUrl)
        .cookie(this.authCookie)
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isForbidden());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldMemberCreateOrderSuccessfully.sql" })
  public void shouldMemberCreateOrderSuccessfully(@Value("classpath:/integration/order/shouldMemberCreateOrderSuccessfully.json") Resource dummyFormJsonFile) throws Exception {

    // test member user id: c7081519-16e5-4f92-ac50-1834001f12b9 (already in db from initial script)
    
    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
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
    PaymentIntentResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PaymentIntentResponse.class);

    // assert
    assertThat(responseBody.getClientSecret()).isNotNull();

    OrderDTO order = responseBody.getOrder();
    assertThat(order.getOrderId()).isNotNull();
    assertThat(order.getOrderNumber()).isNotNull();
    assertThat(order.getShippingAddress().getOrderAddressId()).isNotNull();
    assertThat(order.getShippingAddress().getPostalCode()).isEqualTo(dummyFormJson.get("shippingAddress").get("postalCode").asText());
    assertThat(order.getBillingAddress().getOrderAddressId()).isNotNull();
    assertThat(order.getBillingAddress().getPostalCode()).isEqualTo(dummyFormJson.get("billingAddress").get("postalCode").asText());
    assertThat(order.getUser().getUserId().toString()).isEqualTo(dummyFormJson.get("userId").asText());
    assertThat(order.getCurrency()).isEqualTo(dummyFormJson.get("currency").asText());
    assertThat(order.getOrderEvents().get(0).getOrderStatus()).isEqualTo(OrderStatusEnum.DRAFT);

    for (int i = 0; i < order.getOrderDetails().size(); i++) {
      OrderDetailDTO orderDetailDTO = order.getOrderDetails().get(i);
      JsonNode orderDetailCriteria = dummyFormJson.get("orderDetails").get(i);

      assertThat(orderDetailDTO.getOrderDetailId()).isNotNull();
      assertThat(orderDetailDTO.getProductQuantity().toString()).isEqualTo(orderDetailCriteria.get("productQuantity").asText());
      assertThat(orderDetailDTO.getProduct().getProductId().toString()).isEqualTo(orderDetailCriteria.get("productId").asText());
      assertThat(orderDetailDTO.getProductVariant().getVariantId().toString()).isEqualTo(orderDetailCriteria.get("productVariantId").asText());
    }

    // event assert
    User user = this.userRepository.findById(UUID.fromString(dummyFormJson.get("userId").asText())).orElseThrow(() -> new Exception("user not found"));
    assertThat(user.getStripeCustomerId()).isNotNull();

  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldMemberCreateSessionTimeoutOrderEventSuccessfully.sql" })
  public void shouldMemberCreateSessionTimeoutOrderEventSuccessfully(
      @Value("classpath:/integration/order/shouldMemberCreateSessionTimeoutOrderEventSuccessfully.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String testUserId = "c7081519-16e5-4f92-ac50-1834001f12b9";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events/session-timeout";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .post(targetUrl)
            .content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId()).isNotNull();
    assertThat(responseBody.getUser().getUserId().toString()).isEqualTo(testUserId);
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(2);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.SESSION_TIMEOUT);
    assertThat(responseBody.getLatestOrderEvent().getUser().getUserId().toString()).isEqualTo(testUserId);

    for (OrderEventDTO orderEventDTO : responseBody.getOrderEvents()) {
      logger.info(orderEventDTO.toString());
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
      assertThat(orderEventDTO.getUndoable()).isEqualTo(false);
    }

  }
}


