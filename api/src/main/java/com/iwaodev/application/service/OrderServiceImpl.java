package com.iwaodev.application.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.application.iservice.PaymentService;
import com.iwaodev.application.mapper.OrderMapper;
import com.iwaodev.application.specification.factory.OrderSpecificationFactory;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.domain.order.OrderRule;
import com.iwaodev.domain.order.OrderSortEnum;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.order.event.ReceivedCancelRequestEvent;
import com.iwaodev.domain.order.event.ReceivedReturnRequestEvent;
import com.iwaodev.domain.service.OrderEventService;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.ExceptionMessenger;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.OrderEvent;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.order.OrderCriteria;
import com.iwaodev.ui.criteria.order.OrderDetailCriteria;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import com.iwaodev.ui.criteria.order.OrderQueryStringCriteria;
import com.iwaodev.ui.response.PaymentIntentResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderServiceImpl implements OrderService, ApplicationEventPublisherAware {

  private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

  private OrderRepository orderRepository;

  private UserRepository userRepository;

  private ProductRepository productRepository;

  private PaymentService paymentService;

  private OrderRule orderRule;

  private OrderSpecificationFactory specificationFactory;

  private ApplicationEventPublisher publisher;

  private ExceptionMessenger exceptionMessenger;

  private OrderEventService orderEventService;

  @Autowired
  public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository,
      ProductRepository productRepository, PaymentService paymentService, OrderRule orderRule,
      OrderSpecificationFactory specificationFactory, ExceptionMessenger exceptionMessenger,
      OrderEventService orderEventService) {
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.paymentService = paymentService;
    this.orderRule = orderRule;
    this.specificationFactory = specificationFactory;
    this.exceptionMessenger = exceptionMessenger;
    this.orderEventService = orderEventService;
  }

  @Override
  public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
    this.publisher = publisher;
  }

  @Override
  public Page<OrderDTO> getAll(OrderQueryStringCriteria criteria, Integer page, Integer limit, OrderSortEnum sort) {
    return this.orderRepository
        .findAll(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
        .map(new Function<Order, OrderDTO>() {

          @Override
          public OrderDTO apply(Order order) {

            /**
             * calculate next addable order event for each order
             **/
            order.setUpCalculatedProperties();
            return OrderMapper.INSTANCE.toOrderDTO(order);
          }

        });
  }

  @Override
  public Page<OrderDTO> getAllByUserId(UUID userId, OrderQueryStringCriteria criteria, Integer page, Integer limit,
      OrderSortEnum sort) {

    Optional<User> targetEntityOption = this.userRepository.findById(userId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given user does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // assign the id to criteria
    criteria.setUserId(userId);

    return this.orderRepository
        .findAll(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
        .map(new Function<Order, OrderDTO>() {

          @Override
          public OrderDTO apply(Order order) {
            /**
             * calculate next addable order event for each order
             **/
            order.setUpCalculatedProperties();
            return OrderMapper.INSTANCE.toOrderDTO(order);
          }

        });
  }

  private Sort getSort(OrderSortEnum sortEnum) {

    if (sortEnum == OrderSortEnum.DATE_DESC) {
      return Sort.by("createdAt").descending();
    } else {
      return Sort.by("createdAt").ascending();
    }
  }

  @Override
  public OrderDTO getByIdAndUserId(UUID orderId, UUID userId) {

    Order order = this.orderRepository.findByOrderIdAndUserId(orderId, userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist."));

    order.setUpCalculatedProperties();
    return OrderMapper.INSTANCE.toOrderDTO(order);
  }

  @Override
  public OrderDTO getById(UUID orderId) {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<Order> targetEntityOption = this.orderRepository.findById(orderId);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given order does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist.");
    }

    Order order = targetEntityOption.get();

    order.setUpCalculatedProperties();
    return OrderMapper.INSTANCE.toOrderDTO(order);
  }

  /**
   * create a new order for member users
   *
   **/
  @Override
  @Transactional
  public PaymentIntentResponse createForMember(OrderCriteria criteria, UUID authUserId) {

    // prep input for the requst for stripe
    Order order = OrderMapper.INSTANCE.toOrderEntityFromOrderCriteria(criteria);

    // find user
    User customer = this.userRepository.findById(authUserId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            this.exceptionMessenger.getNotFoundMessage("user", authUserId.toString())));

    order.setUser(customer);

    // if customer already has customerId for stripe, get customerId from db and
    // assign to 'setCustomer' for the request
    String stripeCustomerId = Optional.ofNullable(customer.getStripeCustomerId()).orElse("");

    // if customer does nto have customerId, need a request to create it. (e.g.,
    // call PaymentService#createCustomer(): facade/adapter pattern)
    if (stripeCustomerId.isEmpty()) {
      try {
        Customer stripeCustomer = this.paymentService.createCustomer(criteria.getOrderFirstName(),
            criteria.getOrderLastName(), criteria.getOrderEmail(), criteria.getOrderPhone(),
            criteria.getShippingAddress(), criteria.getBillingAddress(), "");

        stripeCustomerId = stripeCustomer.getId();
      } catch (StripeException e) {
        logger.info(e.getMessage());
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
      }
    }

    logger.info("where is null exception");

    // create order details from orderDetailCriteria (mapping is not supported)
    this.assignOrderDetails(criteria, order);

    // create order events
    OrderEvent orderEvent = order.createOrderEvent(OrderStatusEnum.DRAFT, "");
    order.addOrderEvent(orderEvent);

    // finally, request to create payment intent
    PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder().setCustomer(stripeCustomerId)
        .setSetupFutureUsage(PaymentIntentCreateParams.SetupFutureUsage.ON_SESSION)
        .setReceiptEmail(order.getOrderEmail()).setCurrency(order.getCurrency())
        .setAmount(order.getTotalCost().longValue()).build();

    PaymentIntent intent;

    logger.info("where is null exception");

    try {
      intent = PaymentIntent.create(createParams);

    } catch (StripeException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    // assign payment intent id to this order
    order.setStripePaymentIntentId(intent.getId());
    /**
     * bug.
     *
     * hibernate return the same child entity twice in child list. e.g, orderEvents:
     * [ { 101 } , { 102 }, { 102 } ] <- 102 is duplicate.
     *
     * workaround: use 'flush'.
     *
     * otherwise, you might got an error 'object references an unsaved transient
     * instance – save the transient instance beforeQuery flushing'.
     *
     * - this is because hibernate recognize that the entity change its state again
     * by calling 'parent.getChildren().size()' wihtout flushing, so be careful!!!!
     *
     * ref:
     * https://stackoverflow.com/questions/7903800/hibernate-inserts-duplicates-into-a-onetomany-collection
     *
     **/

    Order savedOrder = this.orderRepository.save(order);

    this.publisher.publishEvent(new OrderFinalConfirmedEvent(this, savedOrder, stripeCustomerId, UserTypeEnum.MEMBER));

    // set any transient property up. DON'T FOREGET TO CALL
    savedOrder.setUpCalculatedProperties();

    return new PaymentIntentResponse(intent.getClientSecret(), OrderMapper.INSTANCE.toOrderDTO(savedOrder));
  }

  @Override
  @Transactional
  public PaymentIntentResponse createForGuest(OrderCriteria criteria) {
    // prep input for the requst for stripe
    Order order = OrderMapper.INSTANCE.toOrderEntityFromOrderCriteria(criteria);

    logger.info("order address");
    logger.info(order.getShippingAddress().getOrderAddressId().toString());

    // assign address explicitly
    order.setBillingAddress(order.getShippingAddress());

    // create order details from orderDetailCriteria (mapping is not supported)
    this.assignOrderDetails(criteria, order);

    // create order events
    OrderEvent orderEvent = order.createOrderEvent(OrderStatusEnum.DRAFT, "");
    order.addOrderEvent(orderEvent);

    // finally, request to create payment intent
    PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder()
        .setReceiptEmail(order.getOrderEmail()).setCurrency(order.getCurrency())
        .setAmount(order.getTotalCost().longValue()).build();

    logger.info("total cost: ");
    logger.info("" + order.getTotalCost().toString());

    logger.info("debug create params for stripe: ");
    // logger.info("" + createParams.toString());
    PaymentIntent intent;

    try {
      intent = PaymentIntent.create(createParams);

    } catch (StripeException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    // assign payment intent id to this order
    order.setStripePaymentIntentId(intent.getId());

    Order savedOrder = this.orderRepository.save(order);

    this.publisher.publishEvent(new OrderFinalConfirmedEvent(this, savedOrder, null, UserTypeEnum.GUEST));

    // set any transient property up. DON'T FOREGET TO CALL
    savedOrder.setUpCalculatedProperties();

    return new PaymentIntentResponse(intent.getClientSecret(), OrderMapper.INSTANCE.toOrderDTO(savedOrder));
  }

  public void assignOrderDetails(OrderCriteria criteria, Order order) {

    /**
     * avoid n+1 problem (e.g., sql inside for loop like below).
     *
     **/
    List<UUID> productIds = criteria.getOrderDetails().stream().map(orderDetail -> orderDetail.getProductId())
        .collect(Collectors.toList());

    logger.info("target product ids: ");
    logger.info("" + productIds.toString());

    Map<UUID, Product> products = this.productRepository.findAllByIds(productIds);

    // add orderDetails to this order
    for (OrderDetailCriteria orderDetailCriteria : criteria.getOrderDetails()) {

      // find target product and variant by criteria productId & variantId
      // TODO: make sure pessimistic lock works
      // why need pessimistic here??
      // comment this out. if you figure out, remove this comment.
      // Optional<Product> productOption = this.productRepository
      // .findByIdWithPessimisticLock(orderDetailCriteria.getProductId());
      // Product product =
      // this.productRepository.findById(orderDetailCriteria.getProductId())
      // .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
      // this.exceptionMessenger.getNotFoundMessage("product",
      // orderDetailCriteria.getProductId().toString())));

      Product product = products.getOrDefault(orderDetailCriteria.getProductId(), null);

      if (product == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
            this.exceptionMessenger.getNotFoundMessage("product", orderDetailCriteria.getProductId().toString()));
      }

      try {

        logger.info("current price: ");
        logger.info("" + product.getCurrentPriceOfVariant(orderDetailCriteria.getProductVariantId()));
        OrderDetail orderDetail = new OrderDetail(orderDetailCriteria.getProductQuantity(),
            product.getCurrentPriceOfVariant(orderDetailCriteria.getProductVariantId()),
            product.getColorOfVariant(orderDetailCriteria.getProductVariantId()),
            product.getSizeOfVariant(orderDetailCriteria.getProductVariantId()), product.getProductName(),
            product.findVariantById(orderDetailCriteria.getProductVariantId()), product, order);

        order.addOrderDetail(orderDetail);
      } catch (NotFoundException e) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
      }
    }
  }

  @Override
  @Transactional
  public OrderDTO addSessionTimeoutOrderEvent(UUID orderId, String orderNumber, UUID userId) {

    Order order = this.orderRepository.findByOrderIdAndOrderNumber(orderId, orderNumber)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist."));

    logger.info("order id for session timeout: " + order.getOrderId().toString());

    try {
      this.orderEventService.add(order, OrderStatusEnum.SESSION_TIMEOUT, "", userId);
    } catch (NotFoundException e) {
      new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
    } catch (DomainException e) {
      new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
    }

    Order savedOrder = this.orderRepository.save(order);
    /**
     * bug.
     *
     * hibernate return the same child entity twice in child list. e.g, orderEvents:
     * [ { 101 } , { 102 }, { 102 } ] <- 102 is duplicate.
     *
     * workaround: use 'flush'.
     *
     * otherwise, you might got an error 'object references an unsaved transient
     * instance – save the transient instance beforeQuery flushing'.
     *
     * - this is because hibernate recognize that the entity change its state again
     * by calling 'parent.getChildren().size()' wihtout flushing, so be careful!!!!
     *
     * ref:
     * https://stackoverflow.com/questions/7903800/hibernate-inserts-duplicates-into-a-onetomany-collection
     *
     **/
    this.orderRepository.flush();

    savedOrder.setUpCalculatedProperties();

    return OrderMapper.INSTANCE.toOrderDTO(savedOrder);
  }

  @Override
  public OrderDTO addOrderEvent(UUID orderId, OrderEventCriteria criteria) {

    Optional<Order> orderOption = this.orderRepository.findById(orderId);

    if (orderOption.isEmpty()) {
      // order not found so return error
      logger.info("the given order does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist.");
    }

    Order order = orderOption.get();

    // check a given order status is addable as next.
    if (!order.isAddableAsNextForAdmin(criteria.getOrderStatus(), order.getLatestOrderEventStatus())) {
      logger.info("the given order status is not addable as next.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "the given order status is not addable as next.");
    }

    OrderEvent orderEvent = order.createOrderEvent(criteria.getOrderStatus(), criteria.getNote());

    // admin
    if (criteria.getUserId() != null) {
      // the customer
      User customer = this.userRepository.findById(criteria.getUserId())
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
              this.exceptionMessenger.getNotFoundMessage("user", criteria.getUserId().toString())));

      orderEvent.setUser(customer);
    }

    order.addOrderEvent(orderEvent);

    logger.info("size of order:");
    logger.info("" + order.getOrderEvents().size());

    Order savedOrder = this.orderRepository.save(order);

    for (OrderEvent event : savedOrder.getOrderEvents()) {
      logger.info("order event id: " + event.getOrderEventId().toString());
    }

    // set any transient property up. DON'T FOREGET TO CALL
    savedOrder.setUpCalculatedProperties();

    return OrderMapper.INSTANCE.toOrderDTO(savedOrder);
  }

  @Override
  public OrderDTO addOrderEventByMember(UUID orderId, OrderEventCriteria criteria) {

    Optional<Order> orderOption = this.orderRepository.findById(orderId);

    if (orderOption.isEmpty()) {
      logger.info("the given order does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist.");
    }

    Order targetOrder = orderOption.get();

    // check a given order status is addable as next.
    if (!targetOrder.isAddableAsNextForMember(criteria.getOrderStatus(), targetOrder.getLatestOrderEventStatus())) {
      logger.info("the given order status is not addable as next.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "the given order status is not addable as next.");
    }

    /**
     * TODO: refactor this below since don't need any more. teh above
     * isAddableAsNextForMember' cover all of cases except 'refund period' stuff.
     **/

    // check if new order event is either REQUEST_RETURN or REQUEST_CANCEL
    // otherwise, reject.
    if (!criteria.getOrderStatus().equals(OrderStatusEnum.RETURN_REQUEST)
        && !criteria.getOrderStatus().equals(OrderStatusEnum.CANCEL_REQUEST)) {
      logger.info("the member only allows to add 'CANCEL_REQUEST' or 'RETURN_REQUEST'.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "the member only allows to add 'CANCEL_REQUEST' or 'RETURN_REQUEST'.");
    }

    // if the new order event is 'cancel-request'
    if (criteria.getOrderStatus().equals(OrderStatusEnum.CANCEL_REQUEST)) {

      if (targetOrder.isReceivedCancelRequest()) {
        logger.info("sorry. we already receieved cancel request from you before.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "sorry. we already receieved cancel request from you before.");
      }

      if (!targetOrder.isCancellable()) {
        logger.info("sorry. this order is not cancellable.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sorry. this order is not cancellable.");
      }

    } else {
      // if the new order event is 'return-request'
      if (targetOrder.isReceivedReturnRequest()) {
        logger.info("sorry. we already receieved return request from you before.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "sorry. we already receieved return request from you before.");
      }

      LocalDateTime curDateTime = LocalDateTime.now();
      if (!targetOrder.isEligibleToRefund(curDateTime, this.orderRule.getEligibleDays())) {
        logger.info("sorry. this order is not eligible to return.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sorry. this order is not eligible to return.");
      }
    }

    // all conditions passed so save it to db
    OrderEvent newOrderEvent = targetOrder.createOrderEvent(criteria.getOrderStatus(), criteria.getNote());

    // get customer
    User user = this.userRepository.findById(criteria.getUserId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            this.exceptionMessenger.getNotFoundMessage("user", criteria.getUserId().toString())));

    newOrderEvent.setUser(user);

    targetOrder.addOrderEvent(newOrderEvent);

    Order savedOrder = this.orderRepository.save(targetOrder);

    // set any transient property up. DON'T FOREGET TO CALL
    savedOrder.setUpCalculatedProperties();

    return OrderMapper.INSTANCE.toOrderDTO(savedOrder);
  }

  @Override
  public void refundOrderAfterShipment(UUID orderId) {

    /**
     * get target order
     * 
     **/
    Optional<Order> orderOption = this.orderRepository.findById(orderId);

    if (orderOption.isEmpty()) {
      // user not found so return error
      logger.info("the target order does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist.");
    }

    Order order = orderOption.get();

    /**
     * check eligibility
     *
     **/
    LocalDateTime curDateTime = LocalDateTime.now();
    if (!order.isEligibleToRefund(curDateTime, this.orderRule.getEligibleDays())) {
      logger.info("sorry, you are not eligible to refund for this order.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "sorry, you are not eligible to refund for this order.");
    }

    /**
     * prep refund request to stripe
     *
     * - get paymentIntentId from the order
     **/
    String paymentIntentId = order.getStripePaymentIntentId();

    /**
     * send refund request to Stripe
     *
     * - error handling esp when failed to refund
     **/
    try {
      this.paymentService.requestRefund(paymentIntentId);
    } catch (StripeException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    /**
     * add an order event (e.g., refund)
     *
     * - use RETURNED since the shipment already made.
     **/
    OrderEvent orderEvent = order.createOrderEvent(OrderStatusEnum.RETURNED, "");

    order.addOrderEvent(orderEvent);

    Order savedOrder = this.orderRepository.save(order);

    /**
     * TODO: change this event name. this is misnomer. it should be 'ReturnedEvent'
     * or something
     **/
    this.publisher.publishEvent(new ReceivedReturnRequestEvent(this, savedOrder));

    /**
     * domain event.
     * 
     * - handle shipment logic (e.g., get return label for the order).
     * 
     * * Don't complete (RETURNED) here. once the admin makes sure that the item is
     * returned, get the stock back and add RETURNED order event.
     *
     **/

  }

  @Override
  public void refundBeforeShipment(UUID orderId) {

    /**
     * get target order
     * 
     **/
    Optional<Order> orderOption = this.orderRepository.findById(orderId);

    if (orderOption.isEmpty()) {
      // user not found so return error
      logger.info("the target order does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist.");
    }

    Order order = orderOption.get();

    /**
     * check eligibility
     *
     **/
    LocalDateTime curDateTime = LocalDateTime.now();
    if (!order.isEligibleToRefund(curDateTime, this.orderRule.getEligibleDays())) {
      logger.info("sorry, you are not eligible to refund for this order.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "sorry, you are not eligible to refund for this order.");
    }

    /**
     * prep refund request to stripe
     *
     * - get paymentIntentId from the order
     **/
    String paymentIntentId = order.getStripePaymentIntentId();

    /**
     * send refund request to Stripe
     *
     * - error handling esp when failed to refund
     **/
    try {
      this.paymentService.requestRefund(paymentIntentId);
    } catch (StripeException e) {
      logger.info(e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    /**
     * add an order event (e.g., refund)
     *
     * - use CANCELED since there is no involvement with customer
     **/
    OrderEvent orderEventForCanceled = order.createOrderEvent(OrderStatusEnum.CANCELED, "");

    order.addOrderEvent(orderEventForCanceled);

    Order savedOrder = this.orderRepository.save(order);

    /**
     * TODO: change this event name. this is misnomer. it should be 'CanceledEvent'
     * or something
     **/
    this.publisher.publishEvent(new ReceivedCancelRequestEvent(this, savedOrder));

    /**
     * domain event handlers
     *
     * - handle cancelation of this shipment - handle stock back
     *
     **/
  }

  @Transactional
  @Override
  public void testEvent() {
    Order order = new Order();
    order.raiseTestEvent();
  }

  @Override
  public OrderDTO deleteOrderEvent(UUID orderId, Long orderEventId) {

    /**
     * get target order
     * 
     **/
    Optional<Order> orderOption = this.orderRepository.findById(orderId);

    if (orderOption.isEmpty()) {
      // user not found so return error
      logger.info("the target order does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist.");
    }

    Order order = orderOption.get();

    OrderEvent lastOrderEvent = order.retrieveLatestOrderEvent();

    if (!orderEventId.equals(lastOrderEvent.getOrderEventId())) {
      logger.info("only latest order event is deletable");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "only latest order event is deletable");
    }

    if (!lastOrderEvent.getUndoable()) {
      logger.info("this event is not deletable.");
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "this event is not deletable.");
    }

    order.removeOrderEvent(lastOrderEvent);

    Order savedOrder = this.orderRepository.save(order);

    // set any transient property up.
    savedOrder.setUpCalculatedProperties();

    return OrderMapper.INSTANCE.toOrderDTO(savedOrder);

  }

  @Override
  public OrderEventDTO updateOrderEvent(UUID orderId, Long orderEventId, OrderEventCriteria criteria) {

    /**
     * get target order
     * 
     **/
    Optional<Order> orderOption = this.orderRepository.findById(orderId);

    if (orderOption.isEmpty()) {
      // user not found so return error
      logger.info("the target order does not exist");
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist.");
    }

    Order order = orderOption.get();

    order.updateOrderEvent(orderEventId, criteria);

    Order savedOrder = this.orderRepository.save(order);

    Optional<OrderEvent> updatedOrderEventOption = savedOrder.findOrderEventById(orderEventId);

    return OrderMapper.INSTANCE.toOrderEventDTO(updatedOrderEventOption.get());

  }

}