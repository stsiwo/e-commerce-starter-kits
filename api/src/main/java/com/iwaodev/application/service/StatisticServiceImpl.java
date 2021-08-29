package com.iwaodev.application.service;

import com.iwaodev.application.dto.statistic.SaleDTO;
import com.iwaodev.application.iquery.StatisticQuery;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.application.iservice.StatisticService;
import com.iwaodev.domain.statistic.SaleBaseEnum;
import com.iwaodev.infrastructure.query.StatisticQueryImpl;
import com.iwaodev.ui.criteria.statistic.SaleQueryStringCriteria;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class StatisticServiceImpl implements StatisticService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticServiceImpl.class);

    @Autowired
    private StatisticQuery statisticQuery;

    @Override
    public List<SaleDTO> getSale(SaleQueryStringCriteria criteria) throws Exception {

        List<SaleDTO> result;

        LocalDateTime startDate = LocalDateTime.of(criteria.getStartYear(), criteria.getStartMonth(), criteria.getStartDate(), 0, 0);
        LocalDateTime endDate = LocalDateTime.of(criteria.getEndYear(), criteria.getEndMonth(), criteria.getEndDate(), LocalDateTime.now().getHour(), LocalDateTime.now().getMinute());

        SaleBaseEnum saleBase = this.determineSaleBase(criteria.getStartYear(), criteria.getStartMonth(), criteria.getStartDate(), criteria.getEndYear(), criteria.getEndMonth(), criteria.getEndDate());

        if (saleBase.equals(SaleBaseEnum.HOURLY)) {
            logger.debug("hourly based");
            result = this.statisticQuery.getHourlySale(startDate, endDate);
        } else if (saleBase.equals(SaleBaseEnum.DAILY)) {
            logger.debug("daily based");
            result = this.statisticQuery.getDailySale(startDate, endDate);
        } else {
            logger.debug("monthly based");
            result = this.statisticQuery.getMonthlySale(startDate, endDate);
        }

        return result;
    }

    /**
     * duration base.
     *
     * follow the rules below:
     *
     * 1. if start date and end date (esp date) are same, it is hourly base.
     * 2. if start month and end month are same, it is hourly base.
     * 3. if start month and end month are different, it is daily base.
     * 4. if start year and end year are different, it is month base.
     */
    private SaleBaseEnum determineSaleBase(Integer startYear, Integer startMonth, Integer startDate, Integer endYear, Integer endMonth, Integer endDate) {

        if (startYear.equals(endYear) && startMonth.equals(endMonth)) {
            return SaleBaseEnum.HOURLY;
        } else if (startYear.equals(endYear) && !startMonth.equals(endMonth)) {
            return SaleBaseEnum.DAILY;
        } else {
            return SaleBaseEnum.MONTHLY;
        }
    }
}
