package com.iwaodev.application.iquery;

import com.iwaodev.application.dto.statistic.SaleDTO;

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
}
