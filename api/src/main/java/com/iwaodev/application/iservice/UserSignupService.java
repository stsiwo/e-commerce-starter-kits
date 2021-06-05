package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.ui.criteria.UserSignupCriteria;

public interface UserSignupService {

  public UserDTO signup(UserSignupCriteria criteria);

  public UserDTO verifyAccount(UUID userId, String verificationToken);

  public UserDTO reissueVerification(UUID userId);
}
