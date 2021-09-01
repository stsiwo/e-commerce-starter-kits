package com.iwaodev.ui.criteria.statistic;

import com.iwaodev.domain.statistic.SaleBaseEnum;
import lombok.*;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.YearMonth;

@ToString
@Data
@NoArgsConstructor
public class SaleQueryStringCriteria {
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
