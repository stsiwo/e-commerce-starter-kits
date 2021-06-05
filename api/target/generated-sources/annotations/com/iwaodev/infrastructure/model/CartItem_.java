package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(CartItem.class)
public abstract class CartItem_ {

	public static volatile SingularAttribute<CartItem, LocalDateTime> createdAt;
	public static volatile SingularAttribute<CartItem, Integer> quantity;
	public static volatile SingularAttribute<CartItem, ProductVariant> variant;
	public static volatile SingularAttribute<CartItem, Boolean> isSelected;
	public static volatile SingularAttribute<CartItem, User> user;
	public static volatile SingularAttribute<CartItem, Long> cartItemId;
	public static volatile SingularAttribute<CartItem, LocalDateTime> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String QUANTITY = "quantity";
	public static final String VARIANT = "variant";
	public static final String IS_SELECTED = "isSelected";
	public static final String USER = "user";
	public static final String CART_ITEM_ID = "cartItemId";
	public static final String UPDATED_AT = "updatedAt";

}

