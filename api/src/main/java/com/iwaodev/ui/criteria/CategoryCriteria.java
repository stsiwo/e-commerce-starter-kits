package com.iwaodev.ui.criteria;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@Validated
/**
 * this make us to ignore any undefined property such as 'productTotalCount' so spring does not throw the exception.
 *
 **/
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryCriteria {

  private Long categoryId;
  
  @NotEmpty(message = "category name must not be null.")
  private String categoryName;

  @NotEmpty(message = "category description must not be null.")
  private String categoryDescription;

  @NotEmpty(message = "category path must not be null.")
  private String categoryPath;

}

