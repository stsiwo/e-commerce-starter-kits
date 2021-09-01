package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@ToString
public class StatisticTotalUserDTO {

    private LocalDateTime name;

    private Integer users;

    public StatisticTotalUserDTO(LocalDateTime name, Integer users) {
        this.name = name;
        this.users = users;
    }
}
