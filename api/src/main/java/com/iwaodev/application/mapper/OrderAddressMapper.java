package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.order.OrderAddressDTO;
import com.iwaodev.infrastructure.model.OrderAddress;
import com.iwaodev.ui.criteria.order.OrderAddressCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderAddressMapper {

  OrderAddressMapper INSTANCE = Mappers.getMapper( OrderAddressMapper.class );

  OrderAddressDTO toOrderAddressDTO(OrderAddress orderaddress);
 
  /**
   * List with @Mapping does not work
   **/
  //@Mapping(source = "user.userId", target = "userId")
  //List<OrderAddressDTO> toOrderAddressDTOList(List<OrderAddress> orderaddresses);

  OrderAddress toOrderAddressEntityFromOrderAddressCriteria(OrderAddressCriteria criteria);

}

