package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.user.UserCriteria;
import com.iwaodev.ui.criteria.user.UserSignupCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {

  UserMapper INSTANCE = Mappers.getMapper( UserMapper.class );

  UserDTO toUserDTO(User user);

  User toUserEntityFromUserSignupCriteria(UserSignupCriteria user);

  User toUserEntityFromUserCriteria(UserCriteria user);
}
