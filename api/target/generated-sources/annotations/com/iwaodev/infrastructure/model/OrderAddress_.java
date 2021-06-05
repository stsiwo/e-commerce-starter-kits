package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(OrderAddress.class)
public abstract class OrderAddress_ {

	public static volatile SingularAttribute<OrderAddress, Order> billingOrder;
	public static volatile SingularAttribute<OrderAddress, String> country;
	public static volatile SingularAttribute<OrderAddress, LocalDateTime> createdAt;
	public static volatile SingularAttribute<OrderAddress, Order> shippingOrder;
	public static volatile SingularAttribute<OrderAddress, String> province;
	public static volatile SingularAttribute<OrderAddress, String> address2;
	public static volatile SingularAttribute<OrderAddress, String> city;
	public static volatile SingularAttribute<OrderAddress, String> address1;
	public static volatile SingularAttribute<OrderAddress, String> postalCode;
	public static volatile SingularAttribute<OrderAddress, String> orderAddressId;
	public static volatile SingularAttribute<OrderAddress, LocalDateTime> updatedAt;

	public static final String BILLING_ORDER = "billingOrder";
	public static final String COUNTRY = "country";
	public static final String CREATED_AT = "createdAt";
	public static final String SHIPPING_ORDER = "shippingOrder";
	public static final String PROVINCE = "province";
	public static final String ADDRESS2 = "address2";
	public static final String CITY = "city";
	public static final String ADDRESS1 = "address1";
	public static final String POSTAL_CODE = "postalCode";
	public static final String ORDER_ADDRESS_ID = "orderAddressId";
	public static final String UPDATED_AT = "updatedAt";

}

