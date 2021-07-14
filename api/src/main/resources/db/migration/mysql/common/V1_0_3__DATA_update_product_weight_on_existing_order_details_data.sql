-- update existing order_details
-- if its variant is not null, assign the variant_weight to order_details.product_weight
-- if not, keep the default value (e.g., 1.00)
UPDATE order_details od
INNER JOIN product_variants pv on pv.variant_id = od.product_variant_id
SET od.product_weight = IF(od.product_variant_id is not null, pv.variant_weight * od.product_quantity, 1.00);
