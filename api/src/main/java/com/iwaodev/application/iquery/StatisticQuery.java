package com.iwaodev.application.iquery;

import com.iwaodev.application.dto.statistic.*;

import java.time.LocalDateTime;
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

    public List<StatisticTotalSaleDTO> getTodayTotalSales();
    public List<StatisticTotalSaleDTO> getThisMonthTotalSales();
    public List<StatisticTotalSaleDTO> getThisYearTotalSales();

    public List<StatisticTotalUserDTO> getTodayTotalUsers();
    public List<StatisticTotalUserDTO> getThisMonthTotalUsers();
    public List<StatisticTotalUserDTO> getThisYearTotalUsers();

    public List<StatisticTotalProductDTO> getTodayTotalProducts();
    public List<StatisticTotalProductDTO> getThisMonthTotalProducts();
    public List<StatisticTotalProductDTO> getThisYearTotalProducts();

    public List<StatisticTopProductDTO> getTopProducts();
    public List<StatisticTopUserDTO> getTopUsers();

}
