package com.iwaodev.application.schedule.product;

import java.time.LocalDateTime;

import com.iwaodev.application.iservice.ProductService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PublishProductScheduledTask {

  private static final Logger logger = LoggerFactory.getLogger(PublishProductScheduledTask.class);

  @Autowired
  private ProductService productService;;

  // every day at A.M. 0:00
  @Scheduled(cron = "0 0 0 ? * *") // check with this: https://www.freeformatter.com/cron-expression-generator-quartz.html
  public void handle() throws Exception {
    logger.debug("start schedule: TurnIsDiscountFalseWhenDiscountDoneScheduledTask");
    this.productService.turnPassedDiscountFalseByTime(LocalDateTime.now());
  }
}

