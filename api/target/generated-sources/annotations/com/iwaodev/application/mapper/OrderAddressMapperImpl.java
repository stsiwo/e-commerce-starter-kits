package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.order.OrderAddressDTO;
import com.iwaodev.infrastructure.model.OrderAddress;
import com.iwaodev.ui.criteria.order.OrderAddressCriteria;
import javax.annotation.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-06-05T14:03:15-0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 11.0.5 (Oracle Corporation)"
)
public class OrderAddressMapperImpl implements OrderAddressMapper {

    @Override
    public OrderAddressDTO toOrderAddressDTO(OrderAddress orderaddress) {
        if ( orderaddress == null ) {
            return null;
        }

        OrderAddressDTO orderAddressDTO = new OrderAddressDTO();

        orderAddressDTO.setOrderAddressId( orderaddress.getOrderAddressId() );
        orderAddressDTO.setAddress1( orderaddress.getAddress1() );
        orderAddressDTO.setAddress2( orderaddress.getAddress2() );
        orderAddressDTO.setCity( orderaddress.getCity() );
        orderAddressDTO.setProvince( orderaddress.getProvince() );
        orderAddressDTO.setCountry( orderaddress.getCountry() );
        orderAddressDTO.setPostalCode( orderaddress.getPostalCode() );
        orderAddressDTO.setCreatedAt( orderaddress.getCreatedAt() );
        orderAddressDTO.setUpdatedAt( orderaddress.getUpdatedAt() );

        return orderAddressDTO;
    }

    @Override
    public OrderAddress toOrderAddressEntityFromOrderAddressCriteria(OrderAddressCriteria criteria) {
        if ( criteria == null ) {
            return null;
        }

        OrderAddress orderAddress = new OrderAddress();

        orderAddress.setAddress1( criteria.getAddress1() );
        orderAddress.setAddress2( criteria.getAddress2() );
        orderAddress.setCity( criteria.getCity() );
        orderAddress.setProvince( criteria.getProvince() );
        orderAddress.setCountry( criteria.getCountry() );
        orderAddress.setPostalCode( criteria.getPostalCode() );

        return orderAddress;
    }
}
