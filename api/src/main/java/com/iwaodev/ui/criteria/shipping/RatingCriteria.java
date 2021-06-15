package com.iwaodev.ui.criteria.shipping;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

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

  @NotNull(message = "parcel weight can not be null.")
  @Min(value = 0, message = "The value must be greater than or equal 0")
  private Double parcelWeight;

  @NotNull(message = "destination postal code must not be null.")
  private String destinationPostalCode;
}



