package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(OrderDetail.class)
public abstract class OrderDetail_ {

	public static volatile SingularAttribute<OrderDetail, LocalDateTime> createdAt;
	public static volatile SingularAttribute<OrderDetail, Integer> productQuantity;
	public static volatile SingularAttribute<OrderDetail, Product> product;
	public static volatile SingularAttribute<OrderDetail, ProductVariant> productVariant;
	public static volatile SingularAttribute<OrderDetail, String> productSize;
	public static volatile SingularAttribute<OrderDetail, String> productColor;
	public static volatile SingularAttribute<OrderDetail, BigDecimal> productUnitPrice;
	public static volatile SingularAttribute<OrderDetail, Long> orderDetailId;
	public static volatile SingularAttribute<OrderDetail, String> productName;
	public static volatile SingularAttribute<OrderDetail, Order> order;

	public static final String CREATED_AT = "createdAt";
	public static final String PRODUCT_QUANTITY = "productQuantity";
	public static final String PRODUCT = "product";
	public static final String PRODUCT_VARIANT = "productVariant";
	public static final String PRODUCT_SIZE = "productSize";
	public static final String PRODUCT_COLOR = "productColor";
	public static final String PRODUCT_UNIT_PRICE = "productUnitPrice";
	public static final String ORDER_DETAIL_ID = "orderDetailId";
	public static final String PRODUCT_NAME = "productName";
	public static final String ORDER = "order";

}

