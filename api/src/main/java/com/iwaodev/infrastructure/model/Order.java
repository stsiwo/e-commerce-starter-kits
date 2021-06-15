package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Transient;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.CompletedOrderPaymentEvent;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.order.event.ReceivedCancelRequestEvent;
import com.iwaodev.domain.order.event.ReceivedReturnRequestEvent;
import com.iwaodev.infrastructure.model.listener.OrderValidationListener;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.JoinColumnOrFormula;
import org.hibernate.annotations.JoinFormula;
import org.hibernate.annotations.JoinColumnsOrFormulas;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.AbstractAggregateRoot;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Data
@EntityListeners(OrderValidationListener.class)
@Entity(name = "orders")
public class Order {

  private static final Logger logger = LoggerFactory.getLogger(Order.class);

  private static final OrderStatusEnum[] deletableOrderStatusList = new OrderStatusEnum[] {
      OrderStatusEnum.CANCEL_REQUEST, OrderStatusEnum.RECEIVED_CANCEL_REQUEST, OrderStatusEnum.CANCELED,
      OrderStatusEnum.DELIVERED, OrderStatusEnum.RETURN_REQUEST, OrderStatusEnum.RECEIVED_RETURN_REQUEST,
      OrderStatusEnum.RETURNED, OrderStatusEnum.SHIPPED, OrderStatusEnum.ERROR, };

  @Id
  @Column(name = "order_id")
  @GeneratedValue
  @Type(type = "uuid-char")
  private UUID orderId;

  /**
   * #TODO: find a way to generate short uuid for this order number (not too long
   * one)
   **/
  @Column(name = "order_number")
  private String orderNumber;

  // ignore this setter since need to customize for bidirectional relationship
  @Getter(value = AccessLevel.NONE)
  @Column(name = "product_cost")
  private BigDecimal productCost = new BigDecimal(0);

  @Column(name = "tax_cost")
  private BigDecimal taxCost = new BigDecimal(0);

  @Column(name = "shipping_cost")
  private BigDecimal shippingCost = new BigDecimal(0);

  @Column(name = "note")
  private String note;

  @Column(name = "order_first_name")
  private String orderFirstName;

  @Column(name = "order_last_name")
  private String orderLastName;

  @Column(name = "order_email")
  private String orderEmail;

  @Column(name = "order_phone")
  private String orderPhone;

  @Column(name = "stripe_payment_intent_id")
  private String stripePaymentIntentId;

  @Column(name = "shipment_id")
  private String shipmentId;

  @Column(name = "tracking_pin")
  private String trackingPin;

  @Column(name = "refund_link")
  private String refundLink;

  @Column(name = "auth_return_tracking_pin")
  private String authReturnTrackingPin;

  @Column(name = "auth_return_expiry_date")
  private LocalDateTime authReturnExpiryDate;

  @Column(name = "auth_return_url")
  private LocalDateTime authReturnUrl;

  // I don't know to how to limit the result with this @JoinFormula...
  // ref: https://stackoverflow.com/questions/10980337/hibernate-joinformula
  //
  // possible solution: this might help. you can retrieve the lastest record
  // without using limit.
  // ref:
  // https://www.tutorialspoint.com/select-last-entry-without-using-limit-in-mysql
  // - TODO: try this above approach.
  //
  // so for now, it uses '@Formula' and return OrderStatusEnum for the lastest
  // order event.
  // @OneToOne
  // @JoinColumnsOrFormulas({
  // @JoinColumnOrFormula(formula=@JoinFormula(value="(SELECT oe FROM orders o
  // JOIN orderEvents oe WHERE o.orderId = id ORDER BY oe.createdAt DESC limit
  // 1)", referencedColumnName="id"))
  // })
  @Enumerated(EnumType.STRING)
  @Formula("(select oe.order_status from orders o inner join order_events oe on oe.order_id = o.order_id where o.order_id = order_id order by oe.created_at DESC limit 1)")
  private OrderStatusEnum latestOrderEventStatus;

  // use this as backup just in case
  // save it as blob so zip first
  // ref:
  // https://stackoverflow.com/questions/7009538/best-way-to-store-xml-data-in-a-mysql-database-with-some-specific-requirements
  @Column(name = "shipment_original_response")
  private LocalDateTime shipmentOriginalResponse;

  // use this as backup just in case
  // save it as blob so zip first
  // ref:
  // https://stackoverflow.com/questions/7009538/best-way-to-store-xml-data-in-a-mysql-database-with-some-specific-requirements
  @Column(name = "auth_return_original_response")
  private LocalDateTime authReturnOriginalResponse;

  @Column(name = "currency")
  private String currency;

  @OneToOne(mappedBy = "shippingOrder", cascade = CascadeType.ALL, orphanRemoval = true)
  @Setter(value = AccessLevel.NONE)
  private OrderAddress shippingAddress;

  @Setter(value = AccessLevel.NONE)
  @OneToOne(mappedBy = "billingOrder", cascade = CascadeType.ALL, orphanRemoval = true)
  private OrderAddress billingAddress;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  // ignore this setter since need to customize for bidirectional relationship
  @Setter(value = AccessLevel.NONE)
  /**
   * TODO: ?? bug??
   *
   * when include CascadeType.MERGE and try to save a new child, it causes 'object references an unsaved transient instance - save the transient instance before flushing'.
   *
   * - should work according to this: https://stackoverflow.com/questions/2302802/how-to-fix-the-hibernate-object-references-an-unsaved-transient-instance-save/2302814#2302814
   *
   **/
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("created_at ASC")
  private List<OrderEvent> orderEvents = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter(value = AccessLevel.NONE)
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("created_at ASC")
  private List<OrderDetail> orderDetails = new ArrayList<>();

  /**
   * these two properties is assigned after fetching teh data from database.
   *
   * they are used to display next addable order events based on the current
   * latest order event of this order.
   *
   * they are nothing relating to database column so use @Transient
   **/
  @Transient
  private List<OrderStatusEnum> nextAdminOrderEventOptions = new ArrayList<>();

  @Transient
  private List<OrderStatusEnum> nextMemberOrderEventOptions = new ArrayList<>();

  @Transient
  private OrderEvent latestOrderEvent;

  public Order() {
    this.orderNumber = "order_" + NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR, NanoIdUtils.DEFAULT_ALPHABET, 11);
  }

  public void setShippingAddress(OrderAddress shippingAddrss) {
    this.shippingAddress = shippingAddrss;
    shippingAddrss.setShippingOrder(this);
  }

  public void setBillingAddress(OrderAddress billingAddrss) {
    this.billingAddress = billingAddrss;
    billingAddrss.setBillingOrder(this);
  }

  public void setOrderDetails(List<OrderDetail> orderDetails) {
    this.orderDetails = orderDetails;

    for (OrderDetail orderDetail : orderDetails) {
      orderDetail.setOrder(this);
    }
  }

  public void addOrderDetail(OrderDetail orderDetail) {
    this.orderDetails.add(orderDetail);
    orderDetail.setOrder(this);
  }

  public void removeOrderDetail(OrderDetail orderDetail) {
    this.orderDetails.remove(orderDetail);
    orderDetail.setOrder(null);
  }

  public void setOrderEvents(List<OrderEvent> orderEvents) {
    this.orderEvents = orderEvents;

    for (OrderEvent orderEvent : orderEvents) {
      orderEvent.setOrder(this);
    }
  }

  public void addOrderEvent(OrderEvent orderEvent) {
    this.orderEvents.add(orderEvent);
    orderEvent.setOrder(this);
  }

  public void removeOrderEvent(OrderEvent orderEvent) {
    this.orderEvents.remove(orderEvent);
    orderEvent.setOrder(null);
  }

  // business behaviors
  public void calculateProductCost() {

    for (OrderDetail orderDetail : this.orderDetails) {
      logger.info("detail unit price cost: " + orderDetail.getProductUnitPrice());
      this.productCost = this.productCost
          .add(BigDecimal.valueOf(orderDetail.getProductQuantity()).multiply(orderDetail.getProductUnitPrice()));
    }

  }

  public BigDecimal getProductCost() {
    if (this.productCost == null || this.productCost.compareTo(BigDecimal.ZERO) == 0) {
      this.calculateProductCost();
    }
    return this.productCost;
  }

  public BigDecimal getTotalCost() {

    if (this.productCost == null || this.productCost.compareTo(BigDecimal.ZERO) == 0) {
      this.calculateProductCost();
    }

    logger.info("product cost: " + this.productCost);
    logger.info("tax cost: " + this.taxCost);
    logger.info("shipping cost: " + this.shippingCost);

    BigDecimal totalCost = new BigDecimal("0");
    totalCost = totalCost.add(this.productCost);
    totalCost = totalCost.add(this.taxCost);
    totalCost = totalCost.add(this.shippingCost);

    return totalCost;
  }

  // business behaviors
  public Order raiseTestEvent() {
    logger.info("raise test event at order class");
    // this.registerEvent(new OrderFinalConfirmedEvent());
    return this;
  }

  public LocalDateTime getOrderEventDateHappenedOf(OrderStatusEnum orderStatus) {
    for (OrderEvent orderEvent : this.orderEvents) {
      if (orderEvent.getOrderStatus() == orderStatus) {
        return orderEvent.getCreatedAt();
      }
    }
    return null;
  }

  public boolean isOrderEventHappenedOf(OrderStatusEnum orderStatus) {
    for (OrderEvent orderEvent : this.orderEvents) {
      if (orderEvent.getOrderStatus() == orderStatus) {
        return true;
      }
    }
    return false;
  }

  public boolean isPassEligibleDaysAfterDelivered(LocalDateTime curDate, int eligibleDays) {
    logger.info(this.getOrderEventDateHappenedOf(OrderStatusEnum.DELIVERED).toString());
    logger.info("" + eligibleDays);
    return curDate.isAfter(this.getOrderEventDateHappenedOf(OrderStatusEnum.DELIVERED).plusDays(eligibleDays));
  }

  public boolean isEligibleToRefund(LocalDateTime curDate, int eligibleDays) {

    if (!this.isOrderEventHappenedOf(OrderStatusEnum.PAID)
        || this.isOrderEventHappenedOf(OrderStatusEnum.PAYMENT_FAILED)
        || this.isOrderEventHappenedOf(OrderStatusEnum.SESSION_TIMEOUT)
        || this.isOrderEventHappenedOf(OrderStatusEnum.RETURNED)
        || this.isOrderEventHappenedOf(OrderStatusEnum.CANCELED)) {
      return false;
    }

    if (this.isOrderEventHappenedOf(OrderStatusEnum.DELIVERED)
        && this.isPassEligibleDaysAfterDelivered(curDate, eligibleDays)) {
      return false;
    }

    return true;
  }

  public OrderEvent retrieveLatestOrderEvent() {
    // assuming that the order of order events is perserved since this is array
    // list.
    logger.info("try to get latest event");
    logger.info("total event size: " + this.orderEvents.size());
    logger.info("total event size: " + this.getOrderEvents().size());
    return this.orderEvents.get(this.orderEvents.size() - 1);
  }

  public void updateOrderEvent(Long orderEventId, OrderEventCriteria criteria) {

    Optional<OrderEvent> eventOption = this.findOrderEventById(orderEventId);
    if (!eventOption.isEmpty()) {
      OrderEvent event = eventOption.get();

      // only update note
      event.setNote(criteria.getNote());
    }
  }

  public Optional<OrderEvent> findOrderEventById(Long orderEventId) {
    return this.orderEvents.stream().filter(orderEvent -> {
      if (orderEvent.getOrderEventId().equals(orderEventId)) {
        return true;
      }
      return false;
    }).findFirst();
  }

  /**
   * check this order is cancellable by member.
   *
   * if any order event contains "SHIPPED", no longer cancellable. if any order
   * event contains "CANCEL_REQUEST"/"RECEIVED_CANCEL_REQUEST"/"CANCELED", no
   * longer cancellable since the member already send cancel request. if any order
   * event contains "Failed_Payment", no longer cancellable since the order has
   * not completed.
   *
   * -> better to find the case when the member can cancel.
   *
   * if the last order event is "PAID", it is cancellable.
   *
   * TODO: re-review this... haha.
   * 
   *
   **/
  public boolean isCancellable() {
    return this.orderEvents.get(this.orderEvents.size() - 1).getOrderStatus().equals(OrderStatusEnum.PAID);
  }

  public boolean isReceivedCancelRequest() {
    return this.isOrderEventHappenedOf(OrderStatusEnum.CANCEL_REQUEST);
  }

  public boolean isReceivedReturnRequest() {
    return this.isOrderEventHappenedOf(OrderStatusEnum.RETURN_REQUEST);
  }

  /**
   * set up any transient properties (e.g., latestOrderEvent,
   * nextAdminOrderEventOptions, ...)
   **/
  public void setUpCalculatedProperties() {
    OrderEvent latestEvent = this.retrieveLatestOrderEvent();

    if (latestEvent == null) {
      logger.info("latest event is null");
    } 
    logger.info("" + latestEvent.getOrderEventId());
    logger.info("" + latestEvent.getOrderStatus());



      logger.info("before setlatestorderevent");
    this.setLatestOrderEvent(latestEvent);
      logger.info("before setnextadminorder");
    this.setNextAdminOrderEventOptions(this.getNextAddableOrderEventStatusForAdmin(latestEvent.getOrderStatus()));
      logger.info("before setnextmemberorder");
    this.setNextMemberOrderEventOptions(this.getNextAddableOrderEventStatusForMember(latestEvent.getOrderStatus()));
      logger.info("done");
  }

  public boolean isAddableAsNextForAdmin(OrderStatusEnum curOrderStatus, OrderStatusEnum latestOrderStatus) {
    List<OrderStatusEnum> addableOrderStatusList = this.getNextAddableOrderEventStatusForAdmin(latestOrderStatus);
    return addableOrderStatusList.contains(curOrderStatus);
  }

  public boolean isAddableAsNextForMember(OrderStatusEnum curOrderStatus, OrderStatusEnum latestOrderStatus) {
    List<OrderStatusEnum> addableOrderStatusList = this.getNextAddableOrderEventStatusForMember(latestOrderStatus);
    return addableOrderStatusList.contains(curOrderStatus);
  }

  /**
   * get a list of the next available order event for admin.
   *
   **/
  public List<OrderStatusEnum> getNextAddableOrderEventStatusForAdmin(OrderStatusEnum curOrderStatus) {
    if (curOrderStatus.equals(OrderStatusEnum.DRAFT)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.ORDERED);
          add(OrderStatusEnum.SESSION_TIMEOUT);
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.SESSION_TIMEOUT)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.ORDERED)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.PAYMENT_FAILED);
          add(OrderStatusEnum.PAID);
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.PAYMENT_FAILED)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.PAID)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.SHIPPED);
          add(OrderStatusEnum.CANCEL_REQUEST);
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.CANCEL_REQUEST)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.RECEIVED_CANCEL_REQUEST);
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.RECEIVED_CANCEL_REQUEST)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.CANCELED);
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.CANCELED)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.SHIPPED)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.DELIVERED);
          add(OrderStatusEnum.RETURN_REQUEST);
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.RETURN_REQUEST)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.RECEIVED_RETURN_REQUEST);
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.RECEIVED_RETURN_REQUEST)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.RETURNED);
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.RETURNED)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.ERROR);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.DELIVERED)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.RETURN_REQUEST);
          add(OrderStatusEnum.ERROR);
        }
      };
    } else {
      return new ArrayList<OrderStatusEnum>();
    }
  }

  /**
   * get a list of the next available order event for member.
   *
   **/
  public List<OrderStatusEnum> getNextAddableOrderEventStatusForMember(OrderStatusEnum curOrderStatus) {
    if (curOrderStatus.equals(OrderStatusEnum.PAID)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.CANCEL_REQUEST);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.SHIPPED)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.RETURN_REQUEST);
        }
      };
    } else if (curOrderStatus.equals(OrderStatusEnum.DELIVERED)) {
      return new ArrayList<OrderStatusEnum>() {
        {
          add(OrderStatusEnum.RETURN_REQUEST);
        }
      };
    } else {
      return new ArrayList<OrderStatusEnum>();
    }
  }

  /**
   * use this when you need to create OrderEvent. don't initialize OrderEvent
   * object directly.
   *
   * we need to assign 'undoable' for each order status.
   *
   **/
  public OrderEvent createOrderEvent(OrderStatusEnum orderStatus, String note) {
    OrderEvent event = new OrderEvent();
    event.setOrderStatus(orderStatus);
    event.setNote(note);

    if (Arrays.asList(this.deletableOrderStatusList).contains(orderStatus)) {
      event.setUndoable(true);
    } else {
      event.setUndoable(false);
    }

    return event;
  }
}
