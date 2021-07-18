package com.iwaodev.ui.criteria.shipping;

import javax.validation.constraints.*;

import org.springframework.validation.annotation.Validated;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Validated
public class RatingCriteria {

  @NotNull(message = "{rating.parcelWeight.notnull}")
  @Digits(integer = 6, fraction = 3, message = "{rating.parcelWeight.invalidformat}")
  @DecimalMin(value = "0.01", message = "{rating.variantWeight.min001}", inclusive = true)
  private Double parcelWeight;

  @NotEmpty(message = "{rating.destinationPostalCode.notempty}")
  @Size(max = 20, message = "{rating.destinationPostalCode.max20}")
  private String destinationPostalCode;
}



