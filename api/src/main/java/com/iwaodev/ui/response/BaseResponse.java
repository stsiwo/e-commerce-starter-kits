package com.iwaodev.ui.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class BaseResponse {

  private String message;

  public BaseResponse(String message) {
    this.message = message;
  }
}
