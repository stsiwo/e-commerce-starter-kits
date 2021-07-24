-- add product variant idll on order_details
ALTER TABLE order_details
DROP FOREIGN KEY fk_order_details_products1;

ALTER TABLE order_details 
ADD CONSTRAINT fk_order_details_products1
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE SET NULL;
