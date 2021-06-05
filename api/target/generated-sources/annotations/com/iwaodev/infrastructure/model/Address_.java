package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Address.class)
public abstract class Address_ {

	public static volatile SingularAttribute<Address, String> country;
	public static volatile SingularAttribute<Address, LocalDateTime> createdAt;
	public static volatile SingularAttribute<Address, String> province;
	public static volatile SingularAttribute<Address, String> address2;
	public static volatile SingularAttribute<Address, String> city;
	public static volatile SingularAttribute<Address, String> address1;
	public static volatile SingularAttribute<Address, String> postalCode;
	public static volatile SingularAttribute<Address, Boolean> isShippingAddress;
	public static volatile SingularAttribute<Address, User> user;
	public static volatile SingularAttribute<Address, Boolean> isBillingAddress;
	public static volatile SingularAttribute<Address, Long> addressId;
	public static volatile SingularAttribute<Address, LocalDateTime> updatedAt;

	public static final String COUNTRY = "country";
	public static final String CREATED_AT = "createdAt";
	public static final String PROVINCE = "province";
	public static final String ADDRESS2 = "address2";
	public static final String CITY = "city";
	public static final String ADDRESS1 = "address1";
	public static final String POSTAL_CODE = "postalCode";
	public static final String IS_SHIPPING_ADDRESS = "isShippingAddress";
	public static final String USER = "user";
	public static final String IS_BILLING_ADDRESS = "isBillingAddress";
	public static final String ADDRESS_ID = "addressId";
	public static final String UPDATED_AT = "updatedAt";

}

