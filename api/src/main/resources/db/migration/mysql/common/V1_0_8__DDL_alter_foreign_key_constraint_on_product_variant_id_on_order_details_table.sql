-- add product variant idll on order_details
ALTER TABLE order_details
DROP FOREIGN KEY fk_order_details_product_variants1;

ALTER TABLE order_details 
ADD CONSTRAINT fk_order_details_product_variants1
    FOREIGN KEY (product_variant_id) REFERENCES product_variants (variant_id) ON DELETE SET NULL;
