package com.iwaodev.ui.criteria.category;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.iwaodev.domain.category.validator.CategoryNameUnique;
import com.iwaodev.domain.category.validator.CategoryPathUnique;

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
  
  @CategoryNameUnique()
  @NotEmpty(message = "{category.name.notempty}")
  private String categoryName;

  @NotEmpty(message = "{category.description.notempty}")
  private String categoryDescription;

  @CategoryPathUnique()
  @NotEmpty(message = "{category.path.notempty}")
  private String categoryPath;

}

