-- add product_weight on order_details
ALTER TABLE orders
DROP FOREIGN KEY fk_orders_users1;

ALTER TABLE orders 
ADD CONSTRAINT fk_orders_users1 
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL;
