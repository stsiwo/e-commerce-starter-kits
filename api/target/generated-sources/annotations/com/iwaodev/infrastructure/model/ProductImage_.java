package com.iwaodev.infrastructure.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(ProductImage.class)
public abstract class ProductImage_ {

	public static volatile SingularAttribute<ProductImage, String> productImagePath;
	public static volatile SingularAttribute<ProductImage, Product> product;
	public static volatile SingularAttribute<ProductImage, String> productImageName;
	public static volatile SingularAttribute<ProductImage, Long> productImageId;
	public static volatile SingularAttribute<ProductImage, Boolean> isChange;

	public static final String PRODUCT_IMAGE_PATH = "productImagePath";
	public static final String PRODUCT = "product";
	public static final String PRODUCT_IMAGE_NAME = "productImageName";
	public static final String PRODUCT_IMAGE_ID = "productImageId";
	public static final String IS_CHANGE = "isChange";

}

