-- add product_weight on order_details
ALTER TABLE order_details
ADD COLUMN product_weight decimal(6,2) not null default 1.00;

