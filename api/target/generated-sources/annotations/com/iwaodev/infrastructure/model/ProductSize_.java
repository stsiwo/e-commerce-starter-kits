package com.iwaodev.infrastructure.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(ProductSize.class)
public abstract class ProductSize_ {

	public static volatile SingularAttribute<ProductSize, Long> productSizeId;
	public static volatile SingularAttribute<ProductSize, String> productSizeName;
	public static volatile ListAttribute<ProductSize, ProductVariant> productVariants;
	public static volatile SingularAttribute<ProductSize, String> productSizeDescription;

	public static final String PRODUCT_SIZE_ID = "productSizeId";
	public static final String PRODUCT_SIZE_NAME = "productSizeName";
	public static final String PRODUCT_VARIANTS = "productVariants";
	public static final String PRODUCT_SIZE_DESCRIPTION = "productSizeDescription";

}

