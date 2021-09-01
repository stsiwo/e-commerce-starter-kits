package com.iwaodev.ui.criteria.statistic;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@ToString
@Data
@NoArgsConstructor
public class StatisticUserQueryStringCriteria {
    /**
     * set default value for each query param
     */
    private Integer startYear = LocalDate.now().getYear();
    private Integer startMonth = LocalDate.now().getMonthValue();
    private Integer startDate = LocalDate.now().getDayOfMonth();
    private Integer endYear = LocalDate.now().getYear();
    private Integer endMonth = LocalDate.now().getMonthValue();
    private Integer endDate = LocalDate.now().getDayOfMonth();
}
