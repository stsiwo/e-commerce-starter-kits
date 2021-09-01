package com.iwaodev.ui.criteria.statistic;

import com.iwaodev.domain.statistic.TotalSaleBaseEnum;
import com.iwaodev.domain.statistic.TotalUserBaseEnum;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
public class StatisticTotalUserQueryStringCriteria {
    /**
     * set default value for each query param
     */
    private TotalUserBaseEnum base = TotalUserBaseEnum.TODAY;
}
