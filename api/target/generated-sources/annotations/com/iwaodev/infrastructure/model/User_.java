package com.iwaodev.infrastructure.model;

import com.iwaodev.domain.user.UserActiveEnum;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(User.class)
public abstract class User_ {

	public static volatile SingularAttribute<User, String> lastName;
	public static volatile ListAttribute<User, Address> addresses;
	public static volatile SingularAttribute<User, String> verificationToken;
	public static volatile ListAttribute<User, Phone> phones;
	public static volatile ListAttribute<User, WishlistItem> wishlistItems;
	public static volatile SingularAttribute<User, LocalDateTime> deletedAccountDate;
	public static volatile SingularAttribute<User, LocalDateTime> createdAt;
	public static volatile SingularAttribute<User, String> password;
	public static volatile ListAttribute<User, Company> companies;
	public static volatile SingularAttribute<User, Boolean> isDeleted;
	public static volatile ListAttribute<User, Review> reviews;
	public static volatile SingularAttribute<User, String> email;
	public static volatile SingularAttribute<User, LocalDateTime> verificationTokenExpiryDate;
	public static volatile SingularAttribute<User, LocalDateTime> updatedAt;
	public static volatile ListAttribute<User, OrderEvent> orderEvents;
	public static volatile SingularAttribute<User, LocalDateTime> forgotPasswordTokenExpiryDate;
	public static volatile SingularAttribute<User, UserActiveEnum> active;
	public static volatile SingularAttribute<User, String> deletedAccountReason;
	public static volatile SingularAttribute<User, UUID> userId;
	public static volatile SingularAttribute<User, String> avatarImagePath;
	public static volatile SingularAttribute<User, String> firstName;
	public static volatile SingularAttribute<User, String> forgotPasswordToken;
	public static volatile ListAttribute<User, Order> orders;
	public static volatile SingularAttribute<User, UserType> userType;
	public static volatile SingularAttribute<User, String> stripeCustomerId;
	public static volatile ListAttribute<User, CartItem> cartItems;

	public static final String LAST_NAME = "lastName";
	public static final String ADDRESSES = "addresses";
	public static final String VERIFICATION_TOKEN = "verificationToken";
	public static final String PHONES = "phones";
	public static final String WISHLIST_ITEMS = "wishlistItems";
	public static final String DELETED_ACCOUNT_DATE = "deletedAccountDate";
	public static final String CREATED_AT = "createdAt";
	public static final String PASSWORD = "password";
	public static final String COMPANIES = "companies";
	public static final String IS_DELETED = "isDeleted";
	public static final String REVIEWS = "reviews";
	public static final String EMAIL = "email";
	public static final String VERIFICATION_TOKEN_EXPIRY_DATE = "verificationTokenExpiryDate";
	public static final String UPDATED_AT = "updatedAt";
	public static final String ORDER_EVENTS = "orderEvents";
	public static final String FORGOT_PASSWORD_TOKEN_EXPIRY_DATE = "forgotPasswordTokenExpiryDate";
	public static final String ACTIVE = "active";
	public static final String DELETED_ACCOUNT_REASON = "deletedAccountReason";
	public static final String USER_ID = "userId";
	public static final String AVATAR_IMAGE_PATH = "avatarImagePath";
	public static final String FIRST_NAME = "firstName";
	public static final String FORGOT_PASSWORD_TOKEN = "forgotPasswordToken";
	public static final String ORDERS = "orders";
	public static final String USER_TYPE = "userType";
	public static final String STRIPE_CUSTOMER_ID = "stripeCustomerId";
	public static final String CART_ITEMS = "cartItems";

}

