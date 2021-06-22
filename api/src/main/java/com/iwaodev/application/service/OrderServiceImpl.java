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
import com.iwaodev.domain.order.event.OrderEventWasAddedByMemberEvent;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.order.event.OrderCanceledEvent;
import com.iwaodev.domain.order.event.OrderReturnedEvent;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

  private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private PaymentService paymentService;

  @Autowired
  private OrderRule orderRule;

  @Autowired
  private OrderSpecificationFactory specificationFactory;

  @Autowired
  private ApplicationEventPublisher publisher;

  @Autowired
  private ExceptionMessenger exceptionMessenger;

  @Autowired
  private OrderEventService orderEventService;

  @Override
  public Page<OrderDTO> getAll(OrderQueryStringCriteria criteria, Integer page, Integer limit, OrderSortEnum sort) {
    return this.orderRepository
        .findAllToAvoidNPlusOne(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
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
  public PaymentIntentResponse createForMember(OrderCriteria criteria, UUID authUserId) {

    // prep input for the requst for stripe
    Order order = OrderMapper.INSTANCE.toOrderEntityFromOrderCriteria(criteria);

    // find user
    User customer = this.userRepository.findById(authUserId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            this.exceptionMessenger.getNotFoundMessage("user", authUserId.toString())));

    order.setUser(customer);
    order.setIsGuest(false);

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
    try {
      this.orderEventService.add(order, OrderStatusEnum.DRAFT, "", customer);
    } catch (DomainException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }

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

    this.publisher.publishEvent(new OrderFinalConfirmedEvent(this, savedOrder, stripeCustomerId, UserTypeEnum.MEMBER));

    // set any transient property up. DON'T FOREGET TO CALL
    savedOrder.setUpCalculatedProperties();

    return new PaymentIntentResponse(intent.getClientSecret(), OrderMapper.INSTANCE.toOrderDTO(savedOrder));
  }

  @Override
  public PaymentIntentResponse createForGuest(OrderCriteria criteria) {
    // prep input for the requst for stripe
    Order order = OrderMapper.INSTANCE.toOrderEntityFromOrderCriteria(criteria);

    // set isGuest true
    order.setIsGuest(true);

    // assign address explicitly
    order.setBillingAddress(order.getShippingAddress());

    // create order details from orderDetailCriteria (mapping is not supported)
    this.assignOrderDetails(criteria, order);

    logger.info("size of order details");
    logger.info("" + order.getOrderDetails().size());

    // create order events
    try {
      this.orderEventService.add(order, OrderStatusEnum.DRAFT, "", (User)null);
    } catch (DomainException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }


    // finally, request to create payment intent
    PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder()
        .setReceiptEmail(order.getOrderEmail()).setCurrency(order.getCurrency())
        .setAmount(order.getTotalCost().longValue()).build();

    logger.info("total cost: ");
    logger.info("" + order.getTotalCost().toString());

    logger.info("debug create params for stripe: ");
    logger.info("" + createParams.getAmount());
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


    this.publisher.publishEvent(new OrderFinalConfirmedEvent(this, savedOrder, null, UserTypeEnum.ANONYMOUS));

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

  /**
   * add an order event by admin.
   **/
  @Override
  public OrderDTO addOrderEvent(UUID orderId, OrderEventCriteria criteria) {

    Order order = this.orderRepository.findById(orderId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist."));

    try {
      this.orderEventService.add(order, criteria.getOrderStatus(), criteria.getNote(), criteria.getUserId());
    } catch (DomainException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
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


    // set any transient property up. DON'T FOREGET TO CALL
    savedOrder.setUpCalculatedProperties();

    // publish event.
    this.publisher.publishEvent(new OrderEventWasAddedEvent(this, savedOrder));

    return OrderMapper.INSTANCE.toOrderDTO(savedOrder);
  }

  @Override
  public OrderDTO addOrderEventByMember(UUID orderId, OrderEventCriteria criteria) {

    Order targetOrder = this.orderRepository.findById(orderId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist."));

    // if return request, check the eligibility to refund
    // this only apply for members so if admin want to add either
    // 'return_request'/'cancel_request', he can do so by using 'careateOrderEvent'
    // service function above.
    if (criteria.getOrderStatus().equals(OrderStatusEnum.RETURN_REQUEST)) {
      LocalDateTime curDateTime = LocalDateTime.now();
      if (!targetOrder.isEligibleToRefund(curDateTime, this.orderRule.getEligibleDays())) {
        logger.info("sorry. this order is not eligible to return.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sorry. this order is not eligible to return.");
      }
    }

    try {
      this.orderEventService.add(targetOrder, criteria.getOrderStatus(), criteria.getNote(), criteria.getUserId());
    } catch (DomainException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    }

    Order savedOrder = this.orderRepository.save(targetOrder);
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


    // set any transient property up. DON'T FOREGET TO CALL
    savedOrder.setUpCalculatedProperties();

    // publish event.
    this.publisher.publishEvent(new OrderEventWasAddedByMemberEvent(this, savedOrder));

    return OrderMapper.INSTANCE.toOrderDTO(savedOrder);
  }

  /**
   * send a refund request to stripe api to refund the payment.
   *
   * make sure this is called when admin received the returned item from the
   * customer so that admin can safely refund the item.
   *
   * or if admin does not want to receive the return item any more, he can use
   * thsi endpoint right after he received the return request from the customer.
   *
   * also, RECEIVED_RETURN_REQUEST should be added before this function is called.
   *
   * flow:
   *  1. the customer requests for the return.
   *  2. the admin confirm and add 'RECEIVED_RETURN_REQUEST' order event at the management console.
   *  3. the admin 
   **/
  @Override
  public void refundOrderAfterShipment(UUID orderId) {

    /**
     * get target order
     * 
     **/
    Order order = this.orderRepository.findById(orderId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist."));

    /**
     * check eligibility
     *
     * - disable this in the case of if admin have to redund even if not eligible to
     * refund.
     *
     * - i guess admin can add any order event as long as it is included
     * 'nextAddableOrderEventForAdmin' so even if the member can not add
     * 'return_request', the admin can do so.
     *
     **/
    // LocalDateTime curDateTime = LocalDateTime.now();
    // if (!order.isEligibleToRefund(curDateTime, this.orderRule.getEligibleDays()))
    // {
    // logger.info("sorry, you are not eligible to refund for this order.");
    // throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
    // "sorry, you are not eligible to refund for this order.");
    // }

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

    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));
    try {
      this.orderEventService.add(order, OrderStatusEnum.RETURNED, "", admin);
    } catch (DomainException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
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


    /**
     * TODO: change this event name. this is misnomer. it should be 'ReturnedEvent'
     * or something
     **/
    this.publisher.publishEvent(new OrderReturnedEvent(this, savedOrder));

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
    Order order = this.orderRepository.findById(orderId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "the given order does not exist."));

    /**
     * check eligibility
     *
     **/
    //LocalDateTime curDateTime = LocalDateTime.now();
    //if (!order.isEligibleToRefund(curDateTime, this.orderRule.getEligibleDays())) {
    //  logger.info("sorry, you are not eligible to refund for this order.");
    //  throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
    //      "sorry, you are not eligible to refund for this order.");
    //}

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
    User admin = this.userRepository.getAdmin().orElseThrow(
        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));
    try {
      this.orderEventService.add(order, OrderStatusEnum.CANCELED, "", admin);
    } catch (DomainException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    } catch (NotFoundException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
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


    /**
     * TODO: change this event name. this is misnomer. it should be 'CanceledEvent'
     * or something
     **/
    this.publisher.publishEvent(new OrderCanceledEvent(this, savedOrder));

    /**
     * domain event handlers
     *
     * - handle cancelation of this shipment - handle stock back
     *
     **/
  }

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
