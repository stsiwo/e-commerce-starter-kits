package com.iwaodev.application.dto.shipping;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Data
@ToString
public class RatingDTO {

  private BigDecimal estimatedShippingCost;

  private LocalDateTime expectedDeliveryDate;

}

