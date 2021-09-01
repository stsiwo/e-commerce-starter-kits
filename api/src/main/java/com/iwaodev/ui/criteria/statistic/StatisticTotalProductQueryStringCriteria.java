package com.iwaodev.ui.criteria.statistic;

import com.iwaodev.domain.statistic.TotalProductBaseEnum;
import com.iwaodev.domain.statistic.TotalUserBaseEnum;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
public class StatisticTotalProductQueryStringCriteria {
    /**
     * set default value for each query param
     */
    private TotalProductBaseEnum base = TotalProductBaseEnum.TODAY;
}
