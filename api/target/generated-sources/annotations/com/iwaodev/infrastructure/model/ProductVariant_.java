package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(ProductVariant.class)
public abstract class ProductVariant_ {

	public static volatile SingularAttribute<ProductVariant, String> note;
	public static volatile SingularAttribute<ProductVariant, Product> product;
	public static volatile SingularAttribute<ProductVariant, LocalDateTime> variantDiscountEndDate;
	public static volatile SingularAttribute<ProductVariant, Double> variantHeight;
	public static volatile SingularAttribute<ProductVariant, ProductSize> productSize;
	public static volatile SingularAttribute<ProductVariant, Boolean> isDiscount;
	public static volatile SingularAttribute<ProductVariant, Double> variantLength;
	public static volatile SingularAttribute<ProductVariant, LocalDateTime> variantDiscountStartDate;
	public static volatile ListAttribute<ProductVariant, WishlistItem> wishlistItems;
	public static volatile SingularAttribute<ProductVariant, Integer> soldCount;
	public static volatile SingularAttribute<ProductVariant, LocalDateTime> createdAt;
	public static volatile ListAttribute<ProductVariant, OrderDetail> orderDetails;
	public static volatile SingularAttribute<ProductVariant, BigDecimal> variantUnitPrice;
	public static volatile SingularAttribute<ProductVariant, BigDecimal> variantDiscountPrice;
	public static volatile SingularAttribute<ProductVariant, Integer> variantStock;
	public static volatile SingularAttribute<ProductVariant, Double> variantWeight;
	public static volatile SingularAttribute<ProductVariant, Long> variantId;
	public static volatile SingularAttribute<ProductVariant, String> variantColor;
	public static volatile ListAttribute<ProductVariant, CartItem> cartItems;
	public static volatile SingularAttribute<ProductVariant, Double> variantWidth;
	public static volatile SingularAttribute<ProductVariant, LocalDateTime> updatedAt;

	public static final String NOTE = "note";
	public static final String PRODUCT = "product";
	public static final String VARIANT_DISCOUNT_END_DATE = "variantDiscountEndDate";
	public static final String VARIANT_HEIGHT = "variantHeight";
	public static final String PRODUCT_SIZE = "productSize";
	public static final String IS_DISCOUNT = "isDiscount";
	public static final String VARIANT_LENGTH = "variantLength";
	public static final String VARIANT_DISCOUNT_START_DATE = "variantDiscountStartDate";
	public static final String WISHLIST_ITEMS = "wishlistItems";
	public static final String SOLD_COUNT = "soldCount";
	public static final String CREATED_AT = "createdAt";
	public static final String ORDER_DETAILS = "orderDetails";
	public static final String VARIANT_UNIT_PRICE = "variantUnitPrice";
	public static final String VARIANT_DISCOUNT_PRICE = "variantDiscountPrice";
	public static final String VARIANT_STOCK = "variantStock";
	public static final String VARIANT_WEIGHT = "variantWeight";
	public static final String VARIANT_ID = "variantId";
	public static final String VARIANT_COLOR = "variantColor";
	public static final String CART_ITEMS = "cartItems";
	public static final String VARIANT_WIDTH = "variantWidth";
	public static final String UPDATED_AT = "updatedAt";

}

