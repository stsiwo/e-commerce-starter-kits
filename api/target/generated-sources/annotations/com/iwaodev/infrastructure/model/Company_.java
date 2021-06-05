package com.iwaodev.infrastructure.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Company.class)
public abstract class Company_ {

	public static volatile SingularAttribute<Company, String> country;
	public static volatile SingularAttribute<Company, String> address2;
	public static volatile SingularAttribute<Company, String> city;
	public static volatile SingularAttribute<Company, String> address1;
	public static volatile SingularAttribute<Company, String> companyName;
	public static volatile SingularAttribute<Company, String> companyDescription;
	public static volatile SingularAttribute<Company, String> postalCode;
	public static volatile SingularAttribute<Company, Long> companyId;
	public static volatile SingularAttribute<Company, String> phoneNumber;
	public static volatile SingularAttribute<Company, String> companyEmail;
	public static volatile SingularAttribute<Company, String> province;
	public static volatile SingularAttribute<Company, String> countryCode;
	public static volatile SingularAttribute<Company, User> user;

	public static final String COUNTRY = "country";
	public static final String ADDRESS2 = "address2";
	public static final String CITY = "city";
	public static final String ADDRESS1 = "address1";
	public static final String COMPANY_NAME = "companyName";
	public static final String COMPANY_DESCRIPTION = "companyDescription";
	public static final String POSTAL_CODE = "postalCode";
	public static final String COMPANY_ID = "companyId";
	public static final String PHONE_NUMBER = "phoneNumber";
	public static final String COMPANY_EMAIL = "companyEmail";
	public static final String PROVINCE = "province";
	public static final String COUNTRY_CODE = "countryCode";
	public static final String USER = "user";

}

