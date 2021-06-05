package com.iwaodev.ui.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ImagePathResponse {

  private String imagePath;

  public ImagePathResponse(String imagePath) {
    this.imagePath = imagePath;
  }
}

