package com.iwaodev.application.iservice;

import com.iwaodev.ui.criteria.ResetPasswordCriteria;

public interface ForgotPasswordService {

  public void requestForgotPassword(String email);

  public void resetPassword(ResetPasswordCriteria criteria);

}



