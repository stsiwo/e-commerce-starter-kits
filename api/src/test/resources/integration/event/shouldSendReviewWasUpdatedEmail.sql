-- main test member user  (this one is already inserted by initial script)
-- INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
-- VALUES ( 'c7081519-16e5-4f92-ac50-1834001f12b9', 'Member', 'Test', 'test_member1@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2');

-- member user with no phones and addresses
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( 'a2901f19-715a-44fe-9701-fae6713fd764', 'Member', 'Test', 'test_member2@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2');


-- member user with phones only
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( 'd2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', 'Member', 'Test', 'test_member3@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2');



-- categories
INSERT INTO `categories` (`category_id`, `category_name`, `category_description`, `category_path`)
VALUES ('1', 'Test Category 1', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-category-1');



-- product (category 1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`)
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-1-1', '12.21', '1');

-- product variant 1-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('1', '1', 'white', '123.00', '12', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');

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
VALUES ('9', '4', 'aqua', '6', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.00', '1.00', '1.00', '1.00');


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
VALUES ('13', '4', 'aqua', '6', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '1.00', '1.00', '1.00', '1.00');


-- reviews
INSERT INTO `reviews` (`review_id`, `user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('3', 'c7081519-16e5-4f92-ac50-1834001f12b9', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 1', 'sample description', 0);

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


