package com.iwaodev.infrastructure.query;

import com.iwaodev.application.dto.statistic.SaleDTO;
import com.iwaodev.application.iquery.StatisticQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * tricky thing is to get a list of every hour/date/month between startDate and endDate even if there is no records for a given date.
 *
 * use this ref: reference: https://stackoverflow.com/questions/9295616/how-to-get-list-of-dates-between-two-dates-in-mysql-select-query
 *
 *
 * note: this return a single SaleDTO if start date (e.g., year, month, day) is same as end date, so the start date should be start previous date.
 */

@Component
public class StatisticQueryImpl implements StatisticQuery {

    private static final Logger logger = LoggerFactory.getLogger(StatisticQueryImpl.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<SaleDTO> getHourlySale(LocalDateTime startDate, LocalDateTime endDate) {

        String query = "select " +
                "name, sum(ifnull(o.product_cost + o.tax_cost + o.shipping_cost, 0)) as value from " +
                "(select adddate(:startDate, interval t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i hour) name from  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v " +
                "left join orders o on extract(day_hour from o.created_at) = extract(day_hour from name) " +
                "where name between :startDate and :endDate " +
                "group by name;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();

        logger.debug("size of hourly sale data");
        logger.debug("" + result.size());


        return this.convertToSaleDTO(result);

    }

    /**
     * used to convert raw object to non-entity class (e.g., SaleDTO).
     *
     * You cannot use 'this.entityManager.createNativeQuery(query, Entity.class) since this is not entity.
     * @param target
     * @return
     */
    private List<SaleDTO> convertToSaleDTO(List<Object[]> target) {
        List<SaleDTO> saleDtoList = target.stream().map(object -> {
            logger.debug("converting to saleDTO");
            return new SaleDTO(
                    (LocalDateTime) LocalDateTime.parse((String) object[0], DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                    (BigDecimal) object[1]
            );
        }).collect(Collectors.toList());

        return saleDtoList;
    }

    @Override
    public List<SaleDTO> getDailySale(LocalDateTime startDate, LocalDateTime endDate) {

        String query = "select " +
                "date_format(name, '%Y-%m-%d %H:%i:%s'), sum(ifnull(o.product_cost + o.tax_cost + o.shipping_cost, 0)) value from  " +
                "(select adddate(:startDate, interval t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i day) name from  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v " +
                "left join orders o on date(o.created_at) = name " + // since this is daily based so only compare year & month & day
                "where name between :startDate and :endDate " +
                "group by name;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();

        return this.convertToSaleDTO(result);
    }

    @Override
    public List<SaleDTO> getMonthlySale(LocalDateTime startDate, LocalDateTime endDate) {

        String query = "select " +
                "date_format(name, '%Y-%m-%d %H:%i:%s'), sum(ifnull(o.product_cost + o.tax_cost + o.shipping_cost, 0)) value from  " +
                "(select adddate(:startDate, interval t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i month) name from  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v " +
                "left join orders o on extract(year_month from date(o.created_at)) = extract(year_month from name) " + // since this is monthly base so only compare year & month only
                "where name between :startDate and :endDate " +
                "group by name;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();

        return this.convertToSaleDTO(result);

    }
}
