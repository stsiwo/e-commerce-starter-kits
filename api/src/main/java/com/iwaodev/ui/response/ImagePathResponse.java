package com.iwaodev.ui.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ImagePathResponse {

  private String imagePath;

  private Long version;

  public ImagePathResponse(String imagePath, Long version) {
    this.imagePath = imagePath;
    this.version = version;
  }
}

