package com.iwaodev.application.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.shipping.RatingDTO;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.OrderService;
import com.iwaodev.application.iservice.PaymentService;
import com.iwaodev.application.iservice.ShippingService;
import com.iwaodev.application.mapper.OrderMapper;
import com.iwaodev.application.specification.factory.OrderSpecificationFactory;
import com.iwaodev.domain.order.OrderRule;
import com.iwaodev.domain.order.OrderSortEnum;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.domain.order.event.OrderEventWasAddedByMemberEvent;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.domain.order.event.OrderFinalConfirmedEvent;
import com.iwaodev.domain.service.OrderEventService;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.AppException;
import com.iwaodev.exception.DomainException;
import com.iwaodev.exception.ExceptionMessenger;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.*;
import com.iwaodev.ui.criteria.order.OrderCriteria;
import com.iwaodev.ui.criteria.order.OrderDetailCriteria;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import com.iwaodev.ui.criteria.order.OrderQueryStringCriteria;
import com.iwaodev.ui.response.PaymentIntentResponse;
import com.iwaodev.util.Util;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;

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

    @Autowired
    private ShippingService shippingService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Override
    public Page<OrderDTO> getAll(OrderQueryStringCriteria criteria, Integer page, Integer limit, OrderSortEnum sort) throws Exception {
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
                                         OrderSortEnum sort) throws Exception {

        Optional<User> targetEntityOption = this.userRepository.findById(userId);

        if (!targetEntityOption.isPresent()) {
            logger.debug("the given user does not exist");
            throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
        }

        // assign the id to criteria
        criteria.setUserId(userId);

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

    private Sort getSort(OrderSortEnum sortEnum) {

        if (sortEnum == OrderSortEnum.DATE_DESC) {
            return Sort.by("createdAt").descending();
        } else {
            return Sort.by("createdAt").ascending();
        }
    }

    @Override
    public OrderDTO getByIdAndUserId(UUID orderId, UUID userId) throws Exception {

        Order order = this.orderRepository.findByOrderIdAndUserId(orderId, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given order does not exist."));

        order.setUpCalculatedProperties();
        return OrderMapper.INSTANCE.toOrderDTO(order);
    }

    @Override
    public OrderDTO getById(UUID orderId) throws Exception {

        // get result with repository
        // and map entity to dto with MapStruct
        Optional<Order> targetEntityOption = this.orderRepository.findById(orderId);

        if (!targetEntityOption.isPresent()) {
            logger.debug("the given order does not exist");
            throw new AppException(HttpStatus.NOT_FOUND, "the given order does not exist.");
        }

        Order order = targetEntityOption.get();

        order.setUpCalculatedProperties();
        return OrderMapper.INSTANCE.toOrderDTO(order);
    }

    /**
     * create a new order for member users
     **/
    @Override
    public PaymentIntentResponse createForMember(OrderCriteria criteria, UUID authUserId) throws Exception {

        // prep input for the requst for stripe
        Order order = OrderMapper.INSTANCE.toOrderEntityFromOrderCriteria(criteria);

        // issue-


        // find user
        User customer = this.userRepository.findById(authUserId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND,
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
                logger.debug(e.getMessage());
                throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "encountered errors during creating stripe customer. please try again.");
            }
        }

        // create order details from orderDetailCriteria (mapping is not supported)
        this.assignOrderDetails(criteria, order);

        /**
         * get shipping cost by send an api request
         **/
        RatingDTO ratingDTO = this.shippingService.getRating(order.getTotalWeight(), order.getShippingAddress().getPostalCode());
        order.setShippingCost(ratingDTO.getEstimatedShippingCost());
        order.setEstimatedDeliveryDate(ratingDTO.getExpectedDeliveryDate());

        // create order events
        try {
            this.orderEventService.addByProgram(order, OrderStatusEnum.DRAFT, "", customer);
        } catch (DomainException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (NotFoundException e) {
            throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
        }

        // finally, request to create payment intent
        PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder().setCustomer(stripeCustomerId)
                .setSetupFutureUsage(PaymentIntentCreateParams.SetupFutureUsage.ON_SESSION)
                .setReceiptEmail(order.getOrderEmail()).setCurrency(order.getCurrency())
                .setAmount(order.getTotalCostForStripe()).build();

        PaymentIntent intent;

        try {
            intent = PaymentIntent.create(createParams);

        } catch (StripeException e) {
            logger.debug(e.getMessage());
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "encountered errors during creating stripe payment intent. please try again.");
        }

        // assign payment intent id to this order
        order.setStripePaymentIntentId(intent.getId());

        Order savedOrder;
        try {
            //issue-d8VmQM3FMFY
            //issue-XVJzi6CftR
            savedOrder = this.orderRepository.persist(order);
            this.orderRepository.flush();
        } catch (OptimisticLockingFailureException ex) {
            throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
        }

        this.publisher.publishEvent(new OrderFinalConfirmedEvent(this, savedOrder, stripeCustomerId, UserTypeEnum.MEMBER));

        // set any transient property up. DON'T FOREGET TO CALL
        savedOrder.setUpCalculatedProperties();

        return new PaymentIntentResponse(intent.getClientSecret(), OrderMapper.INSTANCE.toOrderDTO(savedOrder));
    }

    @Override
    public PaymentIntentResponse createForGuest(OrderCriteria criteria) throws Exception {
        // prep input for the requst for stripe
        Order order = OrderMapper.INSTANCE.toOrderEntityFromOrderCriteria(criteria);

        // set isGuest true
        order.setIsGuest(true);

        // assign address explicitly
        order.setBillingAddress(order.getShippingAddress());

        // create order details from orderDetailCriteria (mapping is not supported)
        this.assignOrderDetails(criteria, order);

        /**
         * get shipping cost by send an api request
         **/
        RatingDTO ratingDTO = this.shippingService.getRating(order.getTotalWeight(), order.getShippingAddress().getPostalCode());
        order.setShippingCost(ratingDTO.getEstimatedShippingCost());
        order.setEstimatedDeliveryDate(ratingDTO.getExpectedDeliveryDate());

        // create order events
        try {
            this.orderEventService.addByProgram(order, OrderStatusEnum.DRAFT, "", (User) null);
        } catch (DomainException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (NotFoundException e) {
            throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
        }

        // finally, request to create payment intent
        PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder()
                .setReceiptEmail(order.getOrderEmail()).setCurrency(order.getCurrency())
                .setAmount(order.getTotalCostForStripe()).build();

        PaymentIntent intent;

        try {
            intent = PaymentIntent.create(createParams);

        } catch (StripeException e) {
            logger.debug(e.getMessage());
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "encountered errors during creating stripe payment intent. please try again.");
        }

        // assign payment intent id to this order
        order.setStripePaymentIntentId(intent.getId());

        Order savedOrder;
        try {
            // issue-d8VmQM3FMFY
            // issue-XVJzi6CftR
            savedOrder = this.orderRepository.persist(order);
            this.orderRepository.flush();
        } catch (OptimisticLockingFailureException ex) {
            throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
        }

        this.publisher.publishEvent(new OrderFinalConfirmedEvent(this, savedOrder, null, UserTypeEnum.ANONYMOUS));

        // set any transient property up. DON'T FOREGET TO CALL
        savedOrder.setUpCalculatedProperties();

        return new PaymentIntentResponse(intent.getClientSecret(), OrderMapper.INSTANCE.toOrderDTO(savedOrder));
    }

    public void assignOrderDetails(OrderCriteria criteria, Order order) throws Exception {

        /**
         * avoid n+1 problem (e.g., sql inside for loop like below).
         *
         **/
        List<UUID> productIds = criteria.getOrderDetails().stream().map(orderDetail -> orderDetail.getProductId())
                .collect(Collectors.toList());

        logger.debug("" + productIds.toString());

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
            // .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND,
            // this.exceptionMessenger.getNotFoundMessage("product",
            // orderDetailCriteria.getProductId().toString())));

            Product product = products.getOrDefault(orderDetailCriteria.getProductId(), null);

            if (product == null) {
                throw new AppException(HttpStatus.NOT_FOUND,
                        this.exceptionMessenger.getNotFoundMessage("product", orderDetailCriteria.getProductId().toString()));
            }

            try {

                OrderDetail orderDetail = new OrderDetail(orderDetailCriteria.getProductQuantity(),
                        product.getCurrentPriceOfVariant(orderDetailCriteria.getProductVariantId()),
                        product.getColorOfVariant(orderDetailCriteria.getProductVariantId()),
                        product.getSizeOfVariant(orderDetailCriteria.getProductVariantId()), product.getProductName(),
                        product.findVariantById(orderDetailCriteria.getProductVariantId()), product, order);

                // set product weight
                orderDetail.setProductWeight(product.findVariantById(orderDetailCriteria.getProductVariantId()).getVariantWeight(), orderDetailCriteria.getProductQuantity());

                order.addOrderDetail(orderDetail);
            } catch (NotFoundException e) {
                throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
            }
        }
    }

    @Override
    public OrderDTO addSessionTimeoutOrderEvent(UUID orderId, String orderNumber, UUID userId) throws Exception {

        Order order = this.orderRepository.findByOrderIdAndOrderNumber(orderId, orderNumber)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given order does not exist."));

        // version check for concurrency update
        String receivedVersion = this.httpServletRequest.getHeader("If-Match");
        if (receivedVersion == null || receivedVersion.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
        }
        if (!Util.checkETagVersion(order.getVersion(), receivedVersion)) {
            throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
        };

        User customer = null;
        if (userId != null) {
            customer = this.userRepository.findById(userId).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given user does not exist."));
        }

        try {
            this.orderEventService.addByProgram(order, OrderStatusEnum.SESSION_TIMEOUT, "", customer);
        } catch (NotFoundException e) {
            new AppException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (DomainException e) {
            new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        Order savedOrder;
        try {
            // issue-XVJzi6CftR
            // don't forget flush otherwise version number is updated.
            savedOrder = this.orderRepository.saveAndFlush(order);
        } catch (OptimisticLockingFailureException ex) {
            throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
        }

        savedOrder.setUpCalculatedProperties();
        return OrderMapper.INSTANCE.toOrderDTO(savedOrder);
    }

    /**
     * add an order event by admin.
     **/
    @Override
    public OrderDTO addOrderEventByAdmin(UUID orderId, OrderEventCriteria criteria) throws Exception {

        Order order = this.orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given order does not exist."));

        // version check for concurrency update
        String receivedVersion = this.httpServletRequest.getHeader("If-Match");
        if (receivedVersion == null || receivedVersion.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
        }
        if (!Util.checkETagVersion(order.getVersion(), receivedVersion)) {
            throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
        };

        User admin = this.userRepository.getAdmin().orElseThrow(() -> new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "the admin not found. this should not happen."));

        try {
            this.orderEventService.addByAdmin(order, criteria.getOrderStatus(), criteria.getNote(), admin);
        } catch (DomainException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (NotFoundException e) {
            throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
        }

        Order savedOrder;
        try {
            // issue-XVJzi6CftR
            savedOrder = this.orderRepository.saveAndFlush(order);
        } catch (OptimisticLockingFailureException ex) {
            throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
        }

        // set any transient property up. DON'T FOREGET TO CALL
        savedOrder.setUpCalculatedProperties();
        // publish event.
        this.publisher.publishEvent(new OrderEventWasAddedEvent(this, savedOrder));

        return OrderMapper.INSTANCE.toOrderDTO(savedOrder);
    }

    @Override
    public OrderDTO addOrderEventByMember(UUID orderId, OrderEventCriteria criteria) throws Exception {

        Order targetOrder = this.orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given order does not exist."));

        // version check for concurrency update
        String receivedVersion = this.httpServletRequest.getHeader("If-Match");
        if (receivedVersion == null || receivedVersion.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
        }
        if (!Util.checkETagVersion(targetOrder.getVersion(), receivedVersion)) {
            throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
        };

        User member = this.userRepository.findById(criteria.getUserId()).orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "the given user does not exist."));

        /**
         * this need validation when add order event (e.g., addByCustomer)
         */

        try {
            this.orderEventService.addByCustomer(targetOrder, criteria.getOrderStatus(), criteria.getNote(), member);
        } catch (DomainException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (NotFoundException e) {
            throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
        }
        Order savedOrder;
        try {
            // issue-XVJzi6CftR
            savedOrder = this.orderRepository.save(targetOrder);
            this.orderRepository.flush();
        } catch (OptimisticLockingFailureException ex) {
            throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
        }
        // set any transient property up. DON'T FOREGET TO CALL
        savedOrder.setUpCalculatedProperties();
        // publish event.
        this.publisher.publishEvent(new OrderEventWasAddedByMemberEvent(this, savedOrder));

        return OrderMapper.INSTANCE.toOrderDTO(savedOrder);
    }

    /**
     * send a refund request to stripe api to refund the payment.
     * <p>
     * make sure this is called when admin received the returned item from the
     * customer so that admin can safely refund the item.
     * <p>
     * or if admin does not want to receive the return item any more, he can use
     * thsi endpoint right after he received the return request from the customer.
     * <p>
     * also, RECEIVED_RETURN_REQUEST should be added before this function is called.
     * <p>
     * flow: 1. the customer requests for the return. 2. the admin confirm and add
     * 'RECEIVED_RETURN_REQUEST' order event at the management console. 3. the admin
     **/
    //@Override
    //public void refundOrderAfterShipment(UUID orderId) throws Exception {

    //  /**
    //   * get target order
    //   *
    //   **/
    //  Order order = this.orderRepository.findById(orderId)
    //      .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given order does not exist."));

    //  /**
    //   * check eligibility
    //   *
    //   * - disable this in the case of if admin have to redund even if not eligible to
    //   * refund.
    //   *
    //   * - i guess admin can add any order event as long as it is included
    //   * 'nextAddableOrderEventForAdmin' so even if the member can not add
    //   * 'return_request', the admin can do so.
    //   *
    //   **/
    //  // LocalDateTime curDateTime = LocalDateTime.now();
    //  // if (!order.isEligibleToRefund(curDateTime, this.orderRule.getEligibleDays()))
    //  // {
    //  // logger.debug("sorry, you are not eligible to refund for this order.");
    //  // throw new AppException(HttpStatus.BAD_REQUEST,
    //  // "sorry, you are not eligible to refund for this order.");
    //  // }

    //  /**
    //   * prep refund request to stripe
    //   *
    //   * - get paymentIntentId from the order
    //   **/
    //  String paymentIntentId = order.getStripePaymentIntentId();

    //  /**
    //   * send refund request to Stripe
    //   *
    //   * - error handling esp when failed to refund
    //   **/
    //  try {
    //    this.paymentService.requestRefund(paymentIntentId);
    //  } catch (StripeException e) {
    //    logger.debug(e.getMessage());
    //    throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    //  }

    //  /**
    //   * add an order event (e.g., refund)
    //   *
    //   * - use RETURNED since the shipment already made.
    //   **/

    //  User admin = this.userRepository.getAdmin().orElseThrow(
    //      () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));
    //  try {
    //    this.orderEventService.add(order, OrderStatusEnum.RETURNED, "", admin);
    //  } catch (DomainException e) {
    //    throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
    //  } catch (NotFoundException e) {
    //    throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    //  }

    //  Order savedOrder = this.orderRepository.save(order);
    //  /**
    //   * bug.
    //   *
    //   * hibernate return the same child entity twice in child list. e.g, orderEvents:
    //   * [ { 101 } , { 102 }, { 102 } ] <- 102 is duplicate.
    //   *
    //   * workaround: use 'flush'.
    //   *
    //   * otherwise, you might got an error 'object references an unsaved transient
    //   * instance – save the transient instance beforeQuery flushing'.
    //   *
    //   * - this is because hibernate recognize that the entity change its state again
    //   * by calling 'parent.getChildren().size()' wihtout flushing, so be careful!!!!
    //   *
    //   * ref:
    //   * https://stackoverflow.com/questions/7903800/hibernate-inserts-duplicates-into-a-onetomany-collection
    //   *
    //   **/
    //  this.orderRepository.flush();

    //  this.publisher.publishEvent(new OrderReturnedEvent(this, savedOrder));

    //  /**
    //   * domain event.
    //   *
    //   * - handle shipment logic (e.g., get return label for the order).
    //   *
    //   * * Don't complete (RETURNED) here. once the admin makes sure that the item is
    //   * returned, get the stock back and add RETURNED order event.
    //   *
    //   **/

    //}

    //@Override
    //public void refundBeforeShipment(UUID orderId) throws Exception {

    //  /**
    //   * get target order
    //   *
    //   **/
    //  Order order = this.orderRepository.findById(orderId)
    //      .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "the given order does not exist."));

    //  /**
    //   * check eligibility
    //   *
    //   **/
    //  // LocalDateTime curDateTime = LocalDateTime.now();
    //  // if (!order.isEligibleToRefund(curDateTime, this.orderRule.getEligibleDays()))
    //  // {
    //  // logger.debug("sorry, you are not eligible to refund for this order.");
    //  // throw new AppException(HttpStatus.BAD_REQUEST,
    //  // "sorry, you are not eligible to refund for this order.");
    //  // }

    //  /**
    //   * prep refund request to stripe
    //   *
    //   * - get paymentIntentId from the order
    //   **/
    //  String paymentIntentId = order.getStripePaymentIntentId();

    //  /**
    //   * send refund request to Stripe
    //   *
    //   * - error handling esp when failed to refund
    //   **/
    //  try {
    //    this.paymentService.requestRefund(paymentIntentId);
    //  } catch (StripeException e) {
    //    logger.debug(e.getMessage());
    //    throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    //  }

    //  /**
    //   * add an order event (e.g., refund)
    //   *
    //   * - use CANCELED since there is no involvement with customer
    //   **/
    //  User admin = this.userRepository.getAdmin().orElseThrow(
    //      () -> new AppException(HttpStatus.NOT_FOUND, "admin not found. this should not happen."));
    //  try {
    //    this.orderEventService.add(order, OrderStatusEnum.CANCELED, "", admin);
    //  } catch (DomainException e) {
    //    throw new AppException(HttpStatus.BAD_REQUEST, e.getMessage());
    //  } catch (NotFoundException e) {
    //    throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
    //  }

    //  Order savedOrder = this.orderRepository.save(order);
    //  /**
    //   * bug.
    //   *
    //   * hibernate return the same child entity twice in child list. e.g, orderEvents:
    //   * [ { 101 } , { 102 }, { 102 } ] <- 102 is duplicate.
    //   *
    //   * workaround: use 'flush'.
    //   *
    //   * otherwise, you might got an error 'object references an unsaved transient
    //   * instance – save the transient instance beforeQuery flushing'.
    //   *
    //   * - this is because hibernate recognize that the entity change its state again
    //   * by calling 'parent.getChildren().size()' wihtout flushing, so be careful!!!!
    //   *
    //   * ref:
    //   * https://stackoverflow.com/questions/7903800/hibernate-inserts-duplicates-into-a-onetomany-collection
    //   *
    //   **/
    //  this.orderRepository.flush();

    //  this.publisher.publishEvent(new OrderCanceledEvent(this, savedOrder));

    //  /**
    //   * domain event handlers
    //   *
    //   * - handle cancelation of this shipment - handle stock back
    //   *
    //   **/
    //}
    @Override
    public void testEvent() throws Exception {
        Order order = new Order();
        order.raiseTestEvent();
    }

    @Override
    public OrderDTO deleteOrderEvent(UUID orderId, Long orderEventId) throws Exception {

        /**
         * get target order
         *
         **/
        Optional<Order> orderOption = this.orderRepository.findById(orderId);

        if (!orderOption.isPresent()) {
            // user not found so return error
            logger.debug("the target order does not exist");
            throw new AppException(HttpStatus.NOT_FOUND, "the given order does not exist.");
        }

        Order order = orderOption.get();

        // version check for concurrency update
        String receivedVersion = this.httpServletRequest.getHeader("If-Match");
        if (receivedVersion == null || receivedVersion.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
        }
        if (!Util.checkETagVersion(order.getVersion(), receivedVersion)) {
            throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
        };

        OrderEvent lastOrderEvent = order.retrieveLatestOrderEvent();

        if (!orderEventId.equals(lastOrderEvent.getOrderEventId())) {
            logger.debug("only latest order event is deletable");
            throw new AppException(HttpStatus.BAD_REQUEST, "only latest order event is deletable");
        }

        if (!lastOrderEvent.getUndoable()) {
            logger.debug("this event is not deletable.");
            throw new AppException(HttpStatus.BAD_REQUEST, "this event is not deletable.");
        }

        order.removeOrderEvent(lastOrderEvent);

        /**
         * update transaction result after deleting the latest order event
         */
        order.updateTransactionResult();

        Order savedOrder;
        try {
            savedOrder = this.orderRepository.save(order);
            this.orderRepository.flush();
        } catch (OptimisticLockingFailureException ex) {
            throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
        }
        // set any transient property up.
        savedOrder.setUpCalculatedProperties();

        return OrderMapper.INSTANCE.toOrderDTO(savedOrder);

    }

    @Override
    public OrderDTO updateOrderEvent(UUID orderId, Long orderEventId, OrderEventCriteria criteria) throws Exception {

        /**
         * get target order
         *
         **/
        Optional<Order> orderOption = this.orderRepository.findById(orderId);

        if (!orderOption.isPresent()) {
            // user not found so return error
            logger.debug("the target order does not exist");
            throw new AppException(HttpStatus.NOT_FOUND, "the given order does not exist.");
        }

        Order order = orderOption.get();

        // version check for concurrency update
        String receivedVersion = this.httpServletRequest.getHeader("If-Match");

        logger.debug("cur version: " + order.getVersion());
        logger.debug("rec version: " + receivedVersion);

        if (receivedVersion == null || receivedVersion.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
        }
        logger.debug("" + Util.checkETagVersion(order.getVersion(), receivedVersion));
        if (!Util.checkETagVersion(order.getVersion(), receivedVersion)) {
            throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
        };

        logger.debug("after version check");

        order.updateOrderEvent(orderEventId, criteria);
        order.bumpUpVersion();
        Order savedOrder;
        try {
            // issue-XVJzi6CftR
            // don't forget flush otherwise version number is updated.
            savedOrder = this.orderRepository.saveAndFlush(order);
        } catch (OptimisticLockingFailureException ex) {
            throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
        }

        return OrderMapper.INSTANCE.toOrderDTO(savedOrder);
    }
}
