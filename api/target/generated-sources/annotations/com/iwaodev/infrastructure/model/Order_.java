package com.iwaodev.infrastructure.model;

import com.iwaodev.domain.order.OrderStatusEnum;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Order.class)
public abstract class Order_ {

	public static volatile SingularAttribute<Order, String> note;
	public static volatile SingularAttribute<Order, String> orderNumber;
	public static volatile SingularAttribute<Order, UUID> orderId;
	public static volatile SingularAttribute<Order, String> orderEmail;
	public static volatile SingularAttribute<Order, BigDecimal> taxCost;
	public static volatile SingularAttribute<Order, LocalDateTime> createdAt;
	public static volatile SingularAttribute<Order, BigDecimal> productCost;
	public static volatile SingularAttribute<Order, LocalDateTime> authReturnUrl;
	public static volatile SingularAttribute<Order, LocalDateTime> shipmentOriginalResponse;
	public static volatile SingularAttribute<Order, String> currency;
	public static volatile SingularAttribute<Order, String> orderFirstName;
	public static volatile SingularAttribute<Order, String> stripePaymentIntentId;
	public static volatile SingularAttribute<Order, LocalDateTime> updatedAt;
	public static volatile SingularAttribute<Order, String> orderLastName;
	public static volatile SingularAttribute<Order, LocalDateTime> authReturnOriginalResponse;
	public static volatile SingularAttribute<Order, BigDecimal> shippingCost;
	public static volatile SingularAttribute<Order, String> trackingPin;
	public static volatile ListAttribute<Order, OrderEvent> orderEvents;
	public static volatile SingularAttribute<Order, LocalDateTime> authReturnExpiryDate;
	public static volatile SingularAttribute<Order, String> refundLink;
	public static volatile ListAttribute<Order, OrderDetail> orderDetails;
	public static volatile SingularAttribute<Order, String> shipmentId;
	public static volatile SingularAttribute<Order, OrderStatusEnum> latestOrderEventStatus;
	public static volatile SingularAttribute<Order, OrderAddress> shippingAddress;
	public static volatile SingularAttribute<Order, OrderAddress> billingAddress;
	public static volatile SingularAttribute<Order, String> orderPhone;
	public static volatile SingularAttribute<Order, User> user;
	public static volatile SingularAttribute<Order, String> authReturnTrackingPin;

	public static final String NOTE = "note";
	public static final String ORDER_NUMBER = "orderNumber";
	public static final String ORDER_ID = "orderId";
	public static final String ORDER_EMAIL = "orderEmail";
	public static final String TAX_COST = "taxCost";
	public static final String CREATED_AT = "createdAt";
	public static final String PRODUCT_COST = "productCost";
	public static final String AUTH_RETURN_URL = "authReturnUrl";
	public static final String SHIPMENT_ORIGINAL_RESPONSE = "shipmentOriginalResponse";
	public static final String CURRENCY = "currency";
	public static final String ORDER_FIRST_NAME = "orderFirstName";
	public static final String STRIPE_PAYMENT_INTENT_ID = "stripePaymentIntentId";
	public static final String UPDATED_AT = "updatedAt";
	public static final String ORDER_LAST_NAME = "orderLastName";
	public static final String AUTH_RETURN_ORIGINAL_RESPONSE = "authReturnOriginalResponse";
	public static final String SHIPPING_COST = "shippingCost";
	public static final String TRACKING_PIN = "trackingPin";
	public static final String ORDER_EVENTS = "orderEvents";
	public static final String AUTH_RETURN_EXPIRY_DATE = "authReturnExpiryDate";
	public static final String REFUND_LINK = "refundLink";
	public static final String ORDER_DETAILS = "orderDetails";
	public static final String SHIPMENT_ID = "shipmentId";
	public static final String LATEST_ORDER_EVENT_STATUS = "latestOrderEventStatus";
	public static final String SHIPPING_ADDRESS = "shippingAddress";
	public static final String BILLING_ADDRESS = "billingAddress";
	public static final String ORDER_PHONE = "orderPhone";
	public static final String USER = "user";
	public static final String AUTH_RETURN_TRACKING_PIN = "authReturnTrackingPin";

}

