package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.*;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.iwaodev.domain.order.OrderEventBag;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.validator.OrderValidation;
import com.iwaodev.infrastructure.model.listener.OrderListener;
import com.iwaodev.infrastructure.model.listener.OrderValidationListener;
import com.iwaodev.infrastructure.model.validator.OnCreate;
import com.iwaodev.infrastructure.model.validator.OnUpdate;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@OrderValidation()
@ToString()
@Getter
@Setter
/**
 * order & orderAddress cause stackoverflow with its lombok hashcode. so exclude
 * it. ref:
 * https://stackoverflow.com/questions/34972895/lombok-hashcode-issue-with-java-lang-stackoverflowerror-null
 **/
@EqualsAndHashCode(exclude = { "shippingAddress", "billingAddress" })
@EntityListeners(value = { OrderValidationListener.class })
@Entity(name = "orders")
public class Order {

  /**
   * you cannot use @Autowired in Hibernate Entity. be careful.
   */

  private static final Logger logger = LoggerFactory.getLogger(Order.class);

  private static final OrderEventBag orderEventBag = new OrderEventBag();

  @NotNull(message = "{order.id.notnull}", groups = OnUpdate.class)
  @Null(message = "{order.id.null}", groups = OnCreate.class)
  @Id
  @Column(name = "order_id")
  @GeneratedValue
  @Type(type = "uuid-char")
  private UUID orderId;

  /**
   * #TODO: find a way to generate short uuid for this order number (not too long
   * one)
   **/
  @NotEmpty(message = "{order.orderNumber.notempty}")
  @Column(name = "order_number")
  private String orderNumber;

  // ignore this setter since need to customize for bidirectional relationship
  @NotNull(message = "{order.productCost.notnull}")
  @DecimalMin(value = "1.0", message = "{order.productCost.min1}")
  @Getter(value = AccessLevel.NONE)
  @Column(name = "product_cost")
  private BigDecimal productCost = new BigDecimal(0);

  @NotNull(message = "{order.taxCost.notnull}")
  @Column(name = "tax_cost")
  private BigDecimal taxCost = new BigDecimal(0);

  @NotNull(message = "{order.shippingCost.notnull}")
  @Column(name = "shipping_cost")
  private BigDecimal shippingCost = new BigDecimal(0);

  @Column(name = "note")
  private String note;

  @NotEmpty(message = "{order.orderFirstName.notempty}")
  @Size(max = 100, message = "{order.orderFirstName.max100}")
  @Column(name = "order_first_name")
  private String orderFirstName;

  @NotEmpty(message = "{order.orderLastName.notempty}")
  @Size(max = 100, message = "{order.orderLastName.max100}")
  @Column(name = "order_last_name")
  private String orderLastName;

  @NotEmpty(message = "{order.email.notempty}")
  @Email(message = "{order.email.invalidformat}")
  @Size(max = 100, message = "{order.email.max100}")
  @Column(name = "order_email")
  private String orderEmail;

  @NotEmpty(message = "{order.orderPhone.notempty}")
  @Pattern(regexp = "^\\+(?:[0-9] ?){6,14}[0-9]$", message = "{order.orderPhone.invalidformat}")
  @Column(name = "order_phone")
  private String orderPhone;

  @NotEmpty(message = "{order.stripePaymentIntentId.notempty}")
  @Column(name = "stripe_payment_intent_id")
  private String stripePaymentIntentId;

  @Column(name = "transaction_result")
  private Boolean transactionResult = false;

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
  // ref: https://stackoverflow.com/questions/10980337/hibernate-jodebugrmula
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

  @NotEmpty(message = "{order.currency.notempty}")
  @Column(name = "currency")
  private String currency;

  // user is guest or not for this order
  @NotNull(message = "{order.isGuest.notnull}")
  @Column(name = "is_guest")
  private Boolean isGuest;

  @Column(name = "estimated_delivery_date")
  private LocalDateTime estimatedDeliveryDate;

  @Valid
  @NotNull(message = "{order.shippingAddress.notnull}")
  @OneToOne(mappedBy = "shippingOrder", cascade = CascadeType.ALL, orphanRemoval = true)
  @Setter(value = AccessLevel.NONE)
  private OrderAddress shippingAddress;

  @Valid
  @NotNull(message = "{order.billingAddress.notnull}")
  @Setter(value = AccessLevel.NONE)
  @OneToOne(mappedBy = "billingOrder", cascade = CascadeType.ALL, orphanRemoval = true)
  private OrderAddress billingAddress;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Version
  @Column(name = "version")
  private Long version;// = 0L; // assign initial value is not work here.

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  // ignore this setter since need to customize for bidirectional relationship
  @Setter(value = AccessLevel.NONE)
  /**
   * TODO: ?? bug??
   *
   * when include CascadeType.MERGE and try to save a new child, it causes 'object
   * references an unsaved transient instance - save the transient instance before
   * flushing'.
   *
   * - should work according to this:
   * https://stackoverflow.com/questions/2302802/how-to-fix-the-hibernate-object-references-an-unsaved-transient-instance-save/2302814#2302814
   *
   **/
  @Valid
  @NotNull(message = "{order.orderEvents.notnull}")
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("created_at ASC")
  private List<OrderEvent> orderEvents = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter(value = AccessLevel.NONE)
  @Valid
  @NotNull(message = "{order.orderDetails.notnull}")
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

  @Getter(value = AccessLevel.NONE)
  @Transient
  private OrderEvent latestOrderEvent;

  public Order() {
    this.orderNumber = "order_"
        + NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR, NanoIdUtils.DEFAULT_ALPHABET, 11);
    //this.version = 0L;  // this one also not working.
  }

  public String getFullName() {
    return String.format("%s %s", this.orderFirstName, this.orderLastName);
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

  /**
   * must use when you add a new order event to update transaction_result field.
   */
  public void updateTransactionResult() {

    /**
     * use retrieveLatestOrderEvent rather than getLatestOrderEvent.
     *
     * the latter might return null since this is @Transient.
     */
    OrderEvent curLatestOrderEvent = this.retrieveLatestOrderEvent();

    // transaction_resuslt
    /**
     * if order status is one of the following make it false:
     *  - 'RETURNED',
     *  - 'ERROR',
     *  - 'CANCELED',
     *  - 'DRAFT',
     *  - 'PAYMENT_FAILED',
     *  - 'ORDERED',
     *  - 'SESSION_TIMEOUT'
     */
    if (curLatestOrderEvent.getOrderStatus().equals(OrderStatusEnum.RETURNED) ||
            curLatestOrderEvent.getOrderStatus().equals(OrderStatusEnum.ERROR) ||
            curLatestOrderEvent.getOrderStatus().equals(OrderStatusEnum.CANCELED) ||
            curLatestOrderEvent.getOrderStatus().equals(OrderStatusEnum.DRAFT) ||
            curLatestOrderEvent.getOrderStatus().equals(OrderStatusEnum.PAYMENT_FAILED) ||
            curLatestOrderEvent.getOrderStatus().equals(OrderStatusEnum.ORDERED) ||
            curLatestOrderEvent.getOrderStatus().equals(OrderStatusEnum.SESSION_TIMEOUT)
    ) {
      this.setTransactionResult(false);
    }

    /**
     * if order status is one of the following make it true:
     *  PAID
     */
    if (curLatestOrderEvent.getOrderStatus().equals(OrderStatusEnum.PAID)) {
      this.setTransactionResult(true);
    }
  }

  // business behaviors

  /**
   * this might causes transactional doCommit exception.
   *
   * this is because the productCost field is modified after saved by calling
   * getProductCost().
   *
   * so workaround is to give a condition. if the productCost field has default
   * value (e.g., 1.00), call teh 'calculateProductCost', so that the field is no
   * longer modifed after saved.
   *
   **/
  public void calculateProductCost() {
    BigDecimal tempTotalCost = new BigDecimal("0");
    for (OrderDetail orderDetail : this.orderDetails) {
      tempTotalCost = tempTotalCost
          .add(BigDecimal.valueOf(orderDetail.getProductQuantity()).multiply(orderDetail.getProductUnitPrice()));
    }
    this.productCost = tempTotalCost;
  }

  public BigDecimal getProductCost() {
    if (this.productCost.compareTo(BigDecimal.valueOf(0)) == 0) {
      // this shouldn't be called after persisted.
      this.calculateProductCost();
    }
    return this.productCost;
  }

  public BigDecimal getTotalCost() {

    this.calculateProductCost();
    BigDecimal totalCost = new BigDecimal("0");
    totalCost = totalCost.add(this.productCost);
    totalCost = totalCost.add(this.taxCost);
    totalCost = totalCost.add(this.shippingCost);

    return totalCost;
  }

  public Double getTotalWeight() {

    /**
     * double cannot do arithmetic operation (e.g., adding). this results a wrong vlaue.
     * 
     * - use BigDecimal instead.
     *
     **/
     BigDecimal totalWeight = new BigDecimal(0.0); 

    for (OrderDetail orderDetail: this.orderDetails) {
        totalWeight = totalWeight.add(new BigDecimal(orderDetail.getProductWeight()));
    }

    return totalWeight.doubleValue();
  }

  // business behaviors
  public Order raiseTestEvent() {
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

  public OrderEvent getLatestOrderEvent() {
    return this.retrieveLatestOrderEvent();
  }

  public OrderEvent retrieveLatestOrderEvent() {
    // assuming that the order of order events is perserved since this is array
    // list.
    if (this.orderEvents.size() == 0) {
      return null;
    }
    return this.orderEvents.get(this.orderEvents.size() - 1);
  }

  public void updateOrderEvent(Long orderEventId, OrderEventCriteria criteria) {

    Optional<OrderEvent> eventOption = this.findOrderEventById(orderEventId);
    if (eventOption.isPresent()) {
      OrderEvent event = eventOption.get();

      // only update note
      event.setNote(criteria.getNote());
    }

  }

  public void bumpUpVersion() {

    // if this is for creating a new order
    if (this.getVersion() == null) {
      this.setVersion(0L);
    }
    this.setVersion(this.getVersion() + 1L);
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
  /**
   * if PostLoad on entity doesnt work for you, you need to define entity
   * listener.
   *
   * ref:
   * https://stackoverflow.com/questions/2802676/hibernate-postload-never-gets-invoked
   **/
  @PostLoad
  public void setUpCalculatedProperties() {
    OrderEvent latestEvent = this.retrieveLatestOrderEvent();

    if (latestEvent == null) {
      logger.debug("latest event is null");
    }
    this.setLatestOrderEvent(latestEvent);
    this.setNextAdminOrderEventOptions(this.orderEventBag.map.get(latestEvent.getOrderStatus()).getNextAddableEventsForAdmin());
    this.setNextMemberOrderEventOptions(this.orderEventBag.map.get(latestEvent.getOrderStatus()).getNextAddableEventsForMember());
  }

  public boolean isAddableAsNextForAdmin(OrderStatusEnum curOrderStatus, OrderStatusEnum latestOrderStatus) {
    List<OrderStatusEnum> addableOrderStatusList = this.orderEventBag.map.get(latestOrderStatus).getNextAddableEventsForAdmin();
    return addableOrderStatusList.contains(curOrderStatus);
  }

  public boolean isAddableAsNextForMember(OrderStatusEnum curOrderStatus, OrderStatusEnum latestOrderStatus) {
    List<OrderStatusEnum> addableOrderStatusList = this.orderEventBag.map.get(latestOrderStatus).getNextAddableEventsForMember();
    return addableOrderStatusList.contains(curOrderStatus);
  }


  public boolean isAddableByMember(OrderEvent orderEvent) {
    return orderEvent.isAddableByMember();
  }

  /**
   * use this when you need to create OrderEvent. don't initialize OrderEvent
   * object directly.
   *
   * we need to assign 'undoable' for each order status.
   *
   * don't use this directly. use "AddOrderEventService" instead.
   *
   **/
  public OrderEvent createOrderEvent(OrderStatusEnum orderStatus, String note) {
    OrderEvent event = new OrderEvent();
    event.setOrderStatus(orderStatus);
    event.setNote(note);
    event.setUndoable(orderEventBag.map.get(orderStatus).getIsUndoable());
    return event;
  }

  public String displayShippingAddress() {
    return this.shippingAddress.displayAddress();
  }

  public String displayBillingAddress() {
    return this.billingAddress.displayAddress();
  }

  /**
   * stripe requires to return min 50 (e.g, 50 cents and NOT 0.50).
   *
   * so return Long and multiply by 100 since we use 0.5 as 50 cents.
   **/
  public Long getTotalCostForStripe() {
    return this.getTotalCost().longValue() * 100;
  }

  /**
   *  show string format (12th June 2021) of estimatedDeliveryDate field.
   *
   */
  public String displayEstimatedDeliveryDate() {
    return this.estimatedDeliveryDate.toLocalDate().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy"));
  }
}
