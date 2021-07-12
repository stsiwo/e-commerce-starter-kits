
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'd2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', 'Member', 'Test', 'test_member3@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '19829772-893b-4639-ab6b-173e86b5189e', 'Member', 'Test', 'test_member4@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

-- categories
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('1', 'category_1', 'category_1_desc', 'category_path_1');
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('2', 'category_2', 'category_2_desc', 'category_path_2');
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('3', 'category_3', 'category_3_desc', 'category_path_3');
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('4', 'category_4', 'category_4_desc', 'category_path_4');


--- products
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`, `is_public`) 
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'test_name_1', 'test_desc_1', 'test-path-1', '12.21', '4.21', '1', '1'); -- must match with test case: product_path

-- product variant 1-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('1', '1', 'white', '123.00', '50', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00');


INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`) 
VALUES ('6267c525-396f-4ea0-8dfe-706c95036e5c', 'game_name_2', 'game_desc_2', 'test-path-2', '12.21', '4.21', '1');

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '6267c525-396f-4ea0-8dfe-706c95036e5c', '3.9', 'sample title 1', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('19829772-893b-4639-ab6b-173e86b5189e', '6267c525-396f-4ea0-8dfe-706c95036e5c', '4.9', 'sample title 2', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '6267c525-396f-4ea0-8dfe-706c95036e5c', '2.0', 'sample title 3', 'sample description', 0); 

