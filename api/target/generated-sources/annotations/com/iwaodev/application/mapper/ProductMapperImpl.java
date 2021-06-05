package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.product.CategoryDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.product.ProductImageDTO;
import com.iwaodev.application.dto.product.ProductSizeDTO;
import com.iwaodev.application.dto.product.ProductVariantDTO;
import com.iwaodev.application.dto.product.ReviewDTO;
import com.iwaodev.application.dto.product.UserDTO;
import com.iwaodev.application.dto.product.UserTypeDTO;
import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductImage;
import com.iwaodev.infrastructure.model.ProductSize;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType;
import com.iwaodev.ui.criteria.CategoryCriteria;
import com.iwaodev.ui.criteria.ProductCriteria;
import com.iwaodev.ui.criteria.ProductImageCriteria;
import com.iwaodev.ui.criteria.ProductSizeCriteria;
import com.iwaodev.ui.criteria.ProductVariantCriteria;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductDTO toProductDTO(Product product) {
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
        productDTO.setReviews( reviewListToReviewDTOList( product.getReviews() ) );

        return productDTO;
    }

    @Override
    public Product toProductEntityFromProductCriteria(ProductCriteria product) {
        if ( product == null ) {
            return null;
        }

        Product product1 = new Product();

        product1.setVariants( productVariantCriteriaListToProductVariantList( product.getVariants() ) );
        product1.setProductImages( productImageCriteriaListToProductImageList( product.getProductImages() ) );
        product1.setProductId( product.getProductId() );
        product1.setProductName( product.getProductName() );
        product1.setProductDescription( product.getProductDescription() );
        product1.setProductPath( product.getProductPath() );
        product1.setProductBaseUnitPrice( product.getProductBaseUnitPrice() );
        product1.setProductBaseDiscountPrice( product.getProductBaseDiscountPrice() );
        product1.setProductBaseDiscountStartDate( product.getProductBaseDiscountStartDate() );
        product1.setProductBaseDiscountEndDate( product.getProductBaseDiscountEndDate() );
        product1.setIsDiscount( product.getIsDiscount() );
        product1.setIsPublic( product.getIsPublic() );
        product1.setCategory( categoryCriteriaToCategory( product.getCategory() ) );
        product1.setReleaseDate( product.getReleaseDate() );
        product1.setNote( product.getNote() );

        return product1;
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
        productVariantDTO.setVariantWeight( productVariant.getVariantWeight() );
        productVariantDTO.setVariantHeight( productVariant.getVariantHeight() );
        productVariantDTO.setVariantWidth( productVariant.getVariantWidth() );
        productVariantDTO.setVariantLength( productVariant.getVariantLength() );

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
        productImageDTO.setIsChange( productImage.getIsChange() );
        productImageDTO.setProductImageName( productImage.getProductImageName() );

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

    protected ReviewDTO reviewToReviewDTO(Review review) {
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

        return reviewDTO;
    }

    protected List<ReviewDTO> reviewListToReviewDTOList(List<Review> list) {
        if ( list == null ) {
            return null;
        }

        List<ReviewDTO> list1 = new ArrayList<ReviewDTO>( list.size() );
        for ( Review review : list ) {
            list1.add( reviewToReviewDTO( review ) );
        }

        return list1;
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

    protected ProductVariant productVariantCriteriaToProductVariant(ProductVariantCriteria productVariantCriteria) {
        if ( productVariantCriteria == null ) {
            return null;
        }

        ProductVariant productVariant = new ProductVariant();

        productVariant.setVariantId( productVariantCriteria.getVariantId() );
        productVariant.setVariantUnitPrice( productVariantCriteria.getVariantUnitPrice() );
        productVariant.setVariantDiscountPrice( productVariantCriteria.getVariantDiscountPrice() );
        productVariant.setVariantDiscountStartDate( productVariantCriteria.getVariantDiscountStartDate() );
        productVariant.setVariantDiscountEndDate( productVariantCriteria.getVariantDiscountEndDate() );
        productVariant.setVariantStock( productVariantCriteria.getVariantStock() );
        productVariant.setIsDiscount( productVariantCriteria.getIsDiscount() );
        productVariant.setNote( productVariantCriteria.getNote() );
        productVariant.setVariantColor( productVariantCriteria.getVariantColor() );
        productVariant.setVariantWeight( productVariantCriteria.getVariantWeight() );
        productVariant.setVariantHeight( productVariantCriteria.getVariantHeight() );
        productVariant.setVariantLength( productVariantCriteria.getVariantLength() );
        productVariant.setVariantWidth( productVariantCriteria.getVariantWidth() );
        productVariant.setProductSize( productSizeCriteriaToProductSize( productVariantCriteria.getProductSize() ) );

        return productVariant;
    }

    protected List<ProductVariant> productVariantCriteriaListToProductVariantList(List<ProductVariantCriteria> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductVariant> list1 = new ArrayList<ProductVariant>( list.size() );
        for ( ProductVariantCriteria productVariantCriteria : list ) {
            list1.add( productVariantCriteriaToProductVariant( productVariantCriteria ) );
        }

        return list1;
    }

    protected ProductImage productImageCriteriaToProductImage(ProductImageCriteria productImageCriteria) {
        if ( productImageCriteria == null ) {
            return null;
        }

        ProductImage productImage = new ProductImage();

        productImage.setProductImageId( productImageCriteria.getProductImageId() );
        productImage.setProductImagePath( productImageCriteria.getProductImagePath() );
        productImage.setIsChange( productImageCriteria.getIsChange() );
        productImage.setProductImageName( productImageCriteria.getProductImageName() );

        return productImage;
    }

    protected List<ProductImage> productImageCriteriaListToProductImageList(List<ProductImageCriteria> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductImage> list1 = new ArrayList<ProductImage>( list.size() );
        for ( ProductImageCriteria productImageCriteria : list ) {
            list1.add( productImageCriteriaToProductImage( productImageCriteria ) );
        }

        return list1;
    }

    protected Category categoryCriteriaToCategory(CategoryCriteria categoryCriteria) {
        if ( categoryCriteria == null ) {
            return null;
        }

        Category category = new Category();

        category.setCategoryId( categoryCriteria.getCategoryId() );
        category.setCategoryName( categoryCriteria.getCategoryName() );
        category.setCategoryDescription( categoryCriteria.getCategoryDescription() );
        category.setCategoryPath( categoryCriteria.getCategoryPath() );

        return category;
    }
}
