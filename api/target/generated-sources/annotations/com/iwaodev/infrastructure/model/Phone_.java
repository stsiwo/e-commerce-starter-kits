package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Phone.class)
public abstract class Phone_ {

	public static volatile SingularAttribute<Phone, LocalDateTime> createdAt;
	public static volatile SingularAttribute<Phone, String> extension;
	public static volatile SingularAttribute<Phone, String> phoneNumber;
	public static volatile SingularAttribute<Phone, String> countryCode;
	public static volatile SingularAttribute<Phone, Long> phoneId;
	public static volatile SingularAttribute<Phone, Boolean> isSelected;
	public static volatile SingularAttribute<Phone, User> user;
	public static volatile SingularAttribute<Phone, LocalDateTime> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String EXTENSION = "extension";
	public static final String PHONE_NUMBER = "phoneNumber";
	public static final String COUNTRY_CODE = "countryCode";
	public static final String PHONE_ID = "phoneId";
	public static final String IS_SELECTED = "isSelected";
	public static final String USER = "user";
	public static final String UPDATED_AT = "updatedAt";

}

