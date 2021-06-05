package com.iwaodev.unit.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.iwaodev.application.iservice.PaymentService;
import com.iwaodev.domain.order.OrderRule;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.OrderEvent;
import com.iwaodev.ui.criteria.order.OrderAddressCriteria;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("unittest")
public class OrderTest {

  private static final Logger logger = LoggerFactory.getLogger(OrderTest.class);

  @Autowired
  private OrderRule orderRule;
  
  @Test
  public void shouldReturnProductCostSuccessfullyWhenCalculateProdoctCost() throws Exception {

    // arrange
    BigDecimal cost1 = new BigDecimal(100);
    Integer qty1 = 3;
    BigDecimal cost2 = new BigDecimal(200);
    Integer qty2 = 1;
    BigDecimal cost3 = new BigDecimal(300);
    Integer qty3 = 1;

    BigDecimal expectedProductCost = BigDecimal.valueOf(qty1).multiply(cost1).add(BigDecimal.valueOf(qty2).multiply(cost2).add(BigDecimal.valueOf(qty3).multiply(cost3))); 

    Order order = new Order();  
    OrderDetail od1 = new OrderDetail();
    od1.setProductUnitPrice(cost1);
    od1.setProductQuantity(qty1);
    OrderDetail od2 = new OrderDetail();
    od2.setProductUnitPrice(cost2);
    od2.setProductQuantity(qty2);
    OrderDetail od3 = new OrderDetail();
    od3.setProductUnitPrice(cost3);
    od3.setProductQuantity(qty3);

    order.addOrderDetail(od1);
    order.addOrderDetail(od2);
    order.addOrderDetail(od3);

    // act
    order.calculateProductCost();

    // assert
    assertThat(expectedProductCost).isEqualTo(order.getProductCost());
  }

  @Test
  public void shouldReturnFalseWhenIsEligibleToRefundSinceNoPaid() throws Exception {

    // arrange
    Order order = new Order();
    OrderEvent oe1 = new OrderEvent(OrderStatusEnum.DRAFT);
    OrderEvent oe2 = new OrderEvent(OrderStatusEnum.PAYMENT_FAILED);

    order.addOrderEvent(oe1);
    order.addOrderEvent(oe2);
    
    // act
    // assert
    assertThat(order.isEligibleToRefund(LocalDateTime.now(), this.orderRule.getEligibleDays())).isEqualTo(false);
  }

  @Test
  public void shouldReturnFalseWhenIsEligibleToRefundSincePassedRefundDays() throws Exception {

    // arrange
    Order order = new Order();
    OrderEvent oe1 = new OrderEvent(OrderStatusEnum.DRAFT);
    OrderEvent oe2 = new OrderEvent(OrderStatusEnum.ORDERED);
    OrderEvent oe3 = new OrderEvent(OrderStatusEnum.PAID);
    OrderEvent oe4 = new OrderEvent(OrderStatusEnum.DELIVERED);
    oe4.setCreatedAt(LocalDateTime.now().minusDays(31));

    order.addOrderEvent(oe1);
    order.addOrderEvent(oe2);
    order.addOrderEvent(oe3);
    order.addOrderEvent(oe4);
    
    // act
    // assert
    assertThat(order.isEligibleToRefund(LocalDateTime.now(), this.orderRule.getEligibleDays())).isEqualTo(false);
  }

  @Test
  public void shouldReturnTrueWhenIsEligibleToRefundSinceNotPassedRefundDays() throws Exception {

    // arrange
    Order order = new Order();
    OrderEvent oe1 = new OrderEvent(OrderStatusEnum.DRAFT);
    OrderEvent oe2 = new OrderEvent(OrderStatusEnum.ORDERED);
    OrderEvent oe3 = new OrderEvent(OrderStatusEnum.PAID);
    OrderEvent oe4 = new OrderEvent(OrderStatusEnum.DELIVERED);
    oe4.setCreatedAt(LocalDateTime.now().minusDays(20));

    order.addOrderEvent(oe1);
    order.addOrderEvent(oe2);
    order.addOrderEvent(oe3);
    order.addOrderEvent(oe4);
    
    // act
    // assert
    assertThat(order.isEligibleToRefund(LocalDateTime.now(), this.orderRule.getEligibleDays())).isEqualTo(true);
  }
}

