package com.iwaodev.unit.infrastructure.repository.product;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.iwaodev.application.irepository.NotificationRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.domain.notification.NotificationTypeEnum;
import com.iwaodev.domain.service.CreateNotificationService;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.exception.DomainException;
import com.iwaodev.infrastructure.model.Notification;
import com.iwaodev.infrastructure.model.Product;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlMergeMode;
import org.springframework.transaction.annotation.Transactional;
import com.iwaodev.exception.AppException;

@SpringBootTest
@ActiveProfiles("unittest")
@Sql(scripts = { "classpath:/unit/test-base.sql" })
@SqlMergeMode(SqlMergeMode.MergeMode.MERGE)
@Transactional  // this makes it possible to rollback after each test with @Sql
public class ProductRepositoryTest {

  private static final Logger logger = LoggerFactory.getLogger(ProductRepositoryTest.class);

  @Autowired
  private ProductRepository productRepository;
  
  @Test
  //@Sql(scripts = { "classpath:/unit/domain/service/shouldCreateNewNotification.sql" })
  public void shouldReturnAllNewProductsByTime() throws Exception {

    // arrange
    
    // act
    List<Product> products = this.productRepository.getAllNewProductByTime(LocalDateTime.now());

    // assert
    assertThat(products.size()).isEqualTo(0);
  }

}


