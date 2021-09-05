package com.iwaodev.application.iservice;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.statistic.*;
import com.iwaodev.ui.criteria.category.CategoryCriteria;
import com.iwaodev.ui.criteria.statistic.*;

import java.time.LocalDateTime;
import java.util.List;

public interface StatisticService {
    public List<SaleDTO> getSales(SaleQueryStringCriteria criteria) throws Exception;
    public List<StatisticUserDTO> getUsers(StatisticUserQueryStringCriteria criteria) throws Exception;
    public List<StatisticTotalSaleDTO> getTotalSales(StatisticTotalSaleQueryStringCriteria criteria) throws Exception;
    public List<StatisticTotalUserDTO> getTotalUsers(StatisticTotalUserQueryStringCriteria criteria) throws Exception;
    public List<StatisticTotalProductDTO> getTotalProducts(StatisticTotalProductQueryStringCriteria criteria) throws Exception;
    public List<StatisticTopProductDTO> getTopProducts(StatisticTopProductQueryStringCriteria criteria) throws Exception;
    public List<StatisticTopUserDTO> getTopUsers(StatisticTopUserQueryStringCriteria criteria) throws Exception;
}
