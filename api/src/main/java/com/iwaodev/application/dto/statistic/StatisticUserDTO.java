package com.iwaodev.application.dto.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.ZonedDateTime;

@NoArgsConstructor
@Data
@ToString
public class StatisticUserDTO {
    private ZonedDateTime name;

    private Integer users;

    public StatisticUserDTO(ZonedDateTime name, Integer value) {
        this.name = name;
        this.users = value;
    }
}
