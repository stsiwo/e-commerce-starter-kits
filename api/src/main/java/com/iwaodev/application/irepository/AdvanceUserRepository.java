package com.iwaodev.application.irepository;

import java.util.Optional;
import java.util.UUID;

import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.model.UserType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface AdvanceUserRepository {

  public Optional<UserType> findUserType(UserTypeEnum type);

  public Boolean isDuplicateEmail(String email);

  public Page<User> findAllToAvoidNPlusOne(Specification<User> spec, Pageable pageable);

  /**
   * check if email exists ecept for this userId
   **/
  public Boolean isOthersHaveEmail(UUID userId, String email);
}
