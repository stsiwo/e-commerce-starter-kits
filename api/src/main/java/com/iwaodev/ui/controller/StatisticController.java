package com.iwaodev.ui.controller;

import com.iwaodev.application.dto.category.CategoryDTO;
import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.dto.statistic.*;
import com.iwaodev.application.iservice.CategoryService;
import com.iwaodev.application.iservice.StatisticService;
import com.iwaodev.config.SpringSecurityUser;
import com.iwaodev.domain.category.CategorySortEnum;
import com.iwaodev.ui.criteria.category.CategoryQueryStringCriteria;
import com.iwaodev.ui.criteria.statistic.*;
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
    public ResponseEntity<List<SaleDTO>> getSales(
            SaleQueryStringCriteria criteria) throws Exception {
        List<SaleDTO> data = this.service.getSales(criteria);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/statistics/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<StatisticUserDTO>> getUsers(
            StatisticUserQueryStringCriteria criteria) throws Exception {
        List<StatisticUserDTO> data = this.service.getUsers(criteria);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/statistics/total/sales")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<StatisticTotalSaleDTO>> getUsers(
            StatisticTotalSaleQueryStringCriteria criteria) throws Exception {
        List<StatisticTotalSaleDTO> data = this.service.getTotalSales(criteria);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/statistics/total/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<StatisticTotalUserDTO>> getUsers(
            StatisticTotalUserQueryStringCriteria criteria) throws Exception {
        List<StatisticTotalUserDTO> data = this.service.getTotalUsers(criteria);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/statistics/total/products")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<StatisticTotalProductDTO>> getProducts(
            StatisticTotalProductQueryStringCriteria criteria) throws Exception {
        List<StatisticTotalProductDTO> data = this.service.getTotalProducts(criteria);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/statistics/top/products")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<StatisticTopProductDTO>> getProducts(
            StatisticTopProductQueryStringCriteria criteria) throws Exception {
        List<StatisticTopProductDTO> data = this.service.getTopProducts(criteria);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/statistics/top/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<StatisticTopUserDTO>> getUsers(
            StatisticTopUserQueryStringCriteria criteria) throws Exception {
        List<StatisticTopUserDTO> data = this.service.getTopUsers(criteria);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
