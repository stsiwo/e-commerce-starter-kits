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
}



