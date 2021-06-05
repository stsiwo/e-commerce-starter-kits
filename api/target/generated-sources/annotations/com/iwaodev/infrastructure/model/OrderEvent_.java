package com.iwaodev.infrastructure.model;

import com.iwaodev.domain.order.OrderStatusEnum;
import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(OrderEvent.class)
public abstract class OrderEvent_ {

	public static volatile SingularAttribute<OrderEvent, String> note;
	public static volatile SingularAttribute<OrderEvent, LocalDateTime> createdAt;
	public static volatile SingularAttribute<OrderEvent, Long> orderEventId;
	public static volatile SingularAttribute<OrderEvent, OrderStatusEnum> orderStatus;
	public static volatile SingularAttribute<OrderEvent, Boolean> undoable;
	public static volatile SingularAttribute<OrderEvent, User> user;
	public static volatile SingularAttribute<OrderEvent, Order> order;

	public static final String NOTE = "note";
	public static final String CREATED_AT = "createdAt";
	public static final String ORDER_EVENT_ID = "orderEventId";
	public static final String ORDER_STATUS = "orderStatus";
	public static final String UNDOABLE = "undoable";
	public static final String USER = "user";
	public static final String ORDER = "order";

}

