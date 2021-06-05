package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.productVariant.ProductSizeDTO;
import com.iwaodev.application.dto.productVariant.ProductVariantDTO;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductSize;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.ProductSizeCriteria;
import com.iwaodev.ui.criteria.ProductVariantCriteria;
import java.util.UUID;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class ProductVariantMapperImpl implements ProductVariantMapper {

    @Override
    public ProductVariantDTO toProductVariantDTO(ProductVariant productVariant) {
        if ( productVariant == null ) {
            return null;
        }

        ProductVariantDTO productVariantDTO = new ProductVariantDTO();

        productVariantDTO.setProductId( productVariantProductProductId( productVariant ) );
        productVariantDTO.setVariantId( productVariant.getVariantId() );
        productVariantDTO.setVariantUnitPrice( productVariant.getVariantUnitPrice() );
        productVariantDTO.setVariantDiscountPrice( productVariant.getVariantDiscountPrice() );
        productVariantDTO.setVariantDiscountStartDate( productVariant.getVariantDiscountStartDate() );
        productVariantDTO.setVariantDiscountEndDate( productVariant.getVariantDiscountEndDate() );
        productVariantDTO.setVariantStock( productVariant.getVariantStock() );
        productVariantDTO.setIsDiscount( productVariant.getIsDiscount() );
        productVariantDTO.setSoldCount( productVariant.getSoldCount() );
        productVariantDTO.setNote( productVariant.getNote() );
        productVariantDTO.setProductSize( productSizeToProductSizeDTO( productVariant.getProductSize() ) );
        productVariantDTO.setVariantColor( productVariant.getVariantColor() );

        return productVariantDTO;
    }

    @Override
    public ProductVariant toProductVariantEntityFromProductVariantCriteria(ProductVariantCriteria productVariant) {
        if ( productVariant == null ) {
            return null;
        }

        ProductVariant productVariant1 = new ProductVariant();

        productVariant1.setVariantId( productVariant.getVariantId() );
        productVariant1.setVariantUnitPrice( productVariant.getVariantUnitPrice() );
        productVariant1.setVariantDiscountPrice( productVariant.getVariantDiscountPrice() );
        productVariant1.setVariantDiscountStartDate( productVariant.getVariantDiscountStartDate() );
        productVariant1.setVariantDiscountEndDate( productVariant.getVariantDiscountEndDate() );
        productVariant1.setVariantStock( productVariant.getVariantStock() );
        productVariant1.setIsDiscount( productVariant.getIsDiscount() );
        productVariant1.setNote( productVariant.getNote() );
        productVariant1.setVariantColor( productVariant.getVariantColor() );
        productVariant1.setVariantWeight( productVariant.getVariantWeight() );
        productVariant1.setVariantHeight( productVariant.getVariantHeight() );
        productVariant1.setVariantLength( productVariant.getVariantLength() );
        productVariant1.setVariantWidth( productVariant.getVariantWidth() );
        productVariant1.setProductSize( productSizeCriteriaToProductSize( productVariant.getProductSize() ) );

        return productVariant1;
    }

    private UUID productVariantProductProductId(ProductVariant productVariant) {
        if ( productVariant == null ) {
            return null;
        }
        Product product = productVariant.getProduct();
        if ( product == null ) {
            return null;
        }
        UUID productId = product.getProductId();
        if ( productId == null ) {
            return null;
        }
        return productId;
    }

    protected ProductSizeDTO productSizeToProductSizeDTO(ProductSize productSize) {
        if ( productSize == null ) {
            return null;
        }

        ProductSizeDTO productSizeDTO = new ProductSizeDTO();

        productSizeDTO.setProductSizeId( productSize.getProductSizeId() );
        productSizeDTO.setProductSizeName( productSize.getProductSizeName() );
        productSizeDTO.setProductSizeDescription( productSize.getProductSizeDescription() );

        return productSizeDTO;
    }

    protected ProductSize productSizeCriteriaToProductSize(ProductSizeCriteria productSizeCriteria) {
        if ( productSizeCriteria == null ) {
            return null;
        }

        ProductSize productSize = new ProductSize();

        productSize.setProductSizeId( productSizeCriteria.getProductSizeId() );
        productSize.setProductSizeName( productSizeCriteria.getProductSizeName() );
        productSize.setProductSizeDescription( productSizeCriteria.getProductSizeDescription() );

        return productSize;
    }
}
