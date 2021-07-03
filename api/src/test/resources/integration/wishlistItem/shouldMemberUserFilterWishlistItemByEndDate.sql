-- category
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('1', 'category_1', 'category_1_desc', 'category_1_path');

-- product
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`, `cheapest_price`, `highest_price`, `release_date`) 
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'test_name_1', 'test_desc_1', 'test-path-1', '12.21', '4.21', '1', 11.00, 20.00, '2021-01-07 00:00:00'); -- make sure product id = 9e3e67ca-d058-41f0-aad5-4f09c956a81f

-- product variants
INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('1', '1', 'white', '12.00', '12', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 1

INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('2', '1', 'white', '20.00', '12', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 2

INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('3', '1', 'white', '11.00', '12', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 3 

-- product
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`, `cheapest_price`, `highest_price`, `release_date`) 
VALUES ('1782be81-2094-4f72-bd02-6bc1129b23e3', 'test_name_2', 'test_desc_2', 'test-path-2', '60.21', '2.21', '1', 40.00, 60.21, '2019-01-07 00:00:00'); -- make sure product id = 1782be81-2094-4f72-bd02-6bc1129b23e3

-- product variants
INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('4', '1', 'white', '40.00', '12', '1782be81-2094-4f72-bd02-6bc1129b23e3', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 4

INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('5', '1', 'white', '50.00', '12', '1782be81-2094-4f72-bd02-6bc1129b23e3', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 5

INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('6', '1', 'white', '60.00', '12', '1782be81-2094-4f72-bd02-6bc1129b23e3', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 6 

-- product
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`, `cheapest_price`, `highest_price`, `release_date`) 
VALUES ('e31414e2-d497-45c2-a114-cd4902d0ab61', 'test_name_2', 'test_desc_2', 'test-path-3', '100.21', '1.21', '1', 100.21, 140.00, '2020-01-07 00:00:00'); -- make sure product id = e31414e2-d497-45c2-a114-cd4902d0ab61

-- product variants
INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('7', '1', 'white', '140.00', '12', 'e31414e2-d497-45c2-a114-cd4902d0ab61', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 7

INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('8', '1', 'white', '120.00', '12', 'e31414e2-d497-45c2-a114-cd4902d0ab61', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 8

INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('9', '1', 'white', '111.00', '12', 'e31414e2-d497-45c2-a114-cd4902d0ab61', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 9 


--- wishlist_items

INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`) 
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '1'); -- user_id = this test member user's id 

INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`) 
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '2'); -- user_id = this test member user's id 

INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`) 
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '5'); -- user_id = this test member user's id 

INSERT INTO `ec-schema`.`wishlist_items` (`user_id`, `variant_id`) 
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '9'); -- user_id = this test member user's id 

