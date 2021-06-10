package com.iwaodev.application.irepository;

import java.util.Optional;

import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.UserType;

public interface AdvanceUserRepository {

  public Optional<UserType> findUserType(UserTypeEnum type);
}
