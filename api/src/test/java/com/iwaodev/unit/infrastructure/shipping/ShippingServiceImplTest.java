package com.iwaodev.unit.infrastructure.shipping;

import static org.assertj.core.api.Assertions.assertThat;

import com.iwaodev.application.iservice.ShippingService;
import com.iwaodev.infrastructure.shipping.schema.rating.PriceQuotes;
import com.iwaodev.ui.criteria.shipping.RatingCriteria;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("unittest")
public class ShippingServiceImplTest {

  private static final Logger logger = LoggerFactory.getLogger(ShippingServiceImplTest.class);

  @Autowired
  private ShippingService shippingService;

  @Test
  public void shouldReturnPriceQuotesAtRating() throws Exception {

    // arrange 
    RatingCriteria criteria = new RatingCriteria(1D, "V5R2C2");
    
    // act
    PriceQuotes priceQuotes = this.shippingService.getRating(criteria);
    
    // assert
    assertThat(priceQuotes).isNotNull(); 
  }
}
