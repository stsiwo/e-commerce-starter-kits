package com.iwaodev.application.irepository;

import java.util.Optional;
import java.util.UUID;

import com.iwaodev.infrastructure.model.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.LockModeType;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order>, AdvanceOrderRepository {


  @Query(value = "SELECT o FROM orders o WHERE o.stripePaymentIntentId = ?1")
  Optional<Order> findByStripePaymentIntentId(String stripePaymentIntentId);

  @Query(value = "SELECT o FROM orders o WHERE o.orderId = ?1 AND o.orderNumber = ?2")
  //@Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT) // does not increment version number?? bug?? : https://thorben-janssen.com/hibernate-tips-increase-version-parent-entity-updating-child-entity/
  Optional<Order> findByOrderIdAndOrderNumber(UUID orderId, String orderNumber);

  @Query(value = "SELECT o FROM orders o WHERE o.orderId = ?1")
  @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT) // does not increment version number?? bug?? : https://thorben-janssen.com/hibernate-tips-increase-version-parent-entity-updating-child-entity/
  Optional<Order> findByIdWithOptimisticForceIncrement(UUID orderId);

  @Query(value = "SELECT o FROM orders o INNER JOIN users u ON u.userId = o.user.userId WHERE o.orderId = ?1 AND u.userId = ?2")
  Optional<Order> findByOrderIdAndUserId(UUID orderId, UUID userId);

}

