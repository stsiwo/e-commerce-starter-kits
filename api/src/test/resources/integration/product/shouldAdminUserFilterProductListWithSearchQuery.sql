-- categories
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('1', 'category_1', 'category_1_desc', 'category_path_1');
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('2', 'category_2', 'category_2_desc', 'category_path_2');
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('3', 'category_3', 'category_3_desc', 'category_path_3');
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('4', 'category_4', 'category_4_desc', 'category_path_4');

-- test users
-- additional member user 
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'a2901f19-715a-44fe-9701-fae6713fd764', 'Member', 'Test', 'test_member2@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2');



--- products
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`, `is_public`) 
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'test_name_1', 'test_desc_1', 'test-path-1', '12.21', '4.21', '1', '0');

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

-- product images
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('10', '/images/product-image-0.png', 'product-image-0', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0); 

INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('11', '/images/product-image-1.png', 'product-image-1', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0); 

INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('12', '', 'product-image-2', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);

INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('13', '/images/product-image-3.png', 'product-image-3', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);

INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('14', '', 'product-image-4', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', 0);

-- review
INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 1', 'sample description', 1); -- this user is main member test user. check inital script

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 3', 'sample description', 0); -- to make sure only retrieve verified review. 



-- prudct 2
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`, `is_public`) 
VALUES ('6267c525-396f-4ea0-8dfe-706c95036e5c', 'game_name_2', 'game_desc_2', 'test-path-2', '12.21', '4.21', '1', '1');

-- product variant 2-1 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('6', '1', 'white', '123.00', '12', '6267c525-396f-4ea0-8dfe-706c95036e5c', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-2 (unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('7', '2', 'black', '13.00', '5', '6267c525-396f-4ea0-8dfe-706c95036e5c', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-3 (discount & unit price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_discount_price`,  `variant_discount_start_date`, `variant_discount_end_date`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('8', '3', 'aqua', '13.00', '7.00', '2020-01-01 00:00:01', '2020-01-07 00:00:00', '6', '6267c525-396f-4ea0-8dfe-706c95036e5c', '1.00', '1.00', '1.00', '1.00');

-- product variant 2-4 (no price)
INSERT INTO `product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`)
VALUES ('9', '4', 'aqua', '6', '6267c525-396f-4ea0-8dfe-706c95036e5c', '1.00', '1.00', '1.00', '1.00');


-- product images
INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('15', '/images/product-image-0.png', 'product-image-0', '6267c525-396f-4ea0-8dfe-706c95036e5c', 0); 

INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('16', '/images/product-image-1.png', 'product-image-1', '6267c525-396f-4ea0-8dfe-706c95036e5c', 0); 

INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('17', '', 'product-image-2', '6267c525-396f-4ea0-8dfe-706c95036e5c', 0);

INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('18', '/images/product-image-3.png', 'product-image-3', '6267c525-396f-4ea0-8dfe-706c95036e5c', 0);

INSERT INTO `ec-schema`.`product_images` (`product_image_id`, `product_image_path`, `product_image_name`, `product_id`, `is_change`) 
VALUES ('19', '', 'product-image-4', '6267c525-396f-4ea0-8dfe-706c95036e5c', 0);

-- review
INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '6267c525-396f-4ea0-8dfe-706c95036e5c', '4.1', 'sample title 2', 'sample description', 1); -- this user is main member test user. check inital script 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', '6267c525-396f-4ea0-8dfe-706c95036e5c', '4.7', 'sample title 4', 'sample description', 0); -- to make sure only retrieve verified review. 

-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('db600487-5142-4121-8b3f-237c2d883c14', 'Test Product game 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-5', '20.21', '1', '1');

-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('8beac768-b535-45e3-90b9-c55029c8f522', 'Test game Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-6', '20.21', '1', '1');


-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('3c647e1e-20b1-4367-890b-207776472c0f', 'game Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-7', '20.21', '1', '1');

-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('da8774dc-223b-4e84-bbc9-53a520774d37', 'Test Product Name game', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-8', '20.21', '1', '1');


-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('d3e29e16-f939-4e26-975f-3742e3d03fa7', 'Test Product Name 5', 'It is a game established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-9', '20.21', '1', '1');

-- product (category=1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `category_id`, `is_public`)
VALUES ('c3671935-39c3-4b9e-9846-9e8aef1f8ea3', 'Test Product Name 5', 'It is a game established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-10', '20.21', '1', '1');
