package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(WishlistItem.class)
public abstract class WishlistItem_ {

	public static volatile SingularAttribute<WishlistItem, LocalDateTime> createdAt;
	public static volatile SingularAttribute<WishlistItem, Long> wishlistItemId;
	public static volatile SingularAttribute<WishlistItem, ProductVariant> variant;
	public static volatile SingularAttribute<WishlistItem, User> user;
	public static volatile SingularAttribute<WishlistItem, LocalDateTime> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String WISHLIST_ITEM_ID = "wishlistItemId";
	public static final String VARIANT = "variant";
	public static final String USER = "user";
	public static final String UPDATED_AT = "updatedAt";

}

