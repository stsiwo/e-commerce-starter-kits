package com.iwaodev.infrastructure.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Product.class)
public abstract class Product_ {

	public static volatile SingularAttribute<Product, String> productPath;
	public static volatile SingularAttribute<Product, BigDecimal> highestPrice;
	public static volatile SingularAttribute<Product, String> note;
	public static volatile SingularAttribute<Product, LocalDateTime> productBaseDiscountEndDate;
	public static volatile SingularAttribute<Product, UUID> productId;
	public static volatile SingularAttribute<Product, LocalDateTime> releaseDate;
	public static volatile SingularAttribute<Product, Boolean> isDiscount;
	public static volatile ListAttribute<Product, ProductVariant> variants;
	public static volatile SingularAttribute<Product, Boolean> isDiscountAvailable;
	public static volatile SingularAttribute<Product, String> productName;
	public static volatile SingularAttribute<Product, LocalDateTime> createdAt;
	public static volatile ListAttribute<Product, OrderDetail> orderDetails;
	public static volatile ListAttribute<Product, ProductImage> productImages;
	public static volatile SingularAttribute<Product, BigDecimal> productBaseUnitPrice;
	public static volatile SingularAttribute<Product, Double> averageReviewPoint;
	public static volatile ListAttribute<Product, Review> reviews;
	public static volatile SingularAttribute<Product, BigDecimal> cheapestPrice;
	public static volatile SingularAttribute<Product, Boolean> isPublic;
	public static volatile SingularAttribute<Product, Category> category;
	public static volatile SingularAttribute<Product, String> productDescription;
	public static volatile SingularAttribute<Product, LocalDateTime> productBaseDiscountStartDate;
	public static volatile SingularAttribute<Product, BigDecimal> productBaseDiscountPrice;
	public static volatile SingularAttribute<Product, LocalDateTime> updatedAt;

	public static final String PRODUCT_PATH = "productPath";
	public static final String HIGHEST_PRICE = "highestPrice";
	public static final String NOTE = "note";
	public static final String PRODUCT_BASE_DISCOUNT_END_DATE = "productBaseDiscountEndDate";
	public static final String PRODUCT_ID = "productId";
	public static final String RELEASE_DATE = "releaseDate";
	public static final String IS_DISCOUNT = "isDiscount";
	public static final String VARIANTS = "variants";
	public static final String IS_DISCOUNT_AVAILABLE = "isDiscountAvailable";
	public static final String PRODUCT_NAME = "productName";
	public static final String CREATED_AT = "createdAt";
	public static final String ORDER_DETAILS = "orderDetails";
	public static final String PRODUCT_IMAGES = "productImages";
	public static final String PRODUCT_BASE_UNIT_PRICE = "productBaseUnitPrice";
	public static final String AVERAGE_REVIEW_POINT = "averageReviewPoint";
	public static final String REVIEWS = "reviews";
	public static final String CHEAPEST_PRICE = "cheapestPrice";
	public static final String IS_PUBLIC = "isPublic";
	public static final String CATEGORY = "category";
	public static final String PRODUCT_DESCRIPTION = "productDescription";
	public static final String PRODUCT_BASE_DISCOUNT_START_DATE = "productBaseDiscountStartDate";
	public static final String PRODUCT_BASE_DISCOUNT_PRICE = "productBaseDiscountPrice";
	public static final String UPDATED_AT = "updatedAt";

}

