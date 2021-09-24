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
import com.iwaodev.config.MyTestConfiguration;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.response.ErrorBaseResponse;
import com.iwaodev.ui.response.PaymentIntentResponse;
import com.iwaodev.util.ResourceReader;

// MockMvc stuff
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import org.json.JSONArray;
import org.json.JSONObject;
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
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
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
/**
 * bug: ApplicationEventPublisher with @MockBean does not create mocked ApplicationEventPublisher.
 *
 * workaournd: create this Testconfiguration class.
 *
 * ref: https://github.com/spring-projects/spring-framework/issues/18907
 *
 **/
@Import(MyTestConfiguration.class)
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

  @MockBean
  private ApplicationEventPublisher publisher;

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
    this.baseDatabaseSetup.setup(this.entityManager);

    // send authentication request before testing
    this.authInfo = this.authenticateTestUser.setup(
        this.entityManager, 
        this.mvc, 
        UserTypeEnum.MEMBER, 
        this.port
        );

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
    this.csrfCookie = new Cookie("csrf-token", this.authInfo.getCsrfToken());
  }

  @Test
  public void shouldNotMemberOrderAccessToThisEndpoint() throws Exception {

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    mvc.perform(MockMvcRequestBuilders
        .get(targetUrl)
        .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
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
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
        .accept(MediaType.APPLICATION_JSON)
        )
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();
    String etag = result.getResponse().getHeader("ETag");
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    PaymentIntentResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, PaymentIntentResponse.class);

    // assert
    assertThat(responseBody.getClientSecret()).isNotNull();

    OrderDTO order = responseBody.getOrder();
    assertThat(etag).isEqualTo("\"1\"");
    assertThat(order.getOrderId()).isNotNull();
    assertThat(order.getOrderNumber()).isNotNull();
    assertThat(order.getShippingAddress().getOrderAddressId()).isNotNull();
    assertThat(order.getShippingAddress().getPostalCode()).isEqualTo(dummyFormJson.get("shippingAddress").get("postalCode").asText());
    assertThat(order.getBillingAddress().getOrderAddressId()).isNotNull();
    assertThat(order.getBillingAddress().getPostalCode()).isEqualTo(dummyFormJson.get("billingAddress").get("postalCode").asText());
    assertThat(order.getUser().getUserId().toString()).isEqualTo(dummyFormJson.get("userId").asText());
    assertThat(order.getCurrency()).isEqualTo(dummyFormJson.get("currency").asText());
    assertThat(order.getShippingCost()).isGreaterThan(new BigDecimal(0.00));
    assertThat(order.getEstimatedDeliveryDate()).isAfter(LocalDateTime.now());
    assertThat(order.getOrderEvents().get(0).getOrderStatus()).isEqualTo(OrderStatusEnum.DRAFT);

    for (int i = 0; i < order.getOrderDetails().size(); i++) {
      OrderDetailDTO orderDetailDTO = order.getOrderDetails().get(i);
      JsonNode orderDetailCriteria = dummyFormJson.get("orderDetails").get(i);

      assertThat(orderDetailDTO.getOrderDetailId()).isNotNull();
      assertThat(orderDetailDTO.getProductQuantity().toString()).isEqualTo(orderDetailCriteria.get("productQuantity").asText());
      assertThat(orderDetailDTO.getProduct().getProductId().toString()).isEqualTo(orderDetailCriteria.get("productId").asText());
      assertThat(orderDetailDTO.getProductVariant().getVariantId().toString()).isEqualTo(orderDetailCriteria.get("productVariantId").asText());

      if (orderDetailDTO.getProductVariant().getVariantId().equals(3)) {
        assertThat(orderDetailDTO.getProductWeight()).isEqualTo(1.00);
      } else if (orderDetailDTO.getProductVariant().getVariantId().equals(6)) {
        assertThat(orderDetailDTO.getProductWeight()).isEqualTo(0.6);
      } else if (orderDetailDTO.getProductVariant().getVariantId().equals(11)) {
        assertThat(new BigDecimal(orderDetailDTO.getProductWeight()).setScale(1, RoundingMode.UP)).isEqualTo(new BigDecimal(2.1).setScale(1, RoundingMode.DOWN));
      }
    }

    // event assert
    User user = this.userRepository.findById(UUID.fromString(dummyFormJson.get("userId").asText())).orElseThrow(() -> new Exception("user not found"));

    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(OrderFinalConfirmedEvent.class));
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
    String dummyVersion = "\"0\"";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .post(targetUrl)
            .content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
          .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
                .header("If-Match", dummyVersion)
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
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
      assertThat(orderEventDTO.getUndoable()).isEqualTo(false);
    }

  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldMemberCreateSessionTimeoutOrderEventSuccessfully.sql" })
  public void shouldMemberCreateSessionTimeoutOrderEventSuccessfullySinceNoIfMatch(
          @Value("classpath:/integration/order/shouldMemberCreateSessionTimeoutOrderEventSuccessfully.json") Resource dummyFormJsonFile)
          throws Exception {

    // dummy order id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String testUserId = "c7081519-16e5-4f92-ac50-1834001f12b9";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events/session-timeout";
    String dummyVersion = "\"0\"";

    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders
                    .post(targetUrl)
                    .content(dummyFormJsonString)
                    .contentType(MediaType.APPLICATION_JSON)
                    .cookie(this.authCookie)
                    .cookie(this.csrfCookie)
                    .header("csrf-token", this.authInfo.getCsrfToken())
                    .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isBadRequest());

    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("you are missing version (If-Match) header.");
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldMemberCreateSessionTimeoutOrderEventSuccessfully.sql" })
  public void shouldMemberCreateSessionTimeoutOrderEventSuccessfullySinceVersionMismatch(
          @Value("classpath:/integration/order/shouldMemberCreateSessionTimeoutOrderEventSuccessfully.json") Resource dummyFormJsonFile)
          throws Exception {

    // dummy order id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String testUserId = "c7081519-16e5-4f92-ac50-1834001f12b9";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events/session-timeout";
    String dummyVersion = "\"3\"";

    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders
                    .post(targetUrl)
                    .content(dummyFormJsonString)
                    .contentType(MediaType.APPLICATION_JSON)
                    .cookie(this.authCookie)
                    .cookie(this.csrfCookie)
                    .header("If-Match", dummyVersion)
                    .header("csrf-token", this.authInfo.getCsrfToken())
                    .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isPreconditionFailed());


    MvcResult result = resultActions.andReturn();
    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    ErrorBaseResponse responseBody = this.objectMapper.treeToValue(contentAsJsonNode, ErrorBaseResponse.class);

    assertThat(responseBody.getMessage()).isEqualTo("the data was updated by others. please refresh.");
  }
}



