package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.ui.criteria.user.UserSignupCriteria;

public interface UserSignupService {

  public UserDTO signup(UserSignupCriteria criteria) throws Exception;

  public UserDTO verifyAccount(UUID userId, String verificationToken) throws Exception;

  public UserDTO reissueVerification(UUID userId) throws Exception;
}
