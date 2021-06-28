-- category
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('1', 'category_1', 'category_1_desc', 'category_path_1');
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('2', 'category_2', 'category_2_desc', 'category_path_2');

-- products
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`) 
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'test_name_1', 'test_desc_1', 'test-path', '12.21', '4.21', '1'); -- make sure product id = 9e3e67ca-d058-41f0-aad5-4f09c956a81f

-- product variants
INSERT INTO `ec-schema`.`product_variants` (`variant_id`, `product_size_id`, `variant_color`, `variant_unit_price`, `variant_stock`, `product_id`, `variant_weight`, `variant_width`, `variant_height`, `variant_length`) 
VALUES ('1', '1', 'white', '123.00', '12', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '1.00', '1.00', '1.00', '1.00'); -- make sure variant id = 1
