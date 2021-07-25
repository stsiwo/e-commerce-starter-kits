package com.iwaodev.integration.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import javax.servlet.http.Cookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderDetailDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.config.MyTestConfiguration;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.user.UserTypeEnum;
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
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
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
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
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
public class AdminOrderEndpointTest {

  private static final Logger logger = LoggerFactory.getLogger(AdminOrderEndpointTest.class);

  private static final String targetPath = "/orders";

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

  @MockBean
  private ApplicationEventPublisher publisher;

  @Autowired
  private ResourceReader resourceReader;

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
    this.baseDatabaseSetup.setup(this.entityManager);

    // send authentication request before testing
    this.authInfo = this.authenticateTestUser.setup(this.entityManager, this.mvc, UserTypeEnum.ADMIN, this.port);

    this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
    this.csrfCookie = new Cookie("csrf-token", this.authInfo.getCsrfToken());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminGetAllOrders.sql" })
  public void shouldAdminGetAllOrders() throws Exception {

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (OrderDTO orderDTO : responseBody) {
      // assert
      assertThat(orderDTO.getOrderId()).isNotNull();
      assertThat(orderDTO.getStripePaymentIntentId()).isNotNull();

      for (OrderDetailDTO orderDetailDTO : orderDTO.getOrderDetails()) {
        assertThat(orderDetailDTO.getIsReviewable()).isNotNull();
      }
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminGetAllOrdersWithIsReviewable.sql" })
  public void shouldAdminGetAllOrdersWithIsReviewable() throws Exception {

    String targetUrl = "http://localhost:" + this.port + this.targetPath;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (OrderDTO orderDTO : responseBody) {
      // assert
      assertThat(orderDTO.getOrderId()).isNotNull();

      if (orderDTO.getOrderId().toString().equals("c8f8591c-bb83-4fd1-a098-3fac8d40e450")) {
        for (OrderDetailDTO orderDetailDTO : orderDTO.getOrderDetails()) {
          assertThat(orderDetailDTO.getIsReviewable()).isTrue();
        }
      } else {
        for (OrderDetailDTO orderDetailDTO : orderDTO.getOrderDetails()) {
          assertThat(orderDetailDTO.getIsReviewable()).isFalse();
        }
      }

    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminGetAllOrdersWithOrderIdFilter.sql" })
  public void shouldAdminGetAllOrdersWithOrderIdFilter() throws Exception {

    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450"; // make sure match with sql.
    String searchQuery = "?orderId=" + dummyOrderId;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQuery;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (OrderDTO orderDTO : responseBody) {
      // assert
      assertThat(orderDTO.getOrderId().toString()).isEqualTo(dummyOrderId);
    }

  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminGetAllOrdersWithOrderIdFilter.sql" })
  public void shouldAdminGetAllOrdersWithsearchQueryOrderIdFilter() throws Exception {

    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450"; // make sure match with sql.
    String searchQuery = "?searchQuery=" + dummyOrderId;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQuery;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (OrderDTO orderDTO : responseBody) {
      // assert
      assertThat(orderDTO.getOrderId().toString()).isEqualTo(dummyOrderId);
    }

  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminGetAllOrdersWithOrderNumberFilter.sql" })
  public void shouldAdminGetAllOrdersWithOrderNumberFilter() throws Exception {

    String dummyOrderNumber = "order_w0vDYZvqy_Y"; // make sure match with sql.
    String searchQuery = "?searchQuery=" + dummyOrderNumber;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQuery;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (OrderDTO orderDTO : responseBody) {
      // assert
      assertThat(orderDTO.getOrderNumber().toString()).isEqualTo(dummyOrderNumber);
    }

  }

  // filter: startDate
  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminGetAllOrdersWithStartDateFilter.sql" })
  public void shouldAdminGetAllOrdersWithStartDateFilter() throws Exception {

    LocalDateTime dummyStartDate = LocalDateTime.of(2022, 1, 1, 0, 0, 0);
    String searchQueryString = "?startDate=" + dummyStartDate.toString();
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQueryString;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (OrderDTO orderDTO : responseBody) {
      // assert
      assertThat(orderDTO.getCreatedAt()).isAfter(dummyStartDate);
    }

  }

  // filter: endDate
  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminGetAllOrdersWithEndDateFilter.sql" })
  public void shouldAdminGetAllOrdersWithEndDateFilter() throws Exception {

    LocalDateTime dummyEndDate = LocalDateTime.of(2022, 1, 1, 0, 0, 0);
    String searchQueryString = "?endDate=" + dummyEndDate.toString();
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQueryString;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (OrderDTO orderDTO : responseBody) {
      // assert
      assertThat(orderDTO.getCreatedAt()).isBefore(dummyEndDate);
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminGetAllOrdersWithOrderStatusFilter.sql" })
  public void shouldAdminGetAllOrdersWithOrderStatusFilter() throws Exception {

    String dummyOrderStatus = "PAID"; // make sure match with sql.
    String searchQuery = "?orderStatus=" + dummyOrderStatus;
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQuery;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.get(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (OrderDTO orderDTO : responseBody) {
      // assert
      assertThat(orderDTO.getLatestOrderEvent().getOrderStatus().toString()).isEqualTo(dummyOrderStatus);
    }

  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminSortByDateDesc.sql" })
  public void shouldAdminSortByDateDesc() throws Exception {

    String searchQuery = "?sort=DATE_DESC";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQuery;

    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders.get(targetUrl)
                    .cookie(this.authCookie)
                    .cookie(this.csrfCookie)
                    .header("csrf-token", this.authInfo.getCsrfToken())
                    .accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (int i = 0; i < responseBody.length; i++) {
      int next = i+1;
      if (next < responseBody.length) {
        assertThat(responseBody[i].getCreatedAt()).isAfter(responseBody[next].getCreatedAt());
      }
    }

  }
  // sort: date asc
  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminSortByDateAsc.sql" })
  public void shouldAdminSortByDateAsc() throws Exception {

    String searchQuery = "?sort=DATE_ASC";
    String targetUrl = "http://localhost:" + this.port + this.targetPath + searchQuery;

    // act
    ResultActions resultActions = mvc
            .perform(MockMvcRequestBuilders.get(targetUrl)
                    .cookie(this.authCookie)
                    .cookie(this.csrfCookie)
                    .header("csrf-token", this.authInfo.getCsrfToken())
                    .accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode.get("content"), OrderDTO[].class);

    assertThat(responseBody.length).isGreaterThan(0);
    for (int i = 0; i < responseBody.length; i++) {
      int next = i+1;
      if (next < responseBody.length) {
        assertThat(responseBody[i].getCreatedAt()).isBeforeOrEqualTo(responseBody[next].getCreatedAt());
      }
    }

  }
  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminCreateOrderEventSuccessfully.sql" })
  public void shouldAdminCreateOrderEventSuccessfully(
      @Value("classpath:/integration/order/shouldAdminCreateOrderEventSuccessfully.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String adminUserId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId()).isNotNull();
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(4);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.ERROR);
    assertThat(responseBody.getLatestOrderEvent().getUser().getUserId().toString()).isEqualTo(adminUserId);
    assertThat(responseBody.getLatestOrderEvent().getUndoable()).isEqualTo(true);

    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(OrderEventWasAddedEvent.class));
  }

  @Test
  @Sql(scripts = {
      "classpath:/integration/order/shouldAdminGetIsReviewableTrueWhenCreateOrderEventOfDeliveredSuccessfully.sql" })
  public void shouldAdminGetIsReviewableTrueWhenCreateOrderEventOfDeliveredSuccessfully(
      @Value("classpath:/integration/order/shouldAdminGetIsReviewableTrueWhenCreateOrderEventOfDeliveredSuccessfully.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String adminUserId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId()).isNotNull();
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(3);

    for (OrderDetailDTO orderDetailDto : responseBody.getOrderDetails()) {
      assertThat(orderDetailDto.getIsReviewable()).isEqualTo(true);
    }

    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(OrderEventWasAddedEvent.class));
  }

  @Test
  @Sql(scripts = {
      "classpath:/integration/order/shouldNotAdminGetIsReviewableTrueSinceCreateOrderEventOfNonDelivered.sql" })
  public void shouldNotAdminGetIsReviewableTrueSinceCreateOrderEventOfNonDelivered(
      @Value("classpath:/integration/order/shouldNotAdminGetIsReviewableTrueSinceCreateOrderEventOfNonDelivered.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String adminUserId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId()).isNotNull();
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(2);

    for (OrderDetailDTO orderDetailDto : responseBody.getOrderDetails()) {
      assertThat(orderDetailDto.getIsReviewable()).isEqualTo(false);
    }

    Mockito.verify(this.publisher, Mockito.times(1)).publishEvent(Mockito.any(OrderEventWasAddedEvent.class));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldNotAdminCreateOrderEventSinceNoAddable.sql" })
  public void shouldNotAdminCreateOrderEventSinceNoAddable(
      @Value("classpath:/integration/order/shouldNotAdminCreateOrderEventSinceNoAddable.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String adminUserId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events";

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.post(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

    Mockito.verify(this.publisher, Mockito.never()).publishEvent(Mockito.any(OrderEventWasAddedEvent.class));
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminUpdateOrderEventSuccessfully.sql" })
  public void shouldAdminUpdateOrderEventSuccessfully(
      @Value("classpath:/integration/order/shouldAdminUpdateOrderEventSuccessfully.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id and order event id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String adminUserId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b";
    String dummyOrderEventId = "56";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events/"
        + dummyOrderEventId;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.put(targetUrl).content(dummyFormJsonString)
            .contentType(MediaType.APPLICATION_JSON)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderEventDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderEventDTO.class);

    // assert
    assertThat(responseBody.getOrderEventId().toString()).isEqualTo(dummyOrderEventId);
    assertThat(responseBody.getOrderStatus()).isEqualTo(OrderStatusEnum.DRAFT);
    assertThat(responseBody.getUndoable()).isEqualTo(false);
    assertThat(responseBody.getNote()).isEqualTo(dummyFormJson.get("note").asText());
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldAdminDeleteOrderEventSuccessfully.sql" })
  public void shouldAdminDeleteOrderEventSuccessfully(
      @Value("classpath:/integration/order/shouldAdminDeleteOrderEventSuccessfully.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id and order event id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String adminUserId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b";
    String dummyOrderEventId = "58";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events/"
        + dummyOrderEventId;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.delete(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());

    MvcResult result = resultActions.andReturn();

    JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
    OrderDTO responseBody = this.objectMapper.treeToValue(contentAsJsonNode, OrderDTO.class);

    // assert
    assertThat(responseBody.getOrderId().toString()).isEqualTo(dummyOrderId);
    assertThat(responseBody.getOrderEvents().size()).isEqualTo(2);
    assertThat(responseBody.getLatestOrderEvent().getOrderStatus()).isEqualTo(OrderStatusEnum.ORDERED);

    for (OrderEventDTO orderEventDTO : responseBody.getOrderEvents()) {
      assertThat(orderEventDTO.getOrderEventId()).isNotNull();
    }
  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldNotAdminDeleteOrderEventSinceNotLatestOrderEvent.sql" })
  public void shouldNotAdminDeleteOrderEventSinceNotLatestOrderEvent(
      @Value("classpath:/integration/order/shouldNotAdminDeleteOrderEventSinceNotLatestOrderEvent.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id and order event id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String adminUserId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b";
    String dummyOrderEventId = "57";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events/"
        + dummyOrderEventId;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.delete(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

  }

  @Test
  @Sql(scripts = { "classpath:/integration/order/shouldNotAdminDeleteOrderEventSinceNotUndoableOrderEvent.sql" })
  public void shouldNotAdminDeleteOrderEventSinceNotUndoableOrderEvent(
      @Value("classpath:/integration/order/shouldNotAdminDeleteOrderEventSinceNotUndoableOrderEvent.json") Resource dummyFormJsonFile)
      throws Exception {

    // dummy order id and order event id must match with sql.

    // dummy form json
    JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
    String dummyFormJsonString = dummyFormJson.toString();
    String dummyOrderId = "c8f8591c-bb83-4fd1-a098-3fac8d40e450";
    String adminUserId = "e95bf632-1518-4bf2-8ba9-cd8b7587530b";
    String dummyOrderEventId = "58";

    String targetUrl = "http://localhost:" + this.port + this.targetPath + "/" + dummyOrderId + "/events/"
        + dummyOrderEventId;

    // act
    ResultActions resultActions = mvc
        .perform(MockMvcRequestBuilders.delete(targetUrl)
            .cookie(this.authCookie)
          .cookie(this.csrfCookie)
          .header("csrf-token", this.authInfo.getCsrfToken())
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isBadRequest());

  }
}
