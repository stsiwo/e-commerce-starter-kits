package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.order.OrderAddressDTO;
import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderDetailDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.application.dto.order.OrderUserDTO;
import com.iwaodev.application.dto.product.CategoryDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.product.ProductImageDTO;
import com.iwaodev.application.dto.product.ProductSizeDTO;
import com.iwaodev.application.dto.product.ProductVariantDTO;
import com.iwaodev.application.dto.product.ReviewDTO;
import com.iwaodev.application.dto.product.UserDTO;
import com.iwaodev.application.dto.user.UserTypeDTO;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.infrastructure.model.Category;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderAddress;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.OrderEvent;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductImage;
import com.iwaodev.infrastructure.model.ProductSize;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.infrastructure.model.Review;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType;
import com.iwaodev.ui.criteria.order.OrderAddressCriteria;
import com.iwaodev.ui.criteria.order.OrderCriteria;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderDTO toOrderDTO(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderDTO orderDTO = new OrderDTO();

        orderDTO.setOrderId( order.getOrderId() );
        orderDTO.setOrderNumber( order.getOrderNumber() );
        orderDTO.setProductCost( order.getProductCost() );
        orderDTO.setTaxCost( order.getTaxCost() );
        orderDTO.setShippingCost( order.getShippingCost() );
        orderDTO.setNote( order.getNote() );
        orderDTO.setOrderFirstName( order.getOrderFirstName() );
        orderDTO.setOrderLastName( order.getOrderLastName() );
        orderDTO.setOrderEmail( order.getOrderEmail() );
        orderDTO.setOrderPhone( order.getOrderPhone() );
        orderDTO.setShippingAddress( orderAddressToOrderAddressDTO( order.getShippingAddress() ) );
        orderDTO.setBillingAddress( orderAddressToOrderAddressDTO( order.getBillingAddress() ) );
        orderDTO.setCreatedAt( order.getCreatedAt() );
        orderDTO.setUpdatedAt( order.getUpdatedAt() );
        orderDTO.setUser( userToOrderUserDTO( order.getUser() ) );
        orderDTO.setOrderEvents( orderEventListToOrderEventDTOList( order.getOrderEvents() ) );
        orderDTO.setOrderDetails( orderDetailListToOrderDetailDTOList( order.getOrderDetails() ) );
        List<OrderStatusEnum> list2 = order.getNextAdminOrderEventOptions();
        if ( list2 != null ) {
            orderDTO.setNextAdminOrderEventOptions( new ArrayList<OrderStatusEnum>( list2 ) );
        }
        List<OrderStatusEnum> list3 = order.getNextMemberOrderEventOptions();
        if ( list3 != null ) {
            orderDTO.setNextMemberOrderEventOptions( new ArrayList<OrderStatusEnum>( list3 ) );
        }
        orderDTO.setLatestOrderEvent( toOrderEventDTO( order.getLatestOrderEvent() ) );
        orderDTO.setCurrency( order.getCurrency() );

        return orderDTO;
    }

    @Override
    public OrderEventDTO toOrderEventDTO(OrderEvent orderEvent) {
        if ( orderEvent == null ) {
            return null;
        }

        OrderEventDTO orderEventDTO = new OrderEventDTO();

        orderEventDTO.setOrderEventId( orderEvent.getOrderEventId() );
        orderEventDTO.setUndoable( orderEvent.getUndoable() );
        orderEventDTO.setNote( orderEvent.getNote() );
        orderEventDTO.setOrderStatus( orderEvent.getOrderStatus() );
        orderEventDTO.setCreatedAt( orderEvent.getCreatedAt() );
        orderEventDTO.setUser( userToOrderUserDTO( orderEvent.getUser() ) );

        return orderEventDTO;
    }

    @Override
    public Order toOrderEntityFromOrderCriteria(OrderCriteria criteria) {
        if ( criteria == null ) {
            return null;
        }

        Order order = new Order();

        order.setShippingAddress( orderAddressCriteriaToOrderAddress( criteria.getShippingAddress() ) );
        order.setBillingAddress( orderAddressCriteriaToOrderAddress( criteria.getBillingAddress() ) );
        order.setOrderId( criteria.getOrderId() );
        order.setNote( criteria.getNote() );
        order.setOrderFirstName( criteria.getOrderFirstName() );
        order.setOrderLastName( criteria.getOrderLastName() );
        order.setOrderEmail( criteria.getOrderEmail() );
        order.setOrderPhone( criteria.getOrderPhone() );
        order.setCurrency( criteria.getCurrency() );

        return order;
    }

    @Override
    public OrderEvent toOrderEventEntityfromOrderEventCriteria(OrderEventCriteria criteria) {
        if ( criteria == null ) {
            return null;
        }

        OrderEvent orderEvent = new OrderEvent();

        orderEvent.setOrderEventId( criteria.getOrderEventId() );
        orderEvent.setNote( criteria.getNote() );
        orderEvent.setOrderStatus( criteria.getOrderStatus() );

        return orderEvent;
    }

    protected OrderAddressDTO orderAddressToOrderAddressDTO(OrderAddress orderAddress) {
        if ( orderAddress == null ) {
            return null;
        }

        OrderAddressDTO orderAddressDTO = new OrderAddressDTO();

        orderAddressDTO.setOrderAddressId( orderAddress.getOrderAddressId() );
        orderAddressDTO.setAddress1( orderAddress.getAddress1() );
        orderAddressDTO.setAddress2( orderAddress.getAddress2() );
        orderAddressDTO.setCity( orderAddress.getCity() );
        orderAddressDTO.setProvince( orderAddress.getProvince() );
        orderAddressDTO.setCountry( orderAddress.getCountry() );
        orderAddressDTO.setPostalCode( orderAddress.getPostalCode() );
        orderAddressDTO.setCreatedAt( orderAddress.getCreatedAt() );
        orderAddressDTO.setUpdatedAt( orderAddress.getUpdatedAt() );

        return orderAddressDTO;
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

    protected OrderUserDTO userToOrderUserDTO(User user) {
        if ( user == null ) {
            return null;
        }

        OrderUserDTO orderUserDTO = new OrderUserDTO();

        orderUserDTO.setUserId( user.getUserId() );
        orderUserDTO.setFirstName( user.getFirstName() );
        orderUserDTO.setLastName( user.getLastName() );
        orderUserDTO.setEmail( user.getEmail() );
        orderUserDTO.setAvatarImagePath( user.getAvatarImagePath() );
        orderUserDTO.setIsDeleted( user.getIsDeleted() );
        orderUserDTO.setDeletedAccountDate( user.getDeletedAccountDate() );
        orderUserDTO.setDeletedAccountReason( user.getDeletedAccountReason() );
        orderUserDTO.setUserType( userTypeToUserTypeDTO( user.getUserType() ) );
        orderUserDTO.setCreatedAt( user.getCreatedAt() );
        orderUserDTO.setUpdatedAt( user.getUpdatedAt() );

        return orderUserDTO;
    }

    protected List<OrderEventDTO> orderEventListToOrderEventDTOList(List<OrderEvent> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderEventDTO> list1 = new ArrayList<OrderEventDTO>( list.size() );
        for ( OrderEvent orderEvent : list ) {
            list1.add( toOrderEventDTO( orderEvent ) );
        }

        return list1;
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

    protected com.iwaodev.application.dto.product.UserTypeDTO userTypeToUserTypeDTO1(UserType userType) {
        if ( userType == null ) {
            return null;
        }

        com.iwaodev.application.dto.product.UserTypeDTO userTypeDTO = new com.iwaodev.application.dto.product.UserTypeDTO();

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
        userDTO.setUserType( userTypeToUserTypeDTO1( user.getUserType() ) );

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
        productDTO.setReviews( reviewListToReviewDTOList( product.getReviews() ) );

        return productDTO;
    }

    protected OrderDetailDTO orderDetailToOrderDetailDTO(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }

        OrderDetailDTO orderDetailDTO = new OrderDetailDTO();

        orderDetailDTO.setOrderDetailId( orderDetail.getOrderDetailId() );
        orderDetailDTO.setProductQuantity( orderDetail.getProductQuantity() );
        orderDetailDTO.setProductUnitPrice( orderDetail.getProductUnitPrice() );
        orderDetailDTO.setProductColor( orderDetail.getProductColor() );
        orderDetailDTO.setProductSize( orderDetail.getProductSize() );
        orderDetailDTO.setProductName( orderDetail.getProductName() );
        orderDetailDTO.setCreatedAt( orderDetail.getCreatedAt() );
        orderDetailDTO.setProduct( productToProductDTO( orderDetail.getProduct() ) );
        orderDetailDTO.setProductVariant( productVariantToProductVariantDTO( orderDetail.getProductVariant() ) );

        return orderDetailDTO;
    }

    protected List<OrderDetailDTO> orderDetailListToOrderDetailDTOList(List<OrderDetail> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderDetailDTO> list1 = new ArrayList<OrderDetailDTO>( list.size() );
        for ( OrderDetail orderDetail : list ) {
            list1.add( orderDetailToOrderDetailDTO( orderDetail ) );
        }

        return list1;
    }

    protected OrderAddress orderAddressCriteriaToOrderAddress(OrderAddressCriteria orderAddressCriteria) {
        if ( orderAddressCriteria == null ) {
            return null;
        }

        OrderAddress orderAddress = new OrderAddress();

        orderAddress.setAddress1( orderAddressCriteria.getAddress1() );
        orderAddress.setAddress2( orderAddressCriteria.getAddress2() );
        orderAddress.setCity( orderAddressCriteria.getCity() );
        orderAddress.setProvince( orderAddressCriteria.getProvince() );
        orderAddress.setCountry( orderAddressCriteria.getCountry() );
        orderAddress.setPostalCode( orderAddressCriteria.getPostalCode() );

        return orderAddress;
    }
}
