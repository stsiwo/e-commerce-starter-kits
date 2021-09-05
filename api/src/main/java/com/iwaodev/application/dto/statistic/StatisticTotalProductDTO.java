package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.ZonedDateTime;

@NoArgsConstructor
@Data
@ToString
public class StatisticTotalProductDTO {

    private ZonedDateTime name;

    private Integer products;

    public StatisticTotalProductDTO(ZonedDateTime name, Integer products) {
        this.name = name;
        this.products = products;
    }
}
