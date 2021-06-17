package com.iwaodev.application.irepository;

import java.util.Optional;

import com.iwaodev.infrastructure.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {

  /**
   * - nativeQuery: use row SQL statement. (not JPQL)
   *
   * - don't return different entity rather than the main entity (e.g., Category)
   **/
  @Query(value = "SELECT c FROM categories c WHERE c.categoryName = ?1")
  Optional<Category> findByCategoryName(String categoryName);

  @Query(value = "SELECT c FROM categories c WHERE c.categoryPath = ?1")
  Optional<Category> findByCategoryPath(String categoryPath);
}



