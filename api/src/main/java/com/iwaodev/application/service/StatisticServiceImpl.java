package com.iwaodev.application.service;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.statistic.*;
import com.iwaodev.application.iquery.StatisticQuery;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.iservice.StatisticService;
import com.iwaodev.domain.statistic.*;
import com.iwaodev.ui.criteria.statistic.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.TimeZone;

@Service
@Transactional
public class StatisticServiceImpl implements StatisticService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticServiceImpl.class);

    @Autowired
    private StatisticQuery statisticQuery;

    public List<SaleDTO> getSales(SaleQueryStringCriteria criteria) throws Exception {

        List<SaleDTO> result;
        SaleBaseEnum saleBase = this.determineSaleBase(criteria.getStartDate().getYear(), criteria.getStartDate().getMonthValue(), criteria.getStartDate().getDayOfMonth(), criteria.getEndDate().getYear(), criteria.getEndDate().getMonthValue(), criteria.getEndDate().getDayOfMonth());

        if (saleBase.equals(SaleBaseEnum.HOURLY)) {
            logger.debug("hourly based");
            result = this.statisticQuery.getHourlySale(criteria.getStartDate(), criteria.getEndDate());
        } else if (saleBase.equals(SaleBaseEnum.DAILY)) {
            logger.debug("daily based");
            result = this.statisticQuery.getDailySale(criteria.getStartDate(), criteria.getEndDate());
        } else {
            logger.debug("monthly based");
            result = this.statisticQuery.getMonthlySale(criteria.getStartDate(), criteria.getEndDate());
        }

        return result;
    }

    @Override
    public List<StatisticUserDTO> getUsers(StatisticUserQueryStringCriteria criteria) throws Exception {
        List<StatisticUserDTO> result;

        UserBaseEnum userBase = this.determineUserBase(criteria.getStartDate().getYear(), criteria.getStartDate().getMonthValue(), criteria.getStartDate().getDayOfMonth(), criteria.getEndDate().getYear(), criteria.getEndDate().getMonthValue(), criteria.getEndDate().getDayOfMonth());

        if (userBase.equals(UserBaseEnum.HOURLY)) {
            logger.debug("hourly based");
            result = this.statisticQuery.getHourlyUser(criteria.getStartDate(), criteria.getEndDate());
        } else if (userBase.equals(UserBaseEnum.DAILY)) {
            logger.debug("daily based");
            result = this.statisticQuery.getDailyUser(criteria.getStartDate(), criteria.getEndDate());
        } else {
            logger.debug("monthly based");
            result = this.statisticQuery.getMonthlyUser(criteria.getStartDate(), criteria.getEndDate());
        }

        return result;
    }

    @Override
    public List<StatisticTotalSaleDTO> getTotalSales(StatisticTotalSaleQueryStringCriteria criteria) throws Exception {

        List<StatisticTotalSaleDTO> result;
        TotalSaleBaseEnum base = criteria.getBase();

        if (base.equals(TotalSaleBaseEnum.TODAY)) {
            logger.debug("today base");
            result = this.statisticQuery.getTodayTotalSales(criteria.getStartDate(), criteria.getEndDate());
        } else if (base.equals(TotalSaleBaseEnum.THIS_MONTH)) {
            logger.debug("month base");
            result = this.statisticQuery.getThisMonthTotalSales(criteria.getStartDate(), criteria.getEndDate());
        } else {
            logger.debug("year base");
            result = this.statisticQuery.getThisYearTotalSales(criteria.getStartDate(), criteria.getEndDate());
        }

        return result;
    }

    @Override
    public List<StatisticTotalUserDTO> getTotalUsers(StatisticTotalUserQueryStringCriteria criteria) throws Exception {
        List<StatisticTotalUserDTO> result;
        TotalUserBaseEnum base = criteria.getBase();

        if (base.equals(TotalUserBaseEnum.TODAY)) {
            logger.debug("today base");
            result = this.statisticQuery.getTodayTotalUsers(criteria.getStartDate(), criteria.getEndDate());
        } else if (base.equals(TotalUserBaseEnum.THIS_MONTH)) {
            logger.debug("month base");
            result = this.statisticQuery.getThisMonthTotalUsers(criteria.getStartDate(), criteria.getEndDate());
        } else {
            logger.debug("year base");
            result = this.statisticQuery.getThisYearTotalUsers(criteria.getStartDate(), criteria.getEndDate());
        }

        return result;
    }

    @Override
    public List<StatisticTotalProductDTO> getTotalProducts(StatisticTotalProductQueryStringCriteria criteria) throws Exception {
        List<StatisticTotalProductDTO> result;
        TotalProductBaseEnum base = criteria.getBase();

        if (base.equals(TotalProductBaseEnum.TODAY)) {
            logger.debug("today base");
            result = this.statisticQuery.getTodayTotalProducts(criteria.getStartDate(), criteria.getEndDate());
        } else if (base.equals(TotalProductBaseEnum.THIS_MONTH)) {
            logger.debug("month base");
            result = this.statisticQuery.getThisMonthTotalProducts(criteria.getStartDate(), criteria.getEndDate());
        } else {
            logger.debug("year base");
            result = this.statisticQuery.getThisYearTotalProducts(criteria.getStartDate(), criteria.getEndDate());
        }

        return result;
    }

    @Override
    public List<StatisticTopProductDTO> getTopProducts(StatisticTopProductQueryStringCriteria criteria) throws Exception {
        return this.statisticQuery.getTopProducts();
    }

    @Override
    public List<StatisticTopUserDTO> getTopUsers(StatisticTopUserQueryStringCriteria criteria) throws Exception {
        return this.statisticQuery.getTopUsers();
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

        /**
         * TODO: fix this logic.
         *
         * my idea is take the gap between start date and end date then count the gap, and based on the gap, change the base.
         */

        if (startYear.equals(endYear) && startMonth.equals(endMonth)) {
            return SaleBaseEnum.HOURLY;
        } else if (startYear.equals(endYear) && !startMonth.equals(endMonth)) {
            return SaleBaseEnum.DAILY;
        } else {
            return SaleBaseEnum.MONTHLY;
        }
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
    private UserBaseEnum determineUserBase(Integer startYear, Integer startMonth, Integer startDate, Integer endYear, Integer endMonth, Integer endDate) {
        if (startYear.equals(endYear) && startMonth.equals(endMonth)) {
            return UserBaseEnum.HOURLY;
        } else if (startYear.equals(endYear) && !startMonth.equals(endMonth)) {
            return UserBaseEnum.DAILY;
        } else {
            return UserBaseEnum.MONTHLY;
        }
    }
}
