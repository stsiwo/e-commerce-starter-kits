package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@NoArgsConstructor
@Data
@ToString
public class StatisticTotalUserDTO {

    private ZonedDateTime name;

    private Integer users;

    public StatisticTotalUserDTO(ZonedDateTime name, Integer users) {
        this.name = name;
        this.users = users;
    }
}
