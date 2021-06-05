package com.iwaodev.application.mapper;

import java.util.List;

import com.iwaodev.application.dto.user.AddressDTO;
import com.iwaodev.infrastructure.model.Address;
import com.iwaodev.ui.criteria.UserAddressCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AddressMapper {

  AddressMapper INSTANCE = Mappers.getMapper( AddressMapper.class );

  @Mapping(source = "address.user.userId", target = "userId")
  AddressDTO toAddressDTO(Address address);
 
  /**
   * List with @Mapping does not work
   **/
  //@Mapping(source = "user.userId", target = "userId")
  //List<AddressDTO> toAddressDTOList(List<Address> addresses);

  Address toAddressEntityFromAddressCriteria(UserAddressCriteria address);

}

