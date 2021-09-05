package com.iwaodev.application.dto.statistic;

import com.iwaodev.domain.statistic.TotalSaleBaseEnum;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@NoArgsConstructor
@Data
@ToString
public class StatisticTotalSaleDTO {

    private ZonedDateTime name;

    private BigDecimal sales;

    public StatisticTotalSaleDTO(ZonedDateTime name, BigDecimal sales) {
        this.name = name;
        this.sales = sales;
    }
}
