package com.iwaodev.data;

import java.util.UUID;

import com.github.javafaker.Faker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
@Deprecated
public class BaseDatabaseSetup {

  private static final Logger logger = LoggerFactory.getLogger(BaseDatabaseSetup.class);

  @Value("${test.user.member.email}")
  private String testMemberEmail;

  @Value("${test.user.member.id}")
  private UUID testMemberId;

  @Value("${test.user.admin.email}")
  private String testAdminEmail;

  @Value("${test.user.admin.id}")
  private UUID testAdminId;

  @Value("${test.user.all.password}")
  private String testPassword;


  @Autowired
	private PasswordEncoder bCryptPasswordEncoder;

  @Transactional
  public void setup(TestEntityManager entityManager) {

    logger.info("start setup base database test data");

    // check base data is already in database
    int count = ((Number) entityManager.getEntityManager().createQuery("SELECT COUNT(u) FROM users u")
        .getSingleResult()).intValue();

    logger.info("test member user email: " + this.testMemberEmail);
    logger.info("test admin user email: " + this.testAdminEmail);


    // if count == 1, only admin user is inserted and this means that you need to insert test user record before testing.
    if (count == 1) {

      logger.info("start inserting base test data such as user_types, test user");

      Faker faker = new Faker();

      /**
       * since you cannot use 'persist' with explicit UUID if the target column is auto-increment, use raw sql to insert test user
       **/

      /**
       * move to inital script for admin user insertion.
       *
       **/

      // admin test user
      //entityManager.getEntityManager().createNativeQuery(
      //    "INSERT INTO `ec-schema`.`users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) VALUES ( :user_id, :first_name, :last_name, :email, :password, '1')"
      //    ) // user type id = 1 for admin
      //  .setParameter("user_id",  this.testAdminId.toString())
      //  .setParameter("first_name",  faker.name().firstName())
      //  .setParameter("last_name",  faker.name().lastName())
      //  .setParameter("email",  this.testAdminEmail)
      //  // don't forget encode password
      //  .setParameter("password",  this.bCryptPasswordEncoder.encode(this.testPassword))
      //  .executeUpdate();

      // member test user
      entityManager.getEntityManager().createNativeQuery(
          "INSERT INTO `ec-schema`.`users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) VALUES ( :user_id, :first_name, :last_name, :email, :password, '2')"
          ) // user type id = 2 for member
        .setParameter("user_id",  this.testMemberId.toString())
        .setParameter("first_name",  faker.name().firstName())
        .setParameter("last_name",  faker.name().lastName())
        .setParameter("email",  this.testMemberEmail)
        // don't forget encode password
        .setParameter("password",  this.bCryptPasswordEncoder.encode(this.testPassword))
        .executeUpdate();

    } else {
      logger.info("base test data is setup already so skip inserting test data");
    }
  }
}
