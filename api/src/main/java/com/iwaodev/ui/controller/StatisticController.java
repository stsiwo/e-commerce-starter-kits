package com.iwaodev.ui.controller;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.dto.statistic.SaleDTO;
import com.iwaodev.application.iservice.CategoryService;
import com.iwaodev.application.iservice.StatisticService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.domain.category.CategorySortEnum;
import com.iwaodev.ui.criteria.category.CategoryQueryStringCriteria;
import com.iwaodev.ui.criteria.statistic.SaleQueryStringCriteria;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class StatisticController {

    private static final Logger logger = LoggerFactory.getLogger(StatisticController.class);

    @Autowired
    private StatisticService service;

    /**
     *
     * @param criteria
     * @return
     * @throws Exception
     */
    @GetMapping("/statistics/sales")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<SaleDTO>> get(
            SaleQueryStringCriteria criteria) throws Exception {

        logger.debug("criteria query params");
        logger.debug(criteria.toString());
        List<SaleDTO> data = this.service.getSale(criteria);

        logger.debug("response data");
        logger.debug(data.toString());



        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
