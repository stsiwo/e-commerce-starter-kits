-- dummy user
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '19829772-893b-4639-ab6b-173e86b5189e', 'Member', 'Test', 'test_member4@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

-- member user
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'a2901f19-715a-44fe-9701-fae6713fd764', 'Member', 'Test', 'test_member2@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


-- category
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('1', 'category_1', 'category_1_desc', 'category_path_1');
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('2', 'category_2', 'category_2_desc', 'category_path_2');

-- products
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`) 
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'test_name_1', 'test_desc_1', 'test-path', '12.21', '4.21', '1'); -- make sure product id = 9e3e67ca-d058-41f0-aad5-4f09c956a81f

-- product variants
INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('1', '1', 'white', '123.00', '12', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 1

-- product images
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('10', 'domain/products/9e3e67ca-d058-41f0-aad5-4f09c956a81f/images/product-image-0-xxxx.png', 'product-image-0', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0); -- make sure product_image_id match with input json script
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('11', 'domain/products/9e3e67ca-d058-41f0-aad5-4f09c956a81f/images/product-image-1-yyyy.png', 'product-image-1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);-- make sure product_image_id match with input json script
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('12', '', 'product-image-2', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);-- make sure product_image_id match with input json script
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('13', 'domain/products/9e3e67ca-d058-41f0-aad5-4f09c956a81f/images/product-image-3-zzzz.png', 'product-image-3', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);-- make sure product_image_id match with input json script
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) VALUES ('14', '', 'product-image-4', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);-- make sure product_image_id match with input json script

--- reviews
INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 1', 'sample description', 1);

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('19829772-893b-4639-ab6b-173e86b5189e', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '4.9', 'sample title 2', 'sample description', 1);

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '2.0', 'sample title 3', 'sample description', 0);
