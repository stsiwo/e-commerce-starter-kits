package com.iwaodev.application.irepository;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.iwaodev.infrastructure.model.WishlistItem;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long>, JpaSpecificationExecutor<WishlistItem>, AdvanceWishlistItemRepository {

  /**
   * - nativeQuery: use row SQL statement. (not JPQL)
   *
   * - don't return different entity rather than the main entity (e.g., Product)
   **/

  @Query(value = "SELECT c FROM wishlistItems c WHERE c.user.userId = ?1")
  Page<WishlistItem> getAllByUserIdWithPage(UUID userId, Pageable pageable);

  @Query(value = "SELECT c FROM wishlistItems c WHERE c.user.userId = ?1")
  List<WishlistItem> getAllByUserId(UUID userId);

  /**
   * if a given variant with a given user exists, return true.
   *
   * NOT WORKING! don't know why!
   **/
  //@Query(value = "SELECT EXISTS (SELECT 1 FROM wishlist_items c WHERE c.variant_id = ?1 AND c.user_id = ?2)", nativeQuery = true)
  //BigInteger isExist(Long variantId, UUID userId);

  @Query(value = "SELECT w FROM wishlistItems w WHERE w.variant.variantId = ?1 AND w.user.userId = ?2")
  Optional<WishlistItem> findByVariantIdAndUserId(Long variantId, UUID userId);

}

