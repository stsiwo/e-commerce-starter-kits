package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.review.CategoryDTO;
import com.iwaodev.application.dto.review.ProductDTO;
import com.iwaodev.application.dto.review.ProductImageDTO;
import com.iwaodev.application.dto.review.ProductSizeDTO;
import com.iwaodev.application.dto.review.ProductVariantDTO;
import com.iwaodev.application.dto.review.ReviewDTO;
import com.iwaodev.application.dto.review.UserDTO;
import com.iwaodev.application.dto.review.UserTypeDTO;
import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductImage;
import com.iwaodev.infrastructure.model.ProductSize;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType;
import com.iwaodev.ui.criteria.review.ReviewCriteria;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:15-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class ReviewMapperImpl implements ReviewMapper {

    @Override
    public ReviewDTO toReviewDTO(Review review) {
        if ( review == null ) {
            return null;
        }

        ReviewDTO reviewDTO = new ReviewDTO();

        reviewDTO.setReviewId( review.getReviewId() );
        reviewDTO.setReviewTitle( review.getReviewTitle() );
        reviewDTO.setReviewDescription( review.getReviewDescription() );
        reviewDTO.setReviewPoint( review.getReviewPoint() );
        reviewDTO.setIsVerified( review.getIsVerified() );
        reviewDTO.setNote( review.getNote() );
        reviewDTO.setCreatedAt( review.getCreatedAt() );
        reviewDTO.setUpdatedAt( review.getUpdatedAt() );
        reviewDTO.setUser( userToUserDTO( review.getUser() ) );
        reviewDTO.setProduct( productToProductDTO( review.getProduct() ) );

        return reviewDTO;
    }

    @Override
    public Review toReviewEntityFromReviewCriteria(ReviewCriteria review) {
        if ( review == null ) {
            return null;
        }

        Review review1 = new Review();

        review1.setReviewId( review.getReviewId() );
        review1.setReviewPoint( review.getReviewPoint() );
        review1.setReviewTitle( review.getReviewTitle() );
        review1.setReviewDescription( review.getReviewDescription() );
        review1.setIsVerified( review.getIsVerified() );
        review1.setNote( review.getNote() );

        return review1;
    }

    protected UserTypeDTO userTypeToUserTypeDTO(UserType userType) {
        if ( userType == null ) {
            return null;
        }

        UserTypeDTO userTypeDTO = new UserTypeDTO();

        userTypeDTO.setUserTypeId( userType.getUserTypeId() );
        if ( userType.getUserType() != null ) {
            userTypeDTO.setUserType( userType.getUserType().name() );
        }

        return userTypeDTO;
    }

    protected UserDTO userToUserDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setUserId( user.getUserId() );
        userDTO.setFirstName( user.getFirstName() );
        userDTO.setLastName( user.getLastName() );
        userDTO.setEmail( user.getEmail() );
        userDTO.setAvatarImagePath( user.getAvatarImagePath() );
        userDTO.setUserType( userTypeToUserTypeDTO( user.getUserType() ) );

        return userDTO;
    }

    protected CategoryDTO categoryToCategoryDTO(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryDTO categoryDTO = new CategoryDTO();

        categoryDTO.setCategoryId( category.getCategoryId() );
        categoryDTO.setCategoryName( category.getCategoryName() );
        categoryDTO.setCategoryDescription( category.getCategoryDescription() );
        categoryDTO.setCategoryPath( category.getCategoryPath() );

        return categoryDTO;
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

    protected ProductVariantDTO productVariantToProductVariantDTO(ProductVariant productVariant) {
        if ( productVariant == null ) {
            return null;
        }

        ProductVariantDTO productVariantDTO = new ProductVariantDTO();

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

    protected List<ProductVariantDTO> productVariantListToProductVariantDTOList(List<ProductVariant> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductVariantDTO> list1 = new ArrayList<ProductVariantDTO>( list.size() );
        for ( ProductVariant productVariant : list ) {
            list1.add( productVariantToProductVariantDTO( productVariant ) );
        }

        return list1;
    }

    protected ProductImageDTO productImageToProductImageDTO(ProductImage productImage) {
        if ( productImage == null ) {
            return null;
        }

        ProductImageDTO productImageDTO = new ProductImageDTO();

        productImageDTO.setProductImageId( productImage.getProductImageId() );
        productImageDTO.setProductImagePath( productImage.getProductImagePath() );

        return productImageDTO;
    }

    protected List<ProductImageDTO> productImageListToProductImageDTOList(List<ProductImage> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductImageDTO> list1 = new ArrayList<ProductImageDTO>( list.size() );
        for ( ProductImage productImage : list ) {
            list1.add( productImageToProductImageDTO( productImage ) );
        }

        return list1;
    }

    protected ProductDTO productToProductDTO(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();

        productDTO.setProductId( product.getProductId() );
        productDTO.setProductName( product.getProductName() );
        productDTO.setProductDescription( product.getProductDescription() );
        productDTO.setProductPath( product.getProductPath() );
        productDTO.setProductBaseUnitPrice( product.getProductBaseUnitPrice() );
        productDTO.setProductBaseDiscountPrice( product.getProductBaseDiscountPrice() );
        productDTO.setProductBaseDiscountStartDate( product.getProductBaseDiscountStartDate() );
        productDTO.setProductBaseDiscountEndDate( product.getProductBaseDiscountEndDate() );
        productDTO.setAverageReviewPoint( product.getAverageReviewPoint() );
        productDTO.setIsDiscount( product.getIsDiscount() );
        productDTO.setIsPublic( product.getIsPublic() );
        productDTO.setReleaseDate( product.getReleaseDate() );
        productDTO.setNote( product.getNote() );
        productDTO.setCreatedAt( product.getCreatedAt() );
        productDTO.setUpdatedAt( product.getUpdatedAt() );
        productDTO.setCategory( categoryToCategoryDTO( product.getCategory() ) );
        productDTO.setVariants( productVariantListToProductVariantDTOList( product.getVariants() ) );
        productDTO.setProductImages( productImageListToProductImageDTOList( product.getProductImages() ) );

        return productDTO;
    }
}
