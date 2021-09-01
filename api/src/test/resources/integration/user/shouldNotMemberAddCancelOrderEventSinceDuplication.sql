-- categories
INSERT INTO `categories` (`category_id`, `category_name`, `category_description`, `category_path`)
VALUES ('1', 'Test Category 1', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-category-1'); 
  
INSERT INTO `categories` (`category_id`, `category_name`, `category_description`, `category_path`)
VALUES ('2', 'Test Category 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 'test-category-2'); 

INSERT INTO `categories` (`category_id`, `category_name`, `category_description`, `category_path`)
VALUES ('3', 'Test Category 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-category-3'); 
  
INSERT INTO `categories` (`category_id`, `category_name`, `category_description`, `category_path`)
VALUES ('4', 'Test Category 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-category-4'); 

INSERT INTO `categories` (`category_id`, `category_name`, `category_description`, `category_path`)
VALUES ('5', 'Test Category 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-category-5'); 

INSERT INTO `categories` (`category_id`, `category_name`, `category_description`, `category_path`)
VALUES ('6', 'Test Category 6', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-category-6'); 

-- product (category 1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`)
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-1-1', '12.21', '1');  

-- product variant 1-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('1', '1', 'white', '123.00', '12', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00'); -- make sure stock match with test

-- product variant 1-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('2', '2', 'black', '13.00', '20', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('3', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '6', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('4', '4', 'aqua', '6', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-5 (discount price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`,  `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('5', '5', 'aqua', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '6', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');


-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`)
VALUES ('773f1fc7-c037-447a-a5b2-f790ea2302e5', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-1-2', '12.21', '1'); 

-- product variant 2-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('6', '1', 'white', '123.00', '12', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('7', '2', 'black', '13.00', '5', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('8', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '6', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('9', '4', 'aqua', '6', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.00', '1.00', '1.00', '1.00'); -- make sure stock match with test 

-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`)
VALUES ('a362bbc3-5c70-4e82-96d3-5fa1e3103332', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-3', '20.21', '1'); 

-- product variant 3-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('10', '1', 'white', '123.00', '12', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('11', '2', 'black', '13.00', '5', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('12', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '6', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('13', '4', 'aqua', '6', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '1.00', '1.00', '1.00', '1.00'); -- make sure stock match with test



-- target order
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'order_w0vDYZvqy_Y', '123.00', '2.00', '10.00', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '1');

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('1', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'CA', 'V5R 2C1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('2', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'CA', 'V5R 2C1', NULL, 'c8f8591c-bb83-4fd1-a098-3fac8d40e450');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('1', '3', '5.00', 'white', 'XS', 'sample product name 1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f'); -- make sure quantity match with test
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('2', '1', '10.00', 'purple', 'M', 'sample product name 2', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');-- make sure quantity match with test
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('3', '1', '3.00', 'white', 'XS', 'sample product name 3', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '13', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332');-- make sure quantity match with test

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('56', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'DRAFT', '0', NULL, '1');

INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('57', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'ORDERED', '0', NULL, '1');

INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('58', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'PAID', '0', NULL, '1');

INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('59', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'CANCEL_REQUEST', '1', NULL, '1');



