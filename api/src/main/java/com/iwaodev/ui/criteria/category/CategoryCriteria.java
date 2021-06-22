package com.iwaodev.ui.criteria.category;

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
  
  @NotEmpty(message = "{category.name.notempty}")
  private String categoryName;

  @NotEmpty(message = "{category.description.notempty}")
  private String categoryDescription;

  @NotEmpty(message = "{category.path.notempty}")
  private String categoryPath;

}

