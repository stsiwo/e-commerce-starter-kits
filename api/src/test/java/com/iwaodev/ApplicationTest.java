package com.iwaodev;

import static org.assertj.core.api.Assertions.assertThat;

import com.iwaodev.data.BaseDatabaseSetup;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

//////@RunWith(SpringRunner.class)
///**
// * this allows you to use TestEntityManager instead of EntityManager.
// *
// *  - if you use Real EntityManager, transaction does not work correctly. esp there is no rollback.
// *
// *  - you can't use @DataJpaTest since this includes @BootstrapWith which is included in @SpringBootTest too.
// *    this complains that multiple use of @Bootstrap when compile
// * 
// **/
//@AutoConfigureTestEntityManager
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
//@TestInstance(TestInstance.Lifecycle.PER_CLASS)
//@Transactional
//public class ApplicationTest {
//
//  private static final Logger logger = LoggerFactory.getLogger(ApplicationTest.class);
//
//  @LocalServerPort
//  private int port;
//
//  @Autowired
//  private TestRestTemplate restTemplate;
//
//  @Autowired
//  private BaseDatabaseSetup baseDatabaseSetup;
//
//  @Autowired
//  private TestEntityManager entityManager;
//
////  @BeforeTransaction
////  void verifyInitialDatabaseState() {
////    logger.info("start calling setup before - satoshi");
////    this.baseDatabaseSetup.setup(this.entityManager);
////  }
////
////  @AfterTransaction
////  void verifyFinalDatabaseState() {
////    // logic to verify the final state after transaction has rolled back
////    //
////    // you might want to delete some data (e.g., data created in @BeforeTransaction)
////    //
////  } 
////
////  /**
////   * you can't set test user using this @BeforeEach
////   *
////   *  - Spring Security run before this @BeforeEach and can't pass authentication.
////   **/
////  @BeforeEach
////  public void setup() {
////  }
//
//  @Test
//  @WithUserDetails(value = "test@test.com", userDetailsServiceBeanName = "springSecurityUserDetailsService")
//  @Sql(scripts={"classpath:test.sql"})
//  public void greetingShouldReturnDefaultMessage() throws Exception {
//    
//    //assertThat(this.restTemplate.getForObject("http://localhost:" + this.port + "/users", String.class))
//    //    .contains("hello");
//    int count = ((Number) entityManager.getEntityManager().createQuery("SELECT COUNT(ut) FROM users ut").getSingleResult()).intValue();
//    assertThat(count).isEqualTo(2);
//  }
//
//}
