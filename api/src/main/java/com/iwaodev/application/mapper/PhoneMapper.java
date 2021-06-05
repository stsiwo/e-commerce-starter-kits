package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.user.PhoneDTO;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.ui.criteria.UserPhoneCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PhoneMapper {

  PhoneMapper INSTANCE = Mappers.getMapper( PhoneMapper.class );

  @Mapping(source = "phone.user.userId", target = "userId")
  PhoneDTO toPhoneDTO(Phone phone);
 
  /**
   * List with @Mapping does not work
   **/
  //@Mapping(source = "user.userId", target = "userId")
  //List<PhoneDTO> toPhoneDTOList(List<Phone> phones);

  Phone toPhoneEntityFromPhoneCriteria(UserPhoneCriteria phone);

}


