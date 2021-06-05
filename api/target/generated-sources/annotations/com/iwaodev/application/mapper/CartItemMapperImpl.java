package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.cartItem.CartItemDTO;
import com.iwaodev.application.dto.cartItem.UserDTO;
import com.iwaodev.application.dto.cartItem.UserTypeDTO;
import com.iwaodev.infrastructure.model.CartItem;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType;
import com.iwaodev.ui.criteria.CartItemCriteria;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class CartItemMapperImpl implements CartItemMapper {

    @Override
    public CartItemDTO toCartItemDTO(CartItem cartitem) {
        if ( cartitem == null ) {
            return null;
        }

        CartItemDTO cartItemDTO = new CartItemDTO();

        cartItemDTO.setProduct( CartItemMapper.variantToProduct( cartitem.getVariant() ) );
        cartItemDTO.setCartItemId( cartitem.getCartItemId() );
        cartItemDTO.setUser( userToUserDTO( cartitem.getUser() ) );
        cartItemDTO.setIsSelected( cartitem.getIsSelected() );
        cartItemDTO.setQuantity( cartitem.getQuantity() );

        return cartItemDTO;
    }

    @Override
    public CartItem toCartItemEntityFromCartItemCriteria(CartItemCriteria cartitem) {
        if ( cartitem == null ) {
            return null;
        }

        CartItem cartItem = new CartItem();

        cartItem.setCartItemId( cartitem.getCartItemId() );
        cartItem.setIsSelected( cartitem.getIsSelected() );
        cartItem.setQuantity( cartitem.getQuantity() );

        return cartItem;
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
}
