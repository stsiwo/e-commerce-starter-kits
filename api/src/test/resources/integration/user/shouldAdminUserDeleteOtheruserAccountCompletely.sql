INSERT INTO `ec-schema`.`users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`, `created_at`, `updated_at`, `active`) 
VALUES ('29c845ad-54b1-430a-8a71-5caba98d5978', 'first_name_1', 'last_name_1', 'test_1@test.com', '$2a$10$iRnpNpN7XsJq3wjHwRza1eda6CKz.GnMfLAmnozUXepQnm3w7i1yS', '2', '2020-01-01 16:27:55', '2020-01-01 16:27:55', 'ACTIVE');

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '29c845ad-54b1-430a-8a71-5caba98d5978');

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`)
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '29c845ad-54b1-430a-8a71-5caba98d5978');


-- categories
INSERT INTO `categories` (`category_id`, `category_name`, `category_description`, `category_path`)
VALUES ('1', 'Test Category 1', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-category-1');
-- product (category 1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-1-1', '12.21', '1', '1'); 

-- product variant 1-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('1', '1', 'white', '123.00', '50', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '2.00', '1.00', '1.00', '1.00');

-- product variant 1-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('2', '2', 'black', '13.00', '20', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.50', '1.00', '1.00', '1.00');

-- product variant 1-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`, `is_discount`)
VALUES ('3', '3', 'aqua', '13.00', '7.00', '2021-01-01 00:00:01', '2023-01-07 00:00:00', '100', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.00', '1.00', '1.00', '1.00', '1');

-- product variant 1-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('4', '4', 'aqua', '100', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '2.00', '1.00', '1.00', '1.00');

-- product variant 1-5 (discount price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`,  `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('5', '5', 'aqua', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '100', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.00', '1.00', '1.00', '1.00');


-- reviews
INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('29c845ad-54b1-430a-8a71-5caba98d5978', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 1', 'sample description', 0); 

-- cart items
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('29c845ad-54b1-430a-8a71-5caba98d5978', '5', '1'); 


INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('29c845ad-54b1-430a-8a71-5caba98d5978', '3'); 

-- order 1
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'order_w0vDYZvqy_Y', '123.00', '2.00', '10.00', '29c845ad-54b1-430a-8a71-5caba98d5978', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('H-RMUEU37S5', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'CA', 'V5R 2C1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('KWuZZcLulPn', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'CA', 'V5R 2C1', NULL, 'c8f8591c-bb83-4fd1-a098-3fac8d40e450');


-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('1', '3', '5.00', 'white', 'XS', 'sample product name 1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'DRAFT', '0', '29c845ad-54b1-430a-8a71-5caba98d5978', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('2', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'ORDERED', '0', '29c845ad-54b1-430a-8a71-5caba98d5978', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('3', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'PAID', '0', '29c845ad-54b1-430a-8a71-5caba98d5978', '0');


-- notification (issuer: 29c845ad-54b1-430a-8a71-5caba98d5978)
INSERT INTO `notifications` (`notification_id`, `notification_title`, `notification_description`, `issuer_id`, `recipient_id`, `notification_type_id`, `is_read`)
VALUES ('ntf_bGCZkE31wah', 'sample title', 'sample descripton', '29c845ad-54b1-430a-8a71-5caba98d5978', 'e95bf632-1518-4bf2-8ba9-cd8b7587530b', '1', '0');

-- notification (recipient: 29c845ad-54b1-430a-8a71-5caba98d5978)
INSERT INTO `notifications` (`notification_id`, `notification_title`, `notification_description`, `issuer_id`, `recipient_id`, `notification_type_id`, `is_read`)
VALUES ('ntf_GovlhBQkFrg', 'sample title', 'sample descripton', 'e95bf632-1518-4bf2-8ba9-cd8b7587530b','29c845ad-54b1-430a-8a71-5caba98d5978', '1', '0');
