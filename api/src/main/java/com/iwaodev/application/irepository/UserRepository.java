package com.iwaodev.application.irepository;

import java.util.Optional;
import java.util.UUID;

import com.iwaodev.infrastructure.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

  /**
   * - nativeQuery: use row SQL statement. (not JPQL)
   *
   * - don't return different entity rather than the main entity (e.g., User)
   **/

  @Query(value = "SELECT * FROM users u WHERE u.email = ?1", nativeQuery = true)
  User findByEmail(String email);

  @Query(value = "SELECT ut.user_type FROM user_types ut INNER JOIN users u ON u.user_type_id = ut.user_type_id WHERE u.email = ?1", nativeQuery = true)
  String getUserRole(String email);

  @Query(value = "SELECT * FROM users u WHERE u.email = ?1 AND u.is_deleted = 0", nativeQuery = true)
  User findActiveByEmail(String email);

  @Query(value = "SELECT u FROM users u WHERE u.stripeCustomerId = ?1")
  Optional<User> findByStipeCustomerId(String stripeCustomerId);

  //@Query(value = "SELECT * FROM users u INNER JOIN addresses a ON a.user_id = u.user_id WHERE a.user_id = ?1 AND u.is_deleted = 0", nativeQuery = true)
  //User findAllAddressesById(String userId); // don't use UUID as parameter, it return nothing. 

  // assuming there is only single admin user.
  @Query(value = "SELECT u FROM users u INNER JOIN u.userType ut WHERE ut.userType = 'ADMIN'")
  Optional<User> getAdmin();
  
  // assuming there is only single admin user.
  @Query(value = "SELECT u FROM users u WHERE u.forgotPasswordToken = ?1")
  Optional<User> findByForgotPasswordToken(String token);
}


