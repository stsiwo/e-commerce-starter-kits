package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@ToString
public class SaleDTO {

    private LocalDateTime name;

    private BigDecimal value;

    public SaleDTO(LocalDateTime name, BigDecimal value) {
        this.name = name;
        this.value = value;
    }
}
