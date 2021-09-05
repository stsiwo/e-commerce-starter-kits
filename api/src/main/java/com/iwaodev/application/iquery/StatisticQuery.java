package com.iwaodev.application.iquery;

import com.iwaodev.application.dto.statistic.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

/**
 * query for Statistic data.
 *
 * use this only for reading (never update/remove/add new domain). if so, use Repository
 */
public interface StatisticQuery {

    public List<SaleDTO> getHourlySale(LocalDateTime startDate, LocalDateTime endDate);

    public List<SaleDTO> getDailySale(LocalDateTime startDate, LocalDateTime endDate);

    public List<SaleDTO> getMonthlySale(LocalDateTime startDate, LocalDateTime endDate);

    public List<StatisticUserDTO> getHourlyUser(LocalDateTime startDate, LocalDateTime endDate);

    public List<StatisticUserDTO> getDailyUser(LocalDateTime startDate, LocalDateTime endDate);

    public List<StatisticUserDTO> getMonthlyUser(LocalDateTime startDate, LocalDateTime endDate);

    public List<StatisticTotalSaleDTO> getTodayTotalSales(LocalDateTime startDate, LocalDateTime endDate);
    public List<StatisticTotalSaleDTO> getThisMonthTotalSales(LocalDateTime startDate, LocalDateTime endDate);
    public List<StatisticTotalSaleDTO> getThisYearTotalSales(LocalDateTime startDate, LocalDateTime endDate);

    public List<StatisticTotalUserDTO> getTodayTotalUsers(LocalDateTime startDate, LocalDateTime endDate);
    public List<StatisticTotalUserDTO> getThisMonthTotalUsers(LocalDateTime startDate, LocalDateTime endDate);
    public List<StatisticTotalUserDTO> getThisYearTotalUsers(LocalDateTime startDate, LocalDateTime endDate);

    public List<StatisticTotalProductDTO> getTodayTotalProducts(LocalDateTime startDate, LocalDateTime endDate);
    public List<StatisticTotalProductDTO> getThisMonthTotalProducts(LocalDateTime startDate, LocalDateTime endDate);
    public List<StatisticTotalProductDTO> getThisYearTotalProducts(LocalDateTime startDate, LocalDateTime endDate);

    public List<StatisticTopProductDTO> getTopProducts();
    public List<StatisticTopUserDTO> getTopUsers();

}
