package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@ToString
public class StatisticTotalProductDTO {

    private LocalDateTime name;

    private Integer products;

    public StatisticTotalProductDTO(LocalDateTime name, Integer products) {
        this.name = name;
        this.products = products;
    }
}
