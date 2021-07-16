package com.iwaodev.integration.order;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderDetailDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.config.MyTestConfiguration;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.ui.response.PaymentIntentResponse;
import com.iwaodev.util.ResourceReader;

// MockMvc stuff
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

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
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
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
import org.springframework.transaction.annotation.Transactional;

/**
 * Order Endpoint For Member Order Testing
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
/**
 * bug: ApplicationEventPublisher with @MockBean does not create mocked ApplicationEventPublisher.
 *
 * workaournd: create this Testconfiguration class.
 *
 * ref: https://github.com/spring-projects/spring-framework/issues/18907
 *
 **/
@Import(MyTestConfiguration.class)
public class GuestOrderEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(GuestOrderEndpointTest.class);

  private static final String targetPath = "/orders";

  @Autowired
  private MockMvc mvc;

  @LocalServerPort
  private int port;

  @MockBean
  private ApplicationEventPublisher publisher;

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

  @Autowired
  private ResourceReader resourceReader;

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

  @Test
  public void shouldNotGuestOrderAccessToThisEndpoint() throws Exception {

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    mvc.perform(MockMvcRequestBuilders.get(targetUrl).accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isForbidden());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldGuestCreateOrderSuccessfully.sql" })
  public void shouldGuestCreateOrderSuccessfully(@Value("classpath:/integration/order/shouldGuestCreateOrderSuccessfully.json") Resource dummyFormJsonFile) throws Exception {
    
    // dummy form json 
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
        .post(targetUrl)
        .content(dummyFormJsonString)
        .contentType(MediaType.APPLICATION_JSON)
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
    assertThat(order.getUser()).isNull();
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

      if (orderDetailDTO.getProductVariant().getVariantId().toString().equals("3")) {
        assertThat(orderDetailDTO.getProductWeight()).isEqualTo(1.00);
      } else if (orderDetailDTO.getProductVariant().getVariantId().toString().equals("6")) {
        assertThat(orderDetailDTO.getProductWeight()).isEqualTo(0.6);
      } else if (orderDetailDTO.getProductVariant().getVariantId().toString().equals("11")) {
        assertThat(new BigDecimal(orderDetailDTO.getProductWeight()).setScale(1, RoundingMode.UP)).isEqualTo(new BigDecimal(2.1).setScale(1, RoundingMode.DOWN));
      }
    }

    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(OrderFinalConfirmedEvent.class));

  }

  // also test with same product id but different variant ids

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldGuestCreateSessionTimeoutOrderEventSuccessfully.sql" })
  public void shouldGuestCreateSessionTimeoutOrderEventSuccessfully(
      @Value("classpath:/integration/order/shouldGuestCreateSessionTimeoutOrderEventSuccessfully.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events/session-timeout";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders
            .post(targetUrl)
            .content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print())
        .andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId()).isNotNull();
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(2);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.SESSION_TIMEOUT);

    for (OrderEventDTO orderEventDTO : responseBody.getOrderEvents()) {
      logger.info(orderEventDTO.toString());
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
      assertThat(orderEventDTO.getUndoable()).isEqualTo(false);
    }

  }
}

