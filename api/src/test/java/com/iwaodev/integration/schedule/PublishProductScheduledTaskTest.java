package com.iwaodev.integration.schedule;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;

// MockMvc stuff

import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.iservice.ProductService;
import com.iwaodev.application.schedule.product.PublishProductScheduledTask;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.infrastructure.model.Product;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

// this is alias to SpringJUnit4ClassRunner
//@RunWith(SpringRunner.class)
/**
 * this allows you to use TestEntityManager instead of EntityManager.
 *
 * - if you use Real EntityManager, transaction does not work correctly. esp
 * there is no rollback.
 *
 * - you can't use @DataJpaTest since this includes @BootstrapWith which is
 * included in @SpringBootTest too. this complains that multiple use
 * of @Bootstrap when compile
 * 
 **/
@AutoConfigureTestEntityManager
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
@ActiveProfiles("integtest")
@AutoConfigureMockMvc
public class PublishProductScheduledTaskTest {

  private static final Logger logger = LoggerFactory.getLogger(PublishProductScheduledTaskTest.class);

  @LocalServerPort
  private int port;

  @Autowired
  private BaseDatabaseSetup baseDatabaseSetup;

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private PublishProductScheduledTask task;

  @Autowired
  private ProductService productService;

  /**
   * insert base test data into mysql database
   *
   * - such as user_types, test user
   *
   **/
  @BeforeTransaction
  void verifyInitialDatabaseState() throws Exception {
    this.baseDatabaseSetup.setup(this.entityManager);
  }

  @Test
  @Sql(scripts = { "classpath:/integration/schedule/shouldPublishProductsOnlyIfCurDateMatchReleaseDate.sql" })
  public void shouldPublishProductsOnlyIfCurDateMatchReleaseDate(/**@Value("classpath:/integration/schedule/shouldAddSoldCountSuccessfullyWhenAddSoldCountEventHandlerCalled.json") Resource dummyFormJsonFile**/) throws Exception {

    // arrange
    // act & assert

    /**
     * NOTE: 'save' inside this handler automatically update/reflect target entity.
     *
     * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
     **/

    /**
     * dont use this task handler directly since we dont' any control over the date paramter from this test so use product service directly.
     **/
    //this.task.handle();
    this.productService.publishProductsByTime(LocalDateTime.of(2021, 1, 1, 0, 0, 0));

    // assert
    List<Product> products = this.productRepository.findAll();

    for (Product product : products) {
      if (product.getProductId().toString().equals("9e3e67ca-d058-41f0-aad5-4f09c956a81f")) {
        assertThat(product.getIsPublic()).isEqualTo(true);
      }
      if (product.getProductId().toString().equals("773f1fc7-c037-447a-a5b2-f790ea2302e5")) {
        assertThat(product.getIsPublic()).isEqualTo(false);
      }
      if (product.getProductId().toString().equals("a362bbc3-5c70-4e82-96d3-5fa1e3103332")) {
        assertThat(product.getIsPublic()).isEqualTo(false);
      }
    }
  }
}





