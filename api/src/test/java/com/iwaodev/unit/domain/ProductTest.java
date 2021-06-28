package com.iwaodev.unit.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.iwaodev.application.iservice.PaymentService;
import com.iwaodev.domain.order.OrderRule;
import com.iwaodev.domain.order.OrderStatusEnum;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.exception.OutOfStockException;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderDetail;
import com.iwaodev.infrastructure.model.OrderEvent;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductVariant;
import com.iwaodev.ui.criteria.order.OrderAddressCriteria;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("unittest")
public class ProductTest {

  private static final Logger logger = LoggerFactory.getLogger(ProductTest.class);

  @Test
  public void shouldAddSoldCountForVariantSuccessfullyWhenAddSoldCountForVariant() throws Exception {

    // arrange
    int dummySoldCount = 3;
    Product product = new Product();
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(1L);
    product.addVariant(variant1);

    // act
    product.addSoldCountForVariant(dummySoldCount, variant1.getVariantId());

    // assert
    assertThat(variant1.getSoldCount()).isEqualTo(dummySoldCount);
  }

  @Test
  public void shouldReturnVariantSuccessfullyWhenFindVariantById() throws Exception {

    // arrange
    Long dummyVariantId = 2L;
    Product product = new Product();
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(1L);
    ProductVariant variant2 = new ProductVariant();
    variant2.setVariantId(dummyVariantId);

    product.addVariant(variant1);
    product.addVariant(variant2);

    // act
    // assert
    assertThat(product.findVariantById(dummyVariantId)).isEqualTo(variant2);
  }

  @Test
  public void shouldReturnVariantDiscountPriceSuccessfullyWhenGetCurrentPriceOfVariant() throws Exception {

    // arrange
    Long dummyVariantId = 1L;
    BigDecimal dummyPrice = new BigDecimal(100);
    Product product = new Product();
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariantId);
    variant1.setIsDiscount(true);
    variant1.setVariantDiscountPrice(dummyPrice);
    variant1.setVariantDiscountStartDate(LocalDateTime.of(2020, 6, 10, 0, 0, 0));
    variant1.setVariantDiscountEndDate(LocalDateTime.of(2022, 6, 10, 0, 0, 0));

    product.addVariant(variant1);

    // act
    // assert
    assertThat(product.getCurrentPriceOfVariant(dummyVariantId)).isEqualTo(dummyPrice);
  }

  @Test
  public void shouldReturnVariantUnitPriceSuccessfullyWhenGetCurrentPriceOfVariant() throws Exception {

    // arrange
    Long dummyVariantId = 1L;
    BigDecimal dummyPrice = new BigDecimal(200);
    Product product = new Product();
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariantId);
    variant1.setVariantUnitPrice(dummyPrice);

    product.addVariant(variant1);

    // act
    // assert
    assertThat(product.getCurrentPriceOfVariant(dummyVariantId)).isEqualTo(dummyPrice);
  }

  @Test
  public void shouldReturnProductDiscountPriceSuccessfullyWhenGetCurrentPriceOfVariant() throws Exception {

    // arrange
    Long dummyVariantId = 1L;
    BigDecimal dummyPrice = new BigDecimal(300);
    Product product = new Product();
    product.setProductBaseUnitPrice(new BigDecimal(400));
    product.setIsDiscount(true);
    product.setProductBaseDiscountStartDate(LocalDateTime.of(2020, 6, 10, 0, 0, 0));
    product.setProductBaseDiscountEndDate(LocalDateTime.of(2022, 6, 10, 0, 0, 0));
    product.setProductBaseDiscountPrice(dummyPrice);
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariantId);

    product.addVariant(variant1);

    // act
    // assert
    assertThat(product.getCurrentPriceOfVariant(dummyVariantId)).isEqualTo(dummyPrice);
  }

  @Test
  public void shouldReturnProductBaseUnitPriceSuccessfullyWhenGetCurrentPriceOfVariant() throws Exception {

    // arrange
    Long dummyVariantId = 1L;
    BigDecimal dummyPrice = new BigDecimal(500);
    Product product = new Product();
    product.setProductBaseUnitPrice(dummyPrice);
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariantId);

    product.addVariant(variant1);

    // act
    // assert
    assertThat(product.getCurrentPriceOfVariant(dummyVariantId)).isEqualTo(dummyPrice);
  }

  @Test
  public void shouldDecreaseSuccessfullyWhenDecreaseStockOfVariant() throws Exception {

    // arrange
    Long dummyVariantId = 1L;
    int dummyOriginalStock = 10;
    int dummyStockToDecrease = 3;
    BigDecimal dummyPrice = new BigDecimal(500);
    Product product = new Product();
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariantId);
    variant1.setVariantStock(dummyOriginalStock);

    product.addVariant(variant1);

    // act
    product.decreaseStockOfVariant(dummyStockToDecrease, dummyVariantId);

    // assert
    assertThat(variant1.getVariantStock()).isEqualTo((dummyOriginalStock - dummyStockToDecrease));
  }

  @Test
  public void shouldThrowNotFoundExceptionWhenDecreaseStockOfVariant() throws Exception {

    // arrange
    Long dummyVariantId = 1L;
    Long invalidVariantId = 2L;
    int dummyOriginalStock = 10;
    int dummyStockToDecrease = 3;
    BigDecimal dummyPrice = new BigDecimal(500);
    Product product = new Product();
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariantId);
    variant1.setVariantStock(dummyOriginalStock);

    product.addVariant(variant1);

    // act
    // assert
    assertThatThrownBy(() -> {
      product.decreaseStockOfVariant(dummyStockToDecrease, invalidVariantId);
    }).isInstanceOf(NotFoundException.class).isNotNull();
  }

  @Test
  public void shouldThrowOutOfStockExceptionWhenDecreaseStockOfVariant() throws Exception {

    // arrange
    Long dummyVariantId = 1L;
    int dummyOriginalStock = 10;
    int dummyStockToDecrease = 20;
    BigDecimal dummyPrice = new BigDecimal(500);
    Product product = new Product();
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariantId);
    variant1.setVariantStock(dummyOriginalStock);

    product.addVariant(variant1);

    // act
    // assert
    assertThatThrownBy(() -> {
      product.decreaseStockOfVariant(dummyStockToDecrease, dummyVariantId);
    }).isInstanceOf(OutOfStockException.class).isNotNull();
  }

  @Test
  public void shouldIncreaseSuccessfullyWhenIncreaseStockOfVariant() throws Exception {

    // arrange
    Long dummyVariantId = 1L;
    int dummyOriginalStock = 10;
    int dummyStockToIncrease = 3;
    BigDecimal dummyPrice = new BigDecimal(500);
    Product product = new Product();
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariantId);
    variant1.setVariantStock(dummyOriginalStock);

    product.addVariant(variant1);

    // act
    product.increaseStockOfVariantBack(dummyStockToIncrease, dummyVariantId);

    // assert
    assertThat(variant1.getVariantStock()).isEqualTo((dummyOriginalStock + dummyStockToIncrease));
  }

  @Test
  public void shouldThrowNotFoundExceptionWhenIncreaseStockOfVariant() throws Exception {

    // arrange
    Long dummyVariantId = 1L;
    Long invalidVariantId = 2L;
    int dummyOriginalStock = 10;
    int dummyStockToIncrease = 3;
    BigDecimal dummyPrice = new BigDecimal(500);
    Product product = new Product();
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariantId);
    variant1.setVariantStock(dummyOriginalStock);

    product.addVariant(variant1);

    // act
    // assert
    assertThatThrownBy(() -> {
      product.increaseStockOfVariantBack(dummyStockToIncrease, invalidVariantId);
    }).isInstanceOf(NotFoundException.class).isNotNull();
  }

  // cheapest price testing
  @Test
  public void shouldReturnProductBaseUnitPriceForCheapestPrice() throws Exception {

    // arrange
    
    // product 
    Product product = new Product();
    product.setProductBaseUnitPrice(new BigDecimal(100));
    
    // variant 1
    Long dummyVariant1Id = 1L;
    BigDecimal dummyPrice1 = new BigDecimal(500);
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariant1Id);
    variant1.setVariantUnitPrice(dummyPrice1);

    product.addVariant(variant1);

    // variant 2
    Long dummyVariant2Id = 2L;
    BigDecimal dummyPrice2 = new BigDecimal(600);
    ProductVariant variant2 = new ProductVariant();
    variant2.setVariantId(dummyVariant2Id);
    variant2.setVariantUnitPrice(dummyPrice2);

    product.addVariant(variant2);

    // act
    BigDecimal actualResult = product.getCheapestPrice();
    
    // assert
    assertThat(actualResult).isEqualTo(new BigDecimal(100));
  }

  @Test
  public void shouldReturnVariantUnitPriceForCheapestPrice() throws Exception {

    // arrange
    
    // product 
    Product product = new Product();
    product.setProductBaseUnitPrice(new BigDecimal(1000));
    
    // variant 1
    Long dummyVariant1Id = 1L;
    BigDecimal dummyPrice1 = new BigDecimal(500);
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariant1Id);
    variant1.setVariantUnitPrice(dummyPrice1);

    product.addVariant(variant1);

    // variant 2
    Long dummyVariant2Id = 2L;
    BigDecimal dummyPrice2 = new BigDecimal(600);
    ProductVariant variant2 = new ProductVariant();
    variant2.setVariantId(dummyVariant2Id);
    variant2.setVariantUnitPrice(dummyPrice2);

    product.addVariant(variant2);

    // act
    BigDecimal actualResult = product.getCheapestPrice();
    
    // assert
    assertThat(actualResult).isEqualTo(dummyPrice1);
  }

  @Test
  public void shouldReturnProductBaseDiscountPriceForCheapestPrice() throws Exception {

    // arrange
    
    // product 
    Product product = new Product();
    product.setProductBaseUnitPrice(new BigDecimal(1000));
    product.setIsDiscount(true);
    product.setProductBaseDiscountStartDate(LocalDateTime.of(2020, 6, 10, 0, 0, 0));
    product.setProductBaseDiscountEndDate(LocalDateTime.of(2022, 6, 10, 0, 0, 0));
    product.setProductBaseDiscountPrice(new BigDecimal(300));
    
    // variant 1
    Long dummyVariant1Id = 1L;
    BigDecimal dummyPrice1 = new BigDecimal(500);
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariant1Id);
    variant1.setVariantUnitPrice(dummyPrice1);

    product.addVariant(variant1);

    // variant 2
    Long dummyVariant2Id = 2L;
    BigDecimal dummyPrice2 = new BigDecimal(600);
    ProductVariant variant2 = new ProductVariant();
    variant2.setVariantId(dummyVariant2Id);
    variant2.setVariantUnitPrice(dummyPrice2);

    product.addVariant(variant2);

    // act
    BigDecimal actualResult = product.getCheapestPrice();
    
    // assert
    assertThat(actualResult).isEqualTo(new BigDecimal(300));
  }

  @Test
  public void shouldReturnVariantDiscountPriceForCheapestPrice() throws Exception {

    // arrange
    
    // product 
    Product product = new Product();
    product.setProductBaseUnitPrice(new BigDecimal(1000));
    
    // variant 1
    Long dummyVariant1Id = 1L;
    BigDecimal dummyPrice1 = new BigDecimal(500);
    ProductVariant variant1 = new ProductVariant();
    variant1.setVariantId(dummyVariant1Id);
    variant1.setVariantUnitPrice(dummyPrice1);
    variant1.setIsDiscount(true);
    variant1.setVariantDiscountStartDate(LocalDateTime.of(2020, 6, 10, 0, 0, 0));
    variant1.setVariantDiscountEndDate(LocalDateTime.of(2022, 6, 10, 0, 0, 0));
    variant1.setVariantDiscountPrice(new BigDecimal(300));

    product.addVariant(variant1);

    // variant 2
    Long dummyVariant2Id = 2L;
    BigDecimal dummyPrice2 = new BigDecimal(600);
    ProductVariant variant2 = new ProductVariant();
    variant2.setVariantId(dummyVariant2Id);
    variant2.setVariantUnitPrice(dummyPrice2);

    product.addVariant(variant2);

    // act
    BigDecimal actualResult = product.getCheapestPrice();
    
    // assert
    assertThat(actualResult).isEqualTo(new BigDecimal(300));
  }
}
