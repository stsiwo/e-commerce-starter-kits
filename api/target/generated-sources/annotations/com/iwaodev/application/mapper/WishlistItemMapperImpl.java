package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.wishlistItem.UserDTO;
import com.iwaodev.application.dto.wishlistItem.UserTypeDTO;
import com.iwaodev.application.dto.wishlistItem.WishlistItemDTO;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType;
import com.iwaodev.infrastructure.model.WishlistItem;
import com.iwaodev.ui.criteria.WishlistItemCriteria;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class WishlistItemMapperImpl implements WishlistItemMapper {

    @Override
    public WishlistItemDTO toWishlistItemDTO(WishlistItem wishlistItem) {
        if ( wishlistItem == null ) {
            return null;
        }

        WishlistItemDTO wishlistItemDTO = new WishlistItemDTO();

        wishlistItemDTO.setProduct( WishlistItemMapper.variantToProduct( wishlistItem.getVariant() ) );
        wishlistItemDTO.setWishlistItemId( wishlistItem.getWishlistItemId() );
        wishlistItemDTO.setUser( userToUserDTO( wishlistItem.getUser() ) );

        return wishlistItemDTO;
    }

    @Override
    public WishlistItem toWishlistItemEntityFromWishlistItemCriteria(WishlistItemCriteria wishlistItem) {
        if ( wishlistItem == null ) {
            return null;
        }

        WishlistItem wishlistItem1 = new WishlistItem();

        wishlistItem1.setWishlistItemId( wishlistItem.getWishlistItemId() );

        return wishlistItem1;
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
