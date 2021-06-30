-- category
INSERT INTO `ec-schema`.`categories` (`category_id`, `category_name`, `category_description`, `category_path`) VALUES ('1', 'category_1', 'category_1_desc', 'category_path_1');

-- products
INSERT INTO `ec-schema`.`products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `average_review_point`, `category_id`) 
VALUES ('14fe9644-64d8-44fc-a74d-b6b5472428f5', 'duplcated_product_name', 'test_desc_1', 'test-path', '12.21', '4.21', '1'); -- make sure product id != 9e3e67ca-d058-41f0-aad5-4f09c956a81f
