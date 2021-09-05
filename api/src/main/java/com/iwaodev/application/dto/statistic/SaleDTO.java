package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@NoArgsConstructor
@Data
@ToString
public class SaleDTO {

    private ZonedDateTime name;

    private BigDecimal value;

    public SaleDTO(ZonedDateTime name, BigDecimal value) {
        this.name = name;
        this.value = value;
    }
}
