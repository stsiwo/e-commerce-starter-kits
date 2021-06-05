package com.iwaodev.application.irepository;

import com.iwaodev.infrastructure.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {

  /**
   * - nativeQuery: use row SQL statement. (not JPQL)
   *
   * - don't return different entity rather than the main entity (e.g., Category)
   **/

  //@Query(value = "SELECT * FROM users u WHERE u.email = ?1", nativeQuery = true)
  //User findByEmail(String email);

  //@Query(value = "SELECT ut.user_type FROM user_types ut INNER JOIN users u ON u.user_type_id = ut.user_type_id WHERE u.email = ?1", nativeQuery = true)
  //String getUserRole(String email);

  //@Query(value = "SELECT * FROM users u WHERE u.email = ?1 AND u.is_deleted = 0", nativeQuery = true)
  //User findActiveByEmail(String email);
}



