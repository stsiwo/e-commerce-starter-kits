package com.iwaodev.infrastructure.model;

import com.iwaodev.domain.user.UserTypeEnum;
import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(UserType.class)
public abstract class UserType_ {

	public static volatile SingularAttribute<UserType, Long> userTypeId;
	public static volatile SingularAttribute<UserType, UserTypeEnum> userType;
	public static volatile ListAttribute<UserType, User> users;

	public static final String USER_TYPE_ID = "userTypeId";
	public static final String USER_TYPE = "userType";
	public static final String USERS = "users";

}

