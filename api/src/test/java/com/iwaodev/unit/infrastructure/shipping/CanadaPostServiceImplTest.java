package com.iwaodev.unit.infrastructure.shipping;

import static org.assertj.core.api.Assertions.assertThat;

import com.iwaodev.application.iservice.CanadaPostService;
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
public class CanadaPostServiceImplTest {

  private static final Logger logger = LoggerFactory.getLogger(CanadaPostServiceImplTest.class);

  @Autowired
  private CanadaPostService canadaPostService;

  @Test
  public void shouldReturnPriceQuotesAtRating() throws Exception {

    // arrange 
    RatingCriteria criteria = new RatingCriteria();
    criteria.setParcelWeight(1D);
    criteria.setDestinationPostalCode("M4W2G8");
    
    // act
    //PriceQuotes priceQuotes = this.canadaPostService.getRating(criteria, "V5R 2C2");
    PriceQuotes priceQuotes = this.canadaPostService.getRating(criteria.getParcelWeight(), criteria.getDestinationPostalCode(), "V5R 2C2");
    
    // assert
    assertThat(priceQuotes).isNotNull(); 
  }

  /**
   * ?? don't experience any throttle limit when send a request twice in a loop.
   *
   * for now, just leave it as it is and if you experience the throttle limit, modify this.
   * @throws Exception
   */
  @Test
  public void shouldReturnSLMMonitorRejectedResponseDueToThrottleLimit() throws Exception {

    // arrange
    RatingCriteria criteria = new RatingCriteria();
    criteria.setParcelWeight(1D);
    criteria.setDestinationPostalCode("M4W2G8");

    // act
    //PriceQuotes priceQuotes = this.canadaPostService.getRating(criteria, "V5R 2C2");

    logger.debug("satoshi");
    PriceQuotes priceQuotes = new PriceQuotes();
    for (int i = 0; i < 2; i++) {
      priceQuotes = this.canadaPostService.getRating(criteria.getParcelWeight(), criteria.getDestinationPostalCode(), "V5R 2C2");
    }

    // assert
    assertThat(priceQuotes).isNotNull();
  }
}
