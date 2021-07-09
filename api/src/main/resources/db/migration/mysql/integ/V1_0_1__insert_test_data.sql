-- users

-- test member user
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'c7081519-16e5-4f92-ac50-1834001f12b9', 'Member', 'Test', 'test_member1@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

-- member user with no phones and addresses
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'a2901f19-715a-44fe-9701-fae6713fd764', 'Member', 'Test', 'test_member2@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


-- member user with phones only
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'd2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', 'Member', 'Test', 'test_member3@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', 'd2474e1c-4c69-467b-8a7f-11d3ffe8d6d3');


-- member user with phones and address
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '19829772-893b-4639-ab6b-173e86b5189e', 'Member', 'Test', 'test_member4@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '19829772-893b-4639-ab6b-173e86b5189e');

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`)
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '19829772-893b-4639-ab6b-173e86b5189e');


-- member user with  address only
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '729ff8a6-df19-4a1a-bdbe-639e429d5654', 'Member', 'Test', 'test_member6@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`)
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '729ff8a6-df19-4a1a-bdbe-639e429d5654');


-- member user with multiple phones and addresses
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '862fb67f-4d03-4554-a99a-9b66e0d8f82e', 'Member', 'Test', 'test_member7@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '862fb67f-4d03-4554-a99a-9b66e0d8f82e');
INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '862fb67f-4d03-4554-a99a-9b66e0d8f82e');
INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '862fb67f-4d03-4554-a99a-9b66e0d8f82e');

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`)
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '862fb67f-4d03-4554-a99a-9b66e0d8f82e');
INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`)
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '862fb67f-4d03-4554-a99a-9b66e0d8f82e');
INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`)
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '862fb67f-4d03-4554-a99a-9b66e0d8f82e');

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '17256569-8ea3-4ba4-9301-507da1620734', 'Member', 'Test', 'test_member9@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '70e613e4-1fdd-4b7f-9896-7d78a1f96441', 'Member', 'Test', 'test_member10@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '738b5b6c-35ee-43f3-b74b-6085c151cafe', 'Member', 'Test', 'test_member11@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '991b3126-1e81-4fdf-965a-7e3977c46ab2', 'Member', 'Test', 'test_member12@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'e3976db2-d81d-4a69-b41e-e2be13118102', 'Member', 'Test', 'test_member13@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'e9761f0c-e9f2-4f92-ad59-5ffe7aad18df', 'Member', 'Test', 'test_member14@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'f1f77931-7fa5-4269-8352-7d072b81290c', 'Member', 'Test', 'test_member15@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '87380264-56f3-4d2d-a185-158cff70cedf', 'Member', 'Test', 'test_member16@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'a41fbab1-af7d-48bd-8cf8-89a6b8b2b6e2', 'Member', 'Test', 'test_member17@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'd7fd3109-a135-4498-86f7-456cfd4803ae', 'Member', 'Test', 'test_member18@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '7c9aa1c2-39e2-4c57-a522-35a86c9da261', 'Member', 'Test', 'test_member19@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'ff285833-98e9-49e2-b6d4-5c178df01746', 'Member', 'Test', 'test_member20@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '686b0a38-42ab-488d-a047-f36fcdb21ca0', 'Member', 'Test', 'test_member21@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '2f72a2cf-d407-4d63-9f27-d5ffdb6698c2', 'Member', 'Test', 'test_member22@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '2dbfadf5-b0e0-4e95-b84e-5c9ca24760d5', 'Member', 'Test', 'test_member23@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');



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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-1-1', '12.21', '1', '1'); 

-- product variant 1-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('1', '1', 'white', '123.00', '50', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('2', '2', 'black', '13.00', '20', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`, `is_discount`)
VALUES ('3', '3', 'aqua', '13.00', '7.00', '2021-01-01 00:00:01', '2023-01-07 00:00:00', '100', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00', '1');

-- product variant 1-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('4', '4', 'aqua', '100', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-5 (discount price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`,  `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('5', '5', 'aqua', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '100', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');


-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('773f1fc7-c037-447a-a5b2-f790ea2302e5', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-1-2', '12.21', '1', '1'); 

-- product variant 2-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('6', '1', 'white', '123.00', '30', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('7', '2', 'black', '13.00', '50', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('8', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '50', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('9', '4', 'aqua', '100', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.00', '1.00', '1.00', '1.00');


-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('a362bbc3-5c70-4e82-96d3-5fa1e3103332', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-3', '20.21', '1', '1'); 

-- product variant 3-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('10', '1', 'white', '123.00', '120', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('11', '2', 'black', '13.00', '50', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('12', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('13', '4', 'aqua', '60', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '1.00', '1.00', '1.00', '1.00');


-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('de7e767d-cd0c-4705-b633-353b2340715b', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-4', '20.21', '1', '1'); 

-- product variant 4-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('14', '1', 'white', '123.00', '120', 'de7e767d-cd0c-4705-b633-353b2340715b', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('15', '2', 'black', '13.00', '50', 'de7e767d-cd0c-4705-b633-353b2340715b', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('16', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'de7e767d-cd0c-4705-b633-353b2340715b', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('17', '4', 'aqua', '60', 'de7e767d-cd0c-4705-b633-353b2340715b', '1.00', '1.00', '1.00', '1.00');


-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('db600487-5142-4121-8b3f-237c2d883c14', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-5', '20.21', '1', '1'); 

-- product variant 5-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('18', '1', 'white', '123.00', '120', 'db600487-5142-4121-8b3f-237c2d883c14', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('19', '2', 'black', '13.00', '50', 'db600487-5142-4121-8b3f-237c2d883c14', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('20', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'db600487-5142-4121-8b3f-237c2d883c14', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('21', '5', 'aqua', '60', 'db600487-5142-4121-8b3f-237c2d883c14', '1.00', '1.00', '1.00', '1.00');


-- product (category = 2) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('bff91a24-02dd-4762-9ddd-6972ee15c9f7', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-2-1', '12.21', '2', '1'); 

-- product variant 1-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('22', '1', 'white', '123.00', '120', 'bff91a24-02dd-4762-9ddd-6972ee15c9f7', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('23', '2', 'black', '13.00', '50', 'bff91a24-02dd-4762-9ddd-6972ee15c9f7', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('24', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'bff91a24-02dd-4762-9ddd-6972ee15c9f7', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('25', '4', 'aqua', '60', 'bff91a24-02dd-4762-9ddd-6972ee15c9f7', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-5 (discount price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`,  `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('26', '5', 'aqua', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'bff91a24-02dd-4762-9ddd-6972ee15c9f7', '1.00', '1.00', '1.00', '1.00');


-- product (category = 2)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('4f545dc7-ed77-4049-83ef-26904b85a4c2', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-2-2', '12.21', '2', '1'); 

-- product variant 2-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('27', '1', 'white', '123.00', '120', '4f545dc7-ed77-4049-83ef-26904b85a4c2', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('28', '2', 'black', '13.00', '50', '4f545dc7-ed77-4049-83ef-26904b85a4c2', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('29', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', '4f545dc7-ed77-4049-83ef-26904b85a4c2', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('30', '4', 'aqua', '60', '4f545dc7-ed77-4049-83ef-26904b85a4c2', '1.00', '1.00', '1.00', '1.00');


-- product (category = 2)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('eac39de7-8e2d-4fbc-b43c-95c5681bc16b', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-2-3', '20.21', '2', '1'); 

-- product variant 3-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('40', '1', 'white', '123.00', '120', 'eac39de7-8e2d-4fbc-b43c-95c5681bc16b', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('41', '2', 'black', '13.00', '50', 'eac39de7-8e2d-4fbc-b43c-95c5681bc16b', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('42', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'eac39de7-8e2d-4fbc-b43c-95c5681bc16b', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('43', '4', 'aqua', '60', 'eac39de7-8e2d-4fbc-b43c-95c5681bc16b', '1.00', '1.00', '1.00', '1.00');


-- product (category = 2) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('df9df4d4-b58d-4649-98e1-95da5e1fc61a', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-2-4', '20.21', '2', '1'); 

-- product variant 4-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('44', '1', 'white', '123.00', '120', 'df9df4d4-b58d-4649-98e1-95da5e1fc61a', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('45', '2', 'black', '13.00', '50', 'df9df4d4-b58d-4649-98e1-95da5e1fc61a', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('46', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'df9df4d4-b58d-4649-98e1-95da5e1fc61a', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('47', '3', 'aqua', '60', 'df9df4d4-b58d-4649-98e1-95da5e1fc61a', '1.00', '1.00', '1.00', '1.00');


-- product (category = 2) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('a1920149-ff55-4359-8e32-9dd2c53e3808', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-2-5', '20.21', '1', '1'); 

-- product variant 5-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('48', '1', 'white', '123.00', '120', 'a1920149-ff55-4359-8e32-9dd2c53e3808', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('49', '2', 'black', '13.00', '50', 'a1920149-ff55-4359-8e32-9dd2c53e3808', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('50', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'a1920149-ff55-4359-8e32-9dd2c53e3808', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('51', '3', 'aqua', '60', 'a1920149-ff55-4359-8e32-9dd2c53e3808', '1.00', '1.00', '1.00', '1.00');


-- product (category = 3) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('ae0c9bb9-0f2d-4012-8363-5c247c0229d9', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-3-1', '12.21', '3', '1'); 

-- product variant 1-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('52', '1', 'white', '123.00', '120', 'ae0c9bb9-0f2d-4012-8363-5c247c0229d9', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('53', '2', 'black', '13.00', '50', 'ae0c9bb9-0f2d-4012-8363-5c247c0229d9', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('54', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'ae0c9bb9-0f2d-4012-8363-5c247c0229d9', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('55', '4', 'aqua', '60', 'ae0c9bb9-0f2d-4012-8363-5c247c0229d9', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-5 (discount price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`,  `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('56', '5', 'aqua', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'ae0c9bb9-0f2d-4012-8363-5c247c0229d9', '1.00', '1.00', '1.00', '1.00');


-- product (category = 3)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('839e4614-7ae6-49f4-b6be-4fb3164cbfc9', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-3-2', 12.00, '3', '1'); 

-- product variant 2-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('57', '1', 'white', '123.00', '120', '839e4614-7ae6-49f4-b6be-4fb3164cbfc9', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('58', '2', 'black', '13.00', '50', '839e4614-7ae6-49f4-b6be-4fb3164cbfc9', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('59', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', '839e4614-7ae6-49f4-b6be-4fb3164cbfc9', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('60', '4', 'aqua', '60', '839e4614-7ae6-49f4-b6be-4fb3164cbfc9', '1.00', '1.00', '1.00', '1.00');


-- product (category = 3)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('3a360687-9214-49b1-b19d-57ec41faab10', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-3-3', '20.21', '3', '1'); 

-- product variant 3-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('61', '1', 'white', '123.00', '120', '3a360687-9214-49b1-b19d-57ec41faab10', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('62', '2', 'black', '13.00', '50', '3a360687-9214-49b1-b19d-57ec41faab10', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('63', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', '3a360687-9214-49b1-b19d-57ec41faab10', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('64', '4', 'aqua', '60', '3a360687-9214-49b1-b19d-57ec41faab10', '1.00', '1.00', '1.00', '1.00');


-- product (category = 3) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('ef109f1f-1c4d-435b-9d9e-520e0ce65fd2', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-3-4', '20.21', '3', '1'); 

-- product variant 4-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('65', '1', 'white', '123.00', '120', 'ef109f1f-1c4d-435b-9d9e-520e0ce65fd2', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('66', '2', 'black', '13.00', '50', 'ef109f1f-1c4d-435b-9d9e-520e0ce65fd2', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('67', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'ef109f1f-1c4d-435b-9d9e-520e0ce65fd2', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('68', '3', 'aqua', '6', 'ef109f1f-1c4d-435b-9d9e-520e0ce65fd2', '1.00', '1.00', '1.00', '1.00');


-- product (category = 3) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('95058bfb-a3f6-446a-a3d0-8c1e490ef90f', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-3-5', '20.21', '3', '1'); 

-- product variant 5-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('69', '1', 'white', '123.00', '120', '95058bfb-a3f6-446a-a3d0-8c1e490ef90f', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('70', '2', 'black', '13.00', '50', '95058bfb-a3f6-446a-a3d0-8c1e490ef90f', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('71', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', '95058bfb-a3f6-446a-a3d0-8c1e490ef90f', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('72', '3', 'aqua', '60', '95058bfb-a3f6-446a-a3d0-8c1e490ef90f', '1.00', '1.00', '1.00', '1.00');


-- product (category = 4) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('0866e74c-eeb8-49a4-9996-ca4749b52b72', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-4-1', '12.21', '4', '1'); 

-- product variant 1-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('73', '1', 'white', '123.00', '120', '0866e74c-eeb8-49a4-9996-ca4749b52b72', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('74', '2', 'black', '13.00', '50', '0866e74c-eeb8-49a4-9996-ca4749b52b72', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('75', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', '0866e74c-eeb8-49a4-9996-ca4749b52b72', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('76', '4', 'aqua', '60', '0866e74c-eeb8-49a4-9996-ca4749b52b72', '1.00', '1.00', '1.00', '1.00');

-- product variant 1-5 (discount price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`,  `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('77', '5', 'aqua', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', '0866e74c-eeb8-49a4-9996-ca4749b52b72', '1.00', '1.00', '1.00', '1.00');


-- product (category = 4)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('ba3468cd-c14d-4ec9-b635-7c49c8cc03d1', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-4-2', '12.21', '4', '1'); 

-- product variant 2-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('78', '1', 'white', '123.00', '120', 'ba3468cd-c14d-4ec9-b635-7c49c8cc03d1', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('79', '2', 'black', '13.00', '50', 'ba3468cd-c14d-4ec9-b635-7c49c8cc03d1', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('80', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'ba3468cd-c14d-4ec9-b635-7c49c8cc03d1', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('81', '4', 'aqua', '60', 'ba3468cd-c14d-4ec9-b635-7c49c8cc03d1', '1.00', '1.00', '1.00', '1.00');


-- product (category = 4)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('317227bc-abdb-4449-8297-5e47589a1ef1', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-4-3', '20.21', '4', '1'); 

-- product variant 3-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('82', '1', 'white', '123.00', '120', '317227bc-abdb-4449-8297-5e47589a1ef1', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('83', '2', 'black', '13.00', '50', '317227bc-abdb-4449-8297-5e47589a1ef1', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('84', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', '317227bc-abdb-4449-8297-5e47589a1ef1', '1.00', '1.00', '1.00', '1.00');

-- product variant 3-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('85', '4', 'aqua', '60', '317227bc-abdb-4449-8297-5e47589a1ef1', '1.00', '1.00', '1.00', '1.00');


-- product (category = 4) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('dbc5f9c4-14f8-4d2d-b8ee-d3134ada00f9', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-4-4', '20.21', '4', '1'); 

-- product variant 4-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('86', '1', 'white', '123.00', '120', 'dbc5f9c4-14f8-4d2d-b8ee-d3134ada00f9', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('87', '2', 'black', '13.00', '50', 'dbc5f9c4-14f8-4d2d-b8ee-d3134ada00f9', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('88', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'dbc5f9c4-14f8-4d2d-b8ee-d3134ada00f9', '1.00', '1.00', '1.00', '1.00');

-- product variant 4-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('89', '3', 'aqua', '60', 'dbc5f9c4-14f8-4d2d-b8ee-d3134ada00f9', '1.00', '1.00', '1.00', '1.00');


-- product (category = 4) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('6dd568cb-6c4d-4667-9f25-902c8d0fb57d', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-4-5', '20.21', '4', '1'); 

-- product variant 5-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('90', '1', 'white', '123.00', '120', '6dd568cb-6c4d-4667-9f25-902c8d0fb57d', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('91', '2', 'black', '13.00', '50', '6dd568cb-6c4d-4667-9f25-902c8d0fb57d', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('92', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', '6dd568cb-6c4d-4667-9f25-902c8d0fb57d', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('93', '3', 'aqua', '60', '6dd568cb-6c4d-4667-9f25-902c8d0fb57d', '1.00', '1.00', '1.00', '1.00');


-- product (category = 5) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('c72e8fcf-0dfa-4c04-b34e-f604c7ddbad9', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-5-1', '12.21', '5', '1'); 

-- product variant 5-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('94', '1', 'white', '123.00', '120', 'c72e8fcf-0dfa-4c04-b34e-f604c7ddbad9', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('95', '2', 'black', '13.00', '50', 'c72e8fcf-0dfa-4c04-b34e-f604c7ddbad9', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('96', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'c72e8fcf-0dfa-4c04-b34e-f604c7ddbad9', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('97', '3', 'aqua', '60', 'c72e8fcf-0dfa-4c04-b34e-f604c7ddbad9', '1.00', '1.00', '1.00', '1.00');



-- product (category = 5)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('ee471735-dccc-4a06-81c3-109506ab3de4', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-5-2', '12.21', '5', '1'); 


-- product variant 5-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('98', '1', 'white', '123.00', '120', 'ee471735-dccc-4a06-81c3-109506ab3de4', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('99', '2', 'black', '13.00', '50', 'ee471735-dccc-4a06-81c3-109506ab3de4', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('100', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '60', 'c72e8fcf-0dfa-4c04-b34e-f604c7ddbad9', '1.00', '1.00', '1.00', '1.00');

-- product variant 5-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('101', '3', 'aqua', '60', 'ee471735-dccc-4a06-81c3-109506ab3de4', '1.00', '1.00', '1.00', '1.00');


-- product (category = 5) discount available
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`)
VALUES ('af416205-26f5-4512-8197-798241576303', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-5-3', '20.21', '5'); 


-- product (category = 5) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`)
VALUES ('c80dad9d-cd09-4445-82c2-8f1fcca914ac', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-5-4', '20.21', '5'); 


-- product (category = 5) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`)
VALUES ('ae9da1ca-eb40-4bb1-8738-fca35aad4f65', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-5-5', '20.21', '5'); 


-- cart_items


-- test member user 1
-- item 1 
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '5', '1'); 

-- item 2 
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '10', '1'); 

-- item 3 
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '14', '1'); 


-- test member user 2
-- item 1 (same product)
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', '18', '1'); 

-- item 2 (same product)
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', '19', '1'); 


-- test member user 3
-- item 1 
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '20', '1'); 

-- item 2 
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '30', '1'); 

-- item 3 
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '51', '1'); 

-- item 4 
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '71', '1'); 

-- item 5 
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '81', '1'); 

-- item 6 
INSERT INTO `ec-schema`.`cart_items` (`user_id`, `variant_id`, `quantity`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '92', '1'); 



-- wishlist_items


-- test member user 1
-- item 1 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '3'); 

-- item 2 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '10'); 

-- item 3 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '12'); 

-- item 5 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '18'); 

-- item 6 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '20'); 

-- item 7 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '25'); 

-- item 8 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '30'); 

-- item 9 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '40'); 

-- item 10 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '41'); 

-- item 11
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '42'); 

-- item 12
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '43'); 

-- item 13 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '46'); 

-- item 14
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '50'); 

-- item 15 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '55'); 

-- item 16 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '60'); 

-- item 17 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '67'); 

-- item 18 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '70'); 

-- item 20 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '71'); 

-- item 21 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '73'); 

-- item 22 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '79'); 

-- item 23 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '80'); 

-- item 24 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '81'); 

-- item 25 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '82'); 

-- item 26 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '83'); 

-- item 27 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '84'); 

-- item 28 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '85'); 

-- item 29 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '86'); 

-- item 30 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '88'); 

-- item 31
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '89'); 

-- item 32
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '90'); 

-- item 33 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '91'); 

-- item 34
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '92'); 

-- item 35 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '93'); 

-- item 36 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '94'); 

-- item 37 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '95'); 

-- item 38 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '96'); 

-- item 39 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '97'); 

-- item 40 
INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '98'); 



-- orders

-- test member 1

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
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('2', '1', '10.00', 'purple', 'M', 'sample product name 2', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('3', '1', '3.00', 'white', 'XS', 'sample product name 3', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('2', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('3', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');


-- order 2
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('34c6c314-de67-41d1-9a97-3bdb7aa5f076', 'order_okkfl1Ez7UN', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('I8Bj53ER5DI', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('dplUq5zUFPw', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, '34c6c314-de67-41d1-9a97-3bdb7aa5f076');


-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('4', '3', '5.00', 'white', 'XS', 'sample product name 1', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('5', '1', '10.00', 'purple', 'M', 'sample product name 2', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('6', '1', '3.00', 'white', 'XS', 'sample product name 3', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('4', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('5', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('6', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', 'PAYMENT_FAILED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');


-- order 3
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('7923d2aa-5f4b-4344-8773-d810f5505496', 'order_IxaCXIxluYA', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('mIhj08qNdgK', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', '7923d2aa-5f4b-4344-8773-d810f5505496', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('OQ8nY-3kOg7', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, '7923d2aa-5f4b-4344-8773-d810f5505496');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('7', '3', '5.00', 'white', 'XS', 'sample product name 1', '7923d2aa-5f4b-4344-8773-d810f5505496', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('8', '1', '10.00', 'purple', 'M', 'sample product name 2', '7923d2aa-5f4b-4344-8773-d810f5505496', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('9', '1', '3.00', 'white', 'XS', 'sample product name 3', '7923d2aa-5f4b-4344-8773-d810f5505496', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('7', '7923d2aa-5f4b-4344-8773-d810f5505496', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('8', '7923d2aa-5f4b-4344-8773-d810f5505496', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('9', '7923d2aa-5f4b-4344-8773-d810f5505496', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('10', '7923d2aa-5f4b-4344-8773-d810f5505496', 'CANCEL_REQUEST', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');



-- order 4
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'order__b5UeIc4ZN4', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('GSKsIBTihIj', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('i4KRlHo8fZB', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, '753f5ac2-f704-4f8b-a52c-51f2338c9e0c');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('10', '3', '5.00', 'white', 'XS', 'sample product name 1', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('11', '1', '10.00', 'purple', 'M', 'sample product name 2', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('12', '1', '3.00', 'white', 'XS', 'sample product name 3', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('11', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('12', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('13', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('14', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'CANCEL_REQUEST', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('15', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'RECEIVED_CANCEL_REQUEST', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');



-- order 5
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('482a0801-495b-44e4-8379-f7bc70fa8d6a', 'order_HYG5z3QXMoK', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');


-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('lRjiLnAxhcs', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', '482a0801-495b-44e4-8379-f7bc70fa8d6a', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('rWVVVFaUzu4', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, '482a0801-495b-44e4-8379-f7bc70fa8d6a');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('13', '3', '5.00', 'white', 'XS', 'sample product name 1', '482a0801-495b-44e4-8379-f7bc70fa8d6a', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('14', '1', '10.00', 'purple', 'M', 'sample product name 2', '482a0801-495b-44e4-8379-f7bc70fa8d6a', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('15', '1', '3.00', 'white', 'XS', 'sample product name 3', '482a0801-495b-44e4-8379-f7bc70fa8d6a', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('16', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('17', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('18', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('19', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'CANCEL_REQUEST', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('20', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'RECEIVED_CANCEL_REQUEST', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('21', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'CANCELED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');



-- order 6
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('84c6354e-3e59-41f3-8c66-726e1a608649', 'order_25qCjRPSZ4m', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('a0PVw5zItkX', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', '84c6354e-3e59-41f3-8c66-726e1a608649', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('kbTta3o_D0H', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, '84c6354e-3e59-41f3-8c66-726e1a608649');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('16', '3', '5.00', 'white', 'XS', 'sample product name 1', '84c6354e-3e59-41f3-8c66-726e1a608649', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('17', '1', '10.00', 'purple', 'M', 'sample product name 2', '84c6354e-3e59-41f3-8c66-726e1a608649', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('18', '1', '3.00', 'white', 'XS', 'sample product name 3', '84c6354e-3e59-41f3-8c66-726e1a608649', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('22', '84c6354e-3e59-41f3-8c66-726e1a608649', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('23', '84c6354e-3e59-41f3-8c66-726e1a608649', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('24', '84c6354e-3e59-41f3-8c66-726e1a608649', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('25', '84c6354e-3e59-41f3-8c66-726e1a608649', 'SHIPPED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');



-- order 7
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'order_Pj0lXUOu5cG', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('MujjWrYrqGC', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('wC7PAquGlXT', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('19', '3', '5.00', 'white', 'XS', 'sample product name 1', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('20', '1', '10.00', 'purple', 'M', 'sample product name 2', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('21', '1', '3.00', 'white', 'XS', 'sample product name 3', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('26', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('27', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('28', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('29', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'SHIPPED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('30', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'DELIVERED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');



-- order 7
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('5e5b3163-acba-4c18-90f7-310e0f104786', 'order_CLKDGbYkgvg', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');


-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('xHQnBKtE4Sj', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', '5e5b3163-acba-4c18-90f7-310e0f104786', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('rhvX7tDoVw4', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, '5e5b3163-acba-4c18-90f7-310e0f104786');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('22', '3', '5.00', 'white', 'XS', 'sample product name 1', '5e5b3163-acba-4c18-90f7-310e0f104786', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('23', '1', '10.00', 'purple', 'M', 'sample product name 2', '5e5b3163-acba-4c18-90f7-310e0f104786', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('24', '1', '3.00', 'white', 'XS', 'sample product name 3', '5e5b3163-acba-4c18-90f7-310e0f104786', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('31', '5e5b3163-acba-4c18-90f7-310e0f104786', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('32', '5e5b3163-acba-4c18-90f7-310e0f104786', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('33', '5e5b3163-acba-4c18-90f7-310e0f104786', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('34', '5e5b3163-acba-4c18-90f7-310e0f104786', 'SHIPPED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('35', '5e5b3163-acba-4c18-90f7-310e0f104786', 'DELIVERED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('36', '5e5b3163-acba-4c18-90f7-310e0f104786', 'RETURN_REQUEST', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');


-- order 8
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('6511c283-5405-4335-b227-5ee3d6d9ed74', 'order_gAQqZSby9HD', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');


-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('75fowF8-GcS', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', '6511c283-5405-4335-b227-5ee3d6d9ed74', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('IYYA_pzDiWa', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, '6511c283-5405-4335-b227-5ee3d6d9ed74');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('25', '3', '5.00', 'white', 'XS', 'sample product name 1', '6511c283-5405-4335-b227-5ee3d6d9ed74', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('26', '1', '10.00', 'purple', 'M', 'sample product name 2', '6511c283-5405-4335-b227-5ee3d6d9ed74', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('27', '1', '3.00', 'white', 'XS', 'sample product name 3', '6511c283-5405-4335-b227-5ee3d6d9ed74', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('37', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('38', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('39', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('41', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'SHIPPED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('42', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'DELIVERED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('43', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'RETURN_REQUEST', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('44', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'RECEIVED_RETURN_REQUEST', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');



-- order 9
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('8fa1e551-d192-4203-badb-a4bb85df3f11', 'order_zNmyD8K8fmg', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');


-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('2KwXHF-U-Le', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', '8fa1e551-d192-4203-badb-a4bb85df3f11', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('ZEVytYjjl2R', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, '8fa1e551-d192-4203-badb-a4bb85df3f11');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('28', '3', '5.00', 'white', 'XS', 'sample product name 1', '8fa1e551-d192-4203-badb-a4bb85df3f11', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('29', '1', '10.00', 'purple', 'M', 'sample product name 2', '8fa1e551-d192-4203-badb-a4bb85df3f11', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('30', '1', '3.00', 'white', 'XS', 'sample product name 3', '8fa1e551-d192-4203-badb-a4bb85df3f11', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('45', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('46', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('47', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('48', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'SHIPPED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('49', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'DELIVERED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('50', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'RETURN_REQUEST', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('51', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'RECEIVED_RETURN_REQUEST', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('52', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'RETURNED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');



-- order 10
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('a3324b0a-199b-4529-a75e-d0d6bc25fcce', 'order_jGerxI-wkrY', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('49OcRyWONKD', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('T4sqGQMYVfQ', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, 'a3324b0a-199b-4529-a75e-d0d6bc25fcce');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('31', '3', '5.00', 'white', 'XS', 'sample product name 1', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('32', '1', '10.00', 'purple', 'M', 'sample product name 2', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('33', '1', '3.00', 'white', 'XS', 'sample product name 3', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('53', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('54', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('55', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', 'ERROR', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');



-- order 11
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('4558b985-1675-49e1-994f-0d08bc881486', 'order_g1W2H-d02TW', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');


-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('-CqVG44Klp5', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', '4558b985-1675-49e1-994f-0d08bc881486', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('WtW21H-Duuv', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, '4558b985-1675-49e1-994f-0d08bc881486');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('34', '3', '5.00', 'white', 'XS', 'sample product name 1', '4558b985-1675-49e1-994f-0d08bc881486', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('35', '1', '10.00', 'purple', 'M', 'sample product name 2', '4558b985-1675-49e1-994f-0d08bc881486', '9', '773f1fc7-c037-447a-a5b2-f790ea2302e5');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('36', '1', '3.00', 'white', 'XS', 'sample product name 3', '4558b985-1675-49e1-994f-0d08bc881486', '14', 'de7e767d-cd0c-4705-b633-353b2340715b');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('56', '4558b985-1675-49e1-994f-0d08bc881486', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('57', '4558b985-1675-49e1-994f-0d08bc881486', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('58', '4558b985-1675-49e1-994f-0d08bc881486', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('59', '4558b985-1675-49e1-994f-0d08bc881486', 'SHIPPED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('60', '4558b985-1675-49e1-994f-0d08bc881486', 'DELIVERED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');



-- order 12 (order product might be null if the product is deleted)
INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`, `is_guest`)
VALUES ('e3da531d-eca6-420c-8446-ea70b1824f11', 'order_JmsEk_DlzFB', '23.00', '5.00', '3.00', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id', '0');


-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('_HRxxoOzhC6', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code', 'e3da531d-eca6-420c-8446-ea70b1824f11', NULL);
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `shipping_order_id`, `billing_order_id`)
VALUES ('HcpQEiYZ3lU', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code', NULL, 'e3da531d-eca6-420c-8446-ea70b1824f11');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('37', '3', '5.00', 'white', 'XS', 'sample product name 1', 'e3da531d-eca6-420c-8446-ea70b1824f11', '1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('38', '1', '10.00', 'purple', 'M', 'sample product name 2', 'e3da531d-eca6-420c-8446-ea70b1824f11', NULL, NULL);
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`, `product_id`)
VALUES ('39', '1', '3.00', 'white', 'XS', 'sample product name 3', 'e3da531d-eca6-420c-8446-ea70b1824f11', NULL, NULL);

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('61', 'e3da531d-eca6-420c-8446-ea70b1824f11', 'DRAFT', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('62', 'e3da531d-eca6-420c-8446-ea70b1824f11', 'ORDERED', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('63', 'e3da531d-eca6-420c-8446-ea70b1824f11', 'PAID', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('64', 'e3da531d-eca6-420c-8446-ea70b1824f11', 'SHIPPED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `user_id`, `is_guest`)
VALUES ('65', 'e3da531d-eca6-420c-8446-ea70b1824f11', 'DELIVERED', '1', 'c7081519-16e5-4f92-ac50-1834001f12b9', '0');




-- reviews 
-- no duplication on the combination of user_id & product_id
-- make sure these ids exist on the other sql

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 1', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '4.9', 'sample title 2', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '2.0', 'sample title 3', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.0', 'sample title 4', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.0', 'sample title 5', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '0.5', 'sample title 6', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '4.0', 'sample title 7', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '5.0', 'sample title 8', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '2.0', 'sample title 9', 'sample description', 0); 


INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('19829772-893b-4639-ab6b-173e86b5189e', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 10', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('19829772-893b-4639-ab6b-173e86b5189e', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '4.9', 'sample title 12', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('19829772-893b-4639-ab6b-173e86b5189e', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '2.0', 'sample title 13', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('729ff8a6-df19-4a1a-bdbe-639e429d5654', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.0', 'sample title 14', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('729ff8a6-df19-4a1a-bdbe-639e429d5654', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.0', 'sample title 15', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('729ff8a6-df19-4a1a-bdbe-639e429d5654', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '0.5', 'sample title 16', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('862fb67f-4d03-4554-a99a-9b66e0d8f82e', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '4.0', 'sample title 17', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('862fb67f-4d03-4554-a99a-9b66e0d8f82e', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '5.0', 'sample title 18', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('862fb67f-4d03-4554-a99a-9b66e0d8f82e', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '2.0', 'sample title 19', 'sample description', 0); 

