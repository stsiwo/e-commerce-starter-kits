package com.iwaodev.application.irepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User>, AdvanceUserRepository {

  /**
   * - nativeQuery: use row SQL statement. (not JPQL)
   *
   * - don't return different entity rather than the main entity (e.g., User)
   **/

  @Query(value = "SELECT u FROM users u WHERE u.email = ?1")
  Optional<User> findByEmail(String email);

  // use this instead of above
  @Query(value = "SELECT u FROM users u WHERE u.email = ?1")
  Optional<User> getByEmail(String email);

  @Query(value = "SELECT ut.user_type FROM user_types ut INNER JOIN users u ON u.user_type_id = ut.user_type_id WHERE u.email = ?1", nativeQuery = true)
  String getUserRole(String email);

  @Query(value = "SELECT * FROM users u WHERE u.email = ?1 AND u.active = 'ACTIVE'", nativeQuery = true)
  User findActiveByEmail(String email);

  @Query(value = "SELECT * FROM users u WHERE u.email = ?1 AND (u.active = 'ACTIVE' OR u.active = 'TEMP')", nativeQuery = true)
  User findActiveOrTempByEmail(String email);

  @Query(value = "SELECT u FROM users u WHERE u.stripeCustomerId = ?1")
  Optional<User> findByStipeCustomerId(String stripeCustomerId);

  // assuming there is only single admin user.
  @Query(value = "SELECT u FROM users u INNER JOIN u.userType ut WHERE ut.userType = 'ADMIN'")
  Optional<User> getAdmin();
  
  // assuming there is only single admin user.
  @Query(value = "SELECT u FROM users u WHERE u.forgotPasswordToken = ?1")
  Optional<User> findByForgotPasswordToken(String token);

  /**
   * find all available users.
   *
   *  - 'active': ACTIVE
   *
   **/
  @Query(value = "SELECT u FROM users u INNER JOIN u.userType ut WHERE (u.active = 'ACTIVE' OR u.active = 'TEMP') and ut.userType = ?1")
  List<User> findAvailableAllByType(UserTypeEnum userType);
}


