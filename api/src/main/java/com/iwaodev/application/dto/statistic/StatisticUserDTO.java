package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@ToString
public class StatisticUserDTO {
    private LocalDateTime name;

    private Integer users;

    public StatisticUserDTO(LocalDateTime name, Integer value) {
        this.name = name;
        this.users = value;
    }
}
