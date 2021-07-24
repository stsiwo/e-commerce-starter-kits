-- category
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('1', 'category_1', 'category_1_desc', 'category_path_1');
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('2', 'category_2', 'category_2_desc', 'category_path_2');

-- products
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`) 
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'test_name_1', 'test_desc_1', 'test-path', '12.21', '4.21', '1'); -- make sure product id = 9e3e67ca-d058-41f0-aad5-4f09c956a81f

-- product images
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('10', '/images/product-image-0-xxxx.png', 'product-image-0', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0); -- make sure product_image_id match with input json script
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('11', '/images/product-image-1-yyyy.png', 'product-image-1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);-- make sure product_image_id match with input json script
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('12', '', 'product-image-2', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);-- make sure product_image_id match with input json script
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('13', '/images/product-image-3-zzzz.png', 'product-image-3', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);-- make sure product_image_id match with input json script
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('14', '', 'product-image-4', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);-- make sure product_image_id match with input json script

-- product variants
INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('1', '1', 'white', '123.00', '12', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 1


INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 1', 'sample description', 0);


-- order 1
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'order_w0vDYZvqy_Y', '123.00', '2.00', '10.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('H-RMUEU37S5', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('KWuZZcLulPn', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, 'c8f8591c-bb83-4fd1-a098-3fac8d40e450');


-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('1', '3', '5.00', 'white', 'XS', 'sample product name 1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('2', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('3', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');

