package com.iwaodev.application.irepository;

import java.util.Optional;
import java.util.UUID;

import com.iwaodev.infrastructure.model.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {


  @Query(value = "SELECT o FROM orders o WHERE o.stripePaymentIntentId = ?1")
  Optional<Order> findByStripePaymentIntentId(String stripePaymentIntentId);

  @Query(value = "SELECT o FROM orders o WHERE o.orderId = ?1 AND o.orderNumber = ?2")
  Optional<Order> findByOrderIdAndOrderNumber(UUID orderId, String orderNumber);

  @Query(value = "SELECT o FROM orders o INNER JOIN users u ON u.userId = o.user.userId WHERE o.orderId = ?1 AND u.userId = ?2")
  Optional<Order> findByOrderIdAndUserId(UUID orderId, UUID userId);

}

