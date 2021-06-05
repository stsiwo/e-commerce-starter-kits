package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Category.class)
public abstract class Category_ {

	public static volatile SingularAttribute<Category, LocalDateTime> createdAt;
	public static volatile SingularAttribute<Category, String> categoryPath;
	public static volatile SingularAttribute<Category, String> categoryName;
	public static volatile SingularAttribute<Category, Long> categoryId;
	public static volatile SingularAttribute<Category, String> categoryDescription;
	public static volatile SingularAttribute<Category, LocalDateTime> updatedAt;
	public static volatile ListAttribute<Category, Product> products;

	public static final String CREATED_AT = "createdAt";
	public static final String CATEGORY_PATH = "categoryPath";
	public static final String CATEGORY_NAME = "categoryName";
	public static final String CATEGORY_ID = "categoryId";
	public static final String CATEGORY_DESCRIPTION = "categoryDescription";
	public static final String UPDATED_AT = "updatedAt";
	public static final String PRODUCTS = "products";

}

