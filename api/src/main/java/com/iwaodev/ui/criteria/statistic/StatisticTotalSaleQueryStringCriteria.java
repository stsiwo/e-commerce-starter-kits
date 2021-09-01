package com.iwaodev.ui.criteria.statistic;

import com.iwaodev.domain.statistic.TotalSaleBaseEnum;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@ToString
@Data
@NoArgsConstructor
public class StatisticTotalSaleQueryStringCriteria {
    /**
     * set default value for each query param
     */
    private TotalSaleBaseEnum base = TotalSaleBaseEnum.TODAY;
}
