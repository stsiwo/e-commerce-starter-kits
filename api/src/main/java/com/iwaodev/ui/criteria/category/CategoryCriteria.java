package com.iwaodev.ui.criteria.category;

import javax.validation.constraints.Size;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

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
  @Size(max = 100, message = "{category.name.max100}")
  private String categoryName;

  @NotEmpty(message = "{category.description.notempty}")
  @Size(max = 10000, message = "{category.description.max10000}")
  private String categoryDescription;

  @NotEmpty(message = "{category.path.notempty}")
  @Pattern(regexp = "^[a-zA-Z0-9-_]*$", message = "{category.path.invalidformat}")
  @Size(max = 100, message = "{category.path.max100}")
  private String categoryPath;

}

