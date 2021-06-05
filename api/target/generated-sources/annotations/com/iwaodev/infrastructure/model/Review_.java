package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Review.class)
public abstract class Review_ {

	public static volatile SingularAttribute<Review, Double> reviewPoint;
	public static volatile SingularAttribute<Review, String> note;
	public static volatile SingularAttribute<Review, LocalDateTime> createdAt;
	public static volatile SingularAttribute<Review, Product> product;
	public static volatile SingularAttribute<Review, String> reviewDescription;
	public static volatile SingularAttribute<Review, Boolean> isVerified;
	public static volatile SingularAttribute<Review, Long> reviewId;
	public static volatile SingularAttribute<Review, User> user;
	public static volatile SingularAttribute<Review, String> reviewTitle;
	public static volatile SingularAttribute<Review, LocalDateTime> updatedAt;

	public static final String REVIEW_POINT = "reviewPoint";
	public static final String NOTE = "note";
	public static final String CREATED_AT = "createdAt";
	public static final String PRODUCT = "product";
	public static final String REVIEW_DESCRIPTION = "reviewDescription";
	public static final String IS_VERIFIED = "isVerified";
	public static final String REVIEW_ID = "reviewId";
	public static final String USER = "user";
	public static final String REVIEW_TITLE = "reviewTitle";
	public static final String UPDATED_AT = "updatedAt";

}

