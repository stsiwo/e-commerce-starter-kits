package com.iwaodev.application.dto.review;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * a dto for /users/{userId}/review endpoint
 *
 **/
@NoArgsConstructor
@Data
@ToString
public class FindReviewDTO {

  private ReviewDTO review;

  private Boolean isExist;

  private UserDTO user;

  private ProductDTO product;
}



