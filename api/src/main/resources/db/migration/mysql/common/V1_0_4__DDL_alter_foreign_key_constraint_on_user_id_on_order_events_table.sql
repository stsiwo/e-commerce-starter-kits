-- add product_weight on order_details
ALTER TABLE order_events
DROP FOREIGN KEY FK_order_events__users;

ALTER TABLE order_events 
ADD CONSTRAINT FK_order_events__users
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL;
