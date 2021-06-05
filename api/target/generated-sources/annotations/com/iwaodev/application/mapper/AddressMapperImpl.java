package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.user.AddressDTO;
import com.iwaodev.infrastructure.model.Address;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.UserAddressCriteria;
import java.util.UUID;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:14-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class AddressMapperImpl implements AddressMapper {

    @Override
    public AddressDTO toAddressDTO(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressDTO addressDTO = new AddressDTO();

        addressDTO.setUserId( addressUserUserId( address ) );
        addressDTO.setAddressId( address.getAddressId() );
        addressDTO.setAddress1( address.getAddress1() );
        addressDTO.setAddress2( address.getAddress2() );
        addressDTO.setCity( address.getCity() );
        addressDTO.setProvince( address.getProvince() );
        addressDTO.setCountry( address.getCountry() );
        addressDTO.setPostalCode( address.getPostalCode() );
        addressDTO.setIsBillingAddress( address.getIsBillingAddress() );
        addressDTO.setIsShippingAddress( address.getIsShippingAddress() );
        addressDTO.setCreatedAt( address.getCreatedAt() );
        addressDTO.setUpdatedAt( address.getUpdatedAt() );

        return addressDTO;
    }

    @Override
    public Address toAddressEntityFromAddressCriteria(UserAddressCriteria address) {
        if ( address == null ) {
            return null;
        }

        Address address1 = new Address();

        address1.setAddressId( address.getAddressId() );
        address1.setAddress1( address.getAddress1() );
        address1.setAddress2( address.getAddress2() );
        address1.setCity( address.getCity() );
        address1.setProvince( address.getProvince() );
        address1.setCountry( address.getCountry() );
        address1.setPostalCode( address.getPostalCode() );
        address1.setIsBillingAddress( address.getIsBillingAddress() );
        address1.setIsShippingAddress( address.getIsShippingAddress() );

        return address1;
    }

    private UUID addressUserUserId(Address address) {
        if ( address == null ) {
            return null;
        }
        User user = address.getUser();
        if ( user == null ) {
            return null;
        }
        UUID userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }
}
