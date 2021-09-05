package com.iwaodev.ui.criteria.statistic;

import com.google.common.base.Strings;
import com.iwaodev.domain.statistic.SaleBaseEnum;
import com.iwaodev.ui.controller.StatisticController;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.*;
import java.util.TimeZone;

@ToString
@Data
@NoArgsConstructor
public class SaleQueryStringCriteria {

    private static final Logger logger = LoggerFactory.getLogger(SaleQueryStringCriteria.class);
    /**
     * set default value for each query param
     */
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startDate = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonthValue(), LocalDateTime.now().getDayOfMonth(), 0, 0, 0);

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endDate = LocalDateTime.now();

    //private Integer startYear = LocalDate.now().getYear();
    //private Integer startMonth = LocalDate.now().getMonthValue();
    //private Integer startDate = LocalDate.now().getDayOfMonth();
    //private Integer endYear = LocalDate.now().getYear();
    //private Integer endMonth = LocalDate.now().getMonthValue();
    //private Integer endDate = LocalDate.now().getDayOfMonth();

    //public void setUp() {

    //    if (Strings.isNullOrEmpty(this.timeZone)) {
    //        this.timeZone = "UTC";
    //    }

    //    logger.debug("start year query: ");
    //    logger.debug("" + this.startYear);

    //    if (this.startYear == null){
    //        this.startYear = ZonedDateTime.now(ZoneId.of(this.timeZone)).getYear();
    //    }
    //    if (this.startMonth == null) {
    //        this.startMonth = ZonedDateTime.now(ZoneId.of(this.timeZone)).getMonthValue();
    //    }
    //    if (this.startDate == null) {
    //        this.startDate = ZonedDateTime.now(ZoneId.of(this.timeZone)).getDayOfMonth();
    //    }
    //    if (this.endYear == null) {
    //        this.endYear = ZonedDateTime.now(ZoneId.of(this.timeZone)).getYear();
    //    }
    //    if (this.endMonth == null) {
    //        this.endMonth = ZonedDateTime.now(ZoneId.of(this.timeZone)).getMonthValue();
    //    }
    //    if (this.endDate == null) {
    //        this.endDate = ZonedDateTime.now(ZoneId.of(this.timeZone)).getDayOfMonth();
    //    }
    //}
}
