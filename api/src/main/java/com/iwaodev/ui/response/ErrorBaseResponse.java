package com.iwaodev.ui.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor()
@Data
public class ErrorBaseResponse {

  private LocalDateTime timestamp;

  private int status;

  private String error;

  private String message;

  private String path;
}

