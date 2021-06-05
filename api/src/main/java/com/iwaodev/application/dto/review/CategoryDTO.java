package com.iwaodev.application.dto.review;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Data
@ToString
public class CategoryDTO {

  private Long categoryId;

  private String categoryName;

  private String categoryDescription;

  private String categoryPath;
}
