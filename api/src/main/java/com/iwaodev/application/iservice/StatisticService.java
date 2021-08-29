package com.iwaodev.application.iservice;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.dto.statistic.SaleDTO;
import com.iwaodev.ui.criteria.category.CategoryCriteria;
import com.iwaodev.ui.criteria.statistic.SaleQueryStringCriteria;

import java.util.List;

public interface StatisticService {
    public List<SaleDTO> getSale(SaleQueryStringCriteria criteria) throws Exception;
}
