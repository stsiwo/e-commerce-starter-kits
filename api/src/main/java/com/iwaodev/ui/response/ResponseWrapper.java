package com.iwaodev.ui.response;

import org.springframework.stereotype.Component;

import lombok.Data;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor
@Data
public class ResponseWrapper<T> {

  private T content;

}
