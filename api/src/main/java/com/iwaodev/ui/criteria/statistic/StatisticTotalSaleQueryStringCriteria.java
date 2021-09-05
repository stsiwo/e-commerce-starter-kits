package com.iwaodev.ui.criteria.statistic;

import com.iwaodev.domain.statistic.TotalSaleBaseEnum;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@ToString
@Data
@NoArgsConstructor
public class StatisticTotalSaleQueryStringCriteria {
    /**
     * set default value for each query param
     */
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startDate = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonthValue(), LocalDateTime.now().getDayOfMonth(), 0, 0, 0);

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endDate = LocalDateTime.now();

    private TotalSaleBaseEnum base = TotalSaleBaseEnum.TODAY;
}
