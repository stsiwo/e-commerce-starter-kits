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
import java.util.List;

@Service
@Transactional
public class StatisticServiceImpl implements StatisticService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticServiceImpl.class);

    @Autowired
    private StatisticQuery statisticQuery;

    public List<SaleDTO> getSales(SaleQueryStringCriteria criteria) throws Exception {

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

    @Override
    public List<StatisticUserDTO> getUsers(StatisticUserQueryStringCriteria criteria) throws Exception {
        List<StatisticUserDTO> result;

        LocalDateTime startDate = LocalDateTime.of(criteria.getStartYear(), criteria.getStartMonth(), criteria.getStartDate(), 0, 0);
        LocalDateTime endDate = LocalDateTime.of(criteria.getEndYear(), criteria.getEndMonth(), criteria.getEndDate(), LocalDateTime.now().getHour(), LocalDateTime.now().getMinute());

        UserBaseEnum userBase = this.determineUserBase(criteria.getStartYear(), criteria.getStartMonth(), criteria.getStartDate(), criteria.getEndYear(), criteria.getEndMonth(), criteria.getEndDate());

        if (userBase.equals(UserBaseEnum.HOURLY)) {
            logger.debug("hourly based");
            result = this.statisticQuery.getHourlyUser(startDate, endDate);
        } else if (userBase.equals(UserBaseEnum.DAILY)) {
            logger.debug("daily based");
            result = this.statisticQuery.getDailyUser(startDate, endDate);
        } else {
            logger.debug("monthly based");
            result = this.statisticQuery.getMonthlyUser(startDate, endDate);
        }

        return result;
    }

    @Override
    public List<StatisticTotalSaleDTO> getTotalSales(StatisticTotalSaleQueryStringCriteria criteria) throws Exception {

        List<StatisticTotalSaleDTO> result;
        TotalSaleBaseEnum base = criteria.getBase();

        if (base.equals(TotalSaleBaseEnum.TODAY)) {
            logger.debug("today base");
            result = this.statisticQuery.getTodayTotalSales();
        } else if (base.equals(TotalSaleBaseEnum.THIS_MONTH)) {
            logger.debug("month base");
            result = this.statisticQuery.getThisMonthTotalSales();
        } else {
            logger.debug("year base");
            result = this.statisticQuery.getThisYearTotalSales();
        }

        return result;
    }

    @Override
    public List<StatisticTotalUserDTO> getTotalUsers(StatisticTotalUserQueryStringCriteria criteria) throws Exception {
        List<StatisticTotalUserDTO> result;
        TotalUserBaseEnum base = criteria.getBase();

        if (base.equals(TotalUserBaseEnum.TODAY)) {
            logger.debug("today base");
            result = this.statisticQuery.getTodayTotalUsers();
        } else if (base.equals(TotalUserBaseEnum.THIS_MONTH)) {
            logger.debug("month base");
            result = this.statisticQuery.getThisMonthTotalUsers();
        } else {
            logger.debug("year base");
            result = this.statisticQuery.getThisYearTotalUsers();
        }

        return result;
    }

    @Override
    public List<StatisticTotalProductDTO> getTotalProducts(StatisticTotalProductQueryStringCriteria criteria) throws Exception {
        List<StatisticTotalProductDTO> result;
        TotalProductBaseEnum base = criteria.getBase();

        if (base.equals(TotalProductBaseEnum.TODAY)) {
            logger.debug("today base");
            result = this.statisticQuery.getTodayTotalProducts();
        } else if (base.equals(TotalProductBaseEnum.THIS_MONTH)) {
            logger.debug("month base");
            result = this.statisticQuery.getThisMonthTotalProducts();
        } else {
            logger.debug("year base");
            result = this.statisticQuery.getThisYearTotalProducts();
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
