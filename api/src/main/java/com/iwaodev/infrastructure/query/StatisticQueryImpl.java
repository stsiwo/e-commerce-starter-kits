package com.iwaodev.infrastructure.query;

import com.iwaodev.application.dto.statistic.*;
import com.iwaodev.application.iquery.StatisticQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
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
                "left join orders o on extract(day_hour from o.created_at) = extract(day_hour from name) and o.transaction_result = 1 " +
                "where name between :startDate and :endDate " +
                "group by name;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();

        return this.convertToSaleDTO(result);

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
                "left join orders o on date(o.created_at) = name and o.transaction_result = 1 " + // since this is daily based so only compare year & month & day
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
                "left join orders o on extract(year_month from date(o.created_at)) = extract(year_month from name) and o.transaction_result = 1 " + // since this is monthly base so only compare year & month only
                "where name between :startDate and :endDate " +
                "group by name;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();

        return this.convertToSaleDTO(result);

    }

    @Override
    public List<StatisticUserDTO> getHourlyUser(LocalDateTime startDate, LocalDateTime endDate) {
        String query = "select name, count(us.user_id) as users from  " +
                "(select adddate(:startDate, interval t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i hour) name from " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v  " +
                "left join users us on extract(day_hour from us.created_at) = extract(day_hour from name) and year(us.created_at) = year(:startDate)" + // add year condition since sometime this query return data from past years.
                "where name between :startDate and :endDate " +
                "group by name;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();

        logger.debug("size of result");
        logger.debug("" + result.size());

        return this.convertToUserDTO(result);
    }

    @Override
    public List<StatisticUserDTO> getDailyUser(LocalDateTime startDate, LocalDateTime endDate) {
        String query = "select " +
                "date_format(name, '%Y-%m-%d %H:%i:%s'), count(us.user_id) users from  " +
                "(select adddate(:startDate, interval t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i day) name from  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v " +
                "left join users us on date(us.created_at) = name " + // since this is daily based so only compare year & month & day
                "where name between :startDate and :endDate " +
                "group by name;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();

        return this.convertToUserDTO(result);
    }

    @Override
    public List<StatisticUserDTO> getMonthlyUser(LocalDateTime startDate, LocalDateTime endDate) {
        String query = "select " +
                "date_format(name, '%Y-%m-%d %H:%i:%s'), count(us.user_id) users from  " +
                "(select adddate(:startDate, interval t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i month) name from  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,  " +
                "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v " +
                "left join users us on extract(year_month from date(us.created_at)) = extract(year_month from name) " + // since this is monthly base so only compare year & month only
                "where name between :startDate and :endDate " +
                "group by name;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();

        return this.convertToUserDTO(result);
    }

    @Override
    public List<StatisticTotalSaleDTO> getTodayTotalSales() {
        /**
         * need to wrap with date_format() for o.created_at otherwise, you got cast error (String -> timestamp)
         */
        String query = "select date_format(o.created_at, '%Y-%m-%d %H:%i:%s') as name, sum(ifnull(o.product_cost + o.tax_cost + o.shipping_cost, 0)) as sales " +
                "from orders o " +
                "where date(o.created_at) >= curdate() " +
                "and o.transaction_result = 1 " +
                "group by hour(o.created_at), day(o.created_at);";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTotalSaleDTO(result);
    }

    @Override
    public List<StatisticTotalSaleDTO> getThisMonthTotalSales() {
        /**
         * need to wrap with date_format() for o.created_at otherwise, you got cast error (String -> timestamp)
         */
        String query = "select date_format(o.created_at, '%Y-%m-%d %H:%i:%s') as name, sum(ifnull(o.product_cost + o.tax_cost + o.shipping_cost, 0)) as sales " +
                "from orders o " +
                "where month(date(o.created_at)) >= month(curdate()) " +
                "and o.transaction_result = 1 " +
                "group by day(o.created_at);";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTotalSaleDTO(result);
    }

    @Override
    public List<StatisticTotalSaleDTO> getThisYearTotalSales() {
        /**
         * need to wrap with date_format() for o.created_at otherwise, you got cast error (String -> timestamp)
         */
        String query = "select date_format(o.created_at, '%Y-%m-%d %H:%i:%s') as name, sum(ifnull(o.product_cost + o.tax_cost + o.shipping_cost, 0)) as sales " +
                "from orders o " +
                "where year(date(o.created_at)) >= year(curdate()) " +
                "and o.transaction_result = 1 " +
                "group by month(o.created_at);";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTotalSaleDTO(result);
    }

    @Override
    public List<StatisticTotalUserDTO> getTodayTotalUsers() {
        /**
         * need to wrap with date_format() for o.created_at otherwise, you got cast error (String -> timestamp)
         */
        String query = "select date_format(us.created_at, '%Y-%m-%d %H:%i:%s') as name, count(us.user_id) as users " +
                "from users us " +
                "where date(us.created_at) >= curdate() " +
                "group by hour(us.created_at), day(us.created_at);";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTotalUserDTO(result);
    }

    @Override
    public List<StatisticTotalUserDTO> getThisMonthTotalUsers() {
        /**
         * need to wrap with date_format() for o.created_at otherwise, you got cast error (String -> timestamp)
         */
        String query = "select date_format(us.created_at, '%Y-%m-%d %H:%i:%s') as name, count(us.user_id) as users " +
                "from users us " +
                "where month(date(us.created_at)) >= month(curdate()) " +
                "group by day(us.created_at);";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTotalUserDTO(result);
    }

    @Override
    public List<StatisticTotalUserDTO> getThisYearTotalUsers() {
        /**
         * need to wrap with date_format() for o.created_at otherwise, you got cast error (String -> timestamp)
         */
        String query = "select date_format(us.created_at, '%Y-%m-%d %H:%i:%s') as name, count(us.user_id) as users " +
                "from users us " +
                "where year(date(us.created_at)) >= year(curdate()) " +
                "group by month(us.created_at);";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTotalUserDTO(result);
    }

    @Override
    public List<StatisticTotalProductDTO> getTodayTotalProducts() {
        /**
         * need to wrap with date_format() for o.created_at otherwise, you got cast error (String -> timestamp)
         */
        String query = "select date_format(o.created_at, '%Y-%m-%d %H:%i:%s') as name, sum(ifnull(od.product_quantity, 0)) as products " +
                "from orders o " +
                "inner join order_details od on od.order_id = o.order_id " +
                "where date(o.created_at) >= curdate() " +
                "and o.transaction_result = 1 " +
                "group by hour(o.created_at), day(o.created_at);";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        logger.debug("size of today total products");
        logger.debug("" + result.size());

        return this.convertToTotalProductDTO(result);
    }

    @Override
    public List<StatisticTotalProductDTO> getThisMonthTotalProducts() {
        /**
         * need to wrap with date_format() for o.created_at otherwise, you got cast error (String -> timestamp)
         */
        String query = "select date_format(o.created_at, '%Y-%m-%d %H:%i:%s') as name, sum(ifnull(od.product_quantity, 0)) as products " +
                "from orders o " +
                "inner join order_details od on od.order_id = o.order_id " +
                "where month(date(o.created_at)) >= month(curdate()) " +
                "and o.transaction_result = 1 " +
                "group by day(o.created_at);";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTotalProductDTO(result);
    }

    @Override
    public List<StatisticTotalProductDTO> getThisYearTotalProducts() {
        /**
         * need to wrap with date_format() for o.created_at otherwise, you got cast error (String -> timestamp)
         */
        String query = "select date_format(o.created_at, '%Y-%m-%d %H:%i:%s') as name, sum(ifnull(od.product_quantity, 0)) as products " +
                "from orders o " +
                "inner join order_details od on od.order_id = o.order_id " +
                "where year(date(o.created_at)) >= year(curdate()) " +
                "and o.transaction_result = 1 " +
                "group by month(o.created_at);";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTotalProductDTO(result);
    }

    @Override
    public List<StatisticTopProductDTO> getTopProducts() {
        String query = "select " +
                "p.product_id, " +
                "p.product_name, " +
                "(select ipi.product_image_path from products ip inner join product_images ipi on ipi.product_id = ip.product_id where ipi.product_image_name = 'product-image-0' and ip.product_id = p.product_id) product_image_path, " +
                "sum(pv.sold_count) as sold_count " +
                "from products p " +
                "inner join product_variants pv on pv.product_id = p.product_id " +
                "group by p.product_id " +
                "order by sold_count desc " +
                "limit 20;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTopProductDTO(result);
    }

    @Override
    public List<StatisticTopUserDTO> getTopUsers() {
        String query = "select " +
                "u.user_id, " +
                "u.first_name, " +
                "u.last_name, " +
                "u.avatar_image_path, " +
                "sum(ifnull(o.product_cost + o.shipping_cost + o.tax_cost, 0)) total_spend " +
                "from users u " +
                "left join orders o on o.user_id = u.user_id and o.transaction_result = 1 " +
                "where u.user_type_id = 2 " +
                "group by u.user_id " +
                "order by total_spend desc " +
                "limit 20;";

        List<Object[]> result = this.entityManager.createNativeQuery(query)
                .getResultList();

        return this.convertToTopUserDTO(result);
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

    /**
     * used to convert raw object to non-entity class (e.g., StatisticUserDTO).
     *
     * You cannot use 'this.entityManager.createNativeQuery(query, Entity.class) since this is not entity.
     * @param target
     * @return
     */
    private List<StatisticUserDTO> convertToUserDTO(List<Object[]> target) {
        List<StatisticUserDTO> saleDtoList = target.stream().map(object -> {
            return new StatisticUserDTO(
                    (LocalDateTime) LocalDateTime.parse((String) object[0], DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                    (Integer) ((BigInteger) object[1]).intValue()
            );
        }).collect(Collectors.toList());

        return saleDtoList;
    }

    /**
     * used to convert raw object to non-entity class (e.g., StatisticTotalSaleDTO).
     *
     * You cannot use 'this.entityManager.createNativeQuery(query, Entity.class) since this is not entity.
     * @param target
     * @return
     */
    private List<StatisticTotalSaleDTO> convertToTotalSaleDTO(List<Object[]> target) {
        List<StatisticTotalSaleDTO> totalSaleDtoList = target.stream().map(object -> {
            return new StatisticTotalSaleDTO(
                    (LocalDateTime) LocalDateTime.parse((String) object[0], DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                    (BigDecimal) object[1]
            );
        }).collect(Collectors.toList());

        return totalSaleDtoList;
    }

    /**
     * used to convert raw object to non-entity class (e.g., StatisticTotalSaleDTO).
     *
     * You cannot use 'this.entityManager.createNativeQuery(query, Entity.class) since this is not entity.
     * @param target
     * @return
     */
    private List<StatisticTotalUserDTO> convertToTotalUserDTO(List<Object[]> target) {
        List<StatisticTotalUserDTO> totalUserDtoList = target.stream().map(object -> {
            return new StatisticTotalUserDTO(
                    (LocalDateTime) LocalDateTime.parse((String) object[0], DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                    (Integer) ((BigInteger) object[1]).intValue()
            );
        }).collect(Collectors.toList());

        return totalUserDtoList;
    }

    /**
     * used to convert raw object to non-entity class (e.g., StatisticTotalSaleDTO).
     *
     * You cannot use 'this.entityManager.createNativeQuery(query, Entity.class) since this is not entity.
     * @param target
     * @return
     */
    private List<StatisticTotalProductDTO> convertToTotalProductDTO(List<Object[]> target) {
        List<StatisticTotalProductDTO> totalProductDtoList = target.stream().map(object -> {
            return new StatisticTotalProductDTO(
                    (LocalDateTime) LocalDateTime.parse((String) object[0], DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                    /**
                     * this return BigDecimal (not BigInteger)
                     */
                    (Integer) ((BigDecimal) object[1]).intValue()
            );
        }).collect(Collectors.toList());

        return totalProductDtoList;
    }

    /**
     * used to convert raw object to non-entity class (e.g., StatisticTotalSaleDTO).
     *
     * You cannot use 'this.entityManager.createNativeQuery(query, Entity.class) since this is not entity.
     * @param target
     * @return
     */
    private List<StatisticTopProductDTO> convertToTopProductDTO(List<Object[]> target) {
        List<StatisticTopProductDTO> topProductDtoList = target.stream().map(object -> {
            return new StatisticTopProductDTO(
                    (UUID) UUID.fromString(object[0].toString()),
                    (String) object[1], // productName
                    (String) object[2], // primaryProductImage
                    (Integer) ((BigDecimal) object[3]).intValue() // soldCount

            );
        }).collect(Collectors.toList());

        return topProductDtoList;
    }

    /**
     * used to convert raw object to non-entity class (e.g., StatisticTotalSaleDTO).
     *
     * You cannot use 'this.entityManager.createNativeQuery(query, Entity.class) since this is not entity.
     * @param target
     * @return
     */
    private List<StatisticTopUserDTO> convertToTopUserDTO(List<Object[]> target) {
        List<StatisticTopUserDTO> topUserDtoList = target.stream().map(object -> {
            return new StatisticTopUserDTO(
                    (UUID) UUID.fromString(object[0].toString()),
                    (String) object[1], // first name
                    (String) object[2], // last name
                    (String) object[3], // avatar image path
                    (BigDecimal) object[4] // soldCount

            );
        }).collect(Collectors.toList());

        return topUserDtoList;
    }
}
