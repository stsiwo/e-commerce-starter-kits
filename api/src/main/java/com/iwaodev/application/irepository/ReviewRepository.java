package com.iwaodev.application.irepository;

import java.util.Optional;
import java.util.UUID;

import com.iwaodev.infrastructure.model.Review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>, JpaSpecificationExecutor<Review>, AdvanceReviewRepository {

  /**
   * - nativeQuery: use row SQL statement. (not JPQL)
   *
   * - don't return different entity rather than the main entity (e.g., Product)
   **/

  @Query(value = "SELECT r FROM reviews r WHERE r.user.userId = ?1 AND r.product.productId = ?2")
  Optional<Review> isExist(UUID userId, UUID productId);

}

