-- product (category 1)
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `category_id`, `is_public`)
VALUES ('9e3e67ca-d058-41f0-aad5-4f09c956a81f', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-1-1', '12.21', '0', '1', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('773f1fc7-c037-447a-a5b2-f790ea2302e5', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-1-2', '12.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '1', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('a362bbc3-5c70-4e82-96d3-5fa1e3103332', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-3', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '1', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('de7e767d-cd0c-4705-b633-353b2340715b', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-4', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '1', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('db600487-5142-4121-8b3f-237c2d883c14', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-1-5', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '1', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `category_id`, `is_public`)
VALUES ('bff91a24-02dd-4762-9ddd-6972ee15c9f7', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-2-1', '12.21', '0', '2', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('4f545dc7-ed77-4049-83ef-26904b85a4c2', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-2-2', '12.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '2', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('eac39de7-8e2d-4fbc-b43c-95c5681bc16b', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-2-3', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '2', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('df9df4d4-b58d-4649-98e1-95da5e1fc61a', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-2-4', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '2', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('a1920149-ff55-4359-8e32-9dd2c53e3808', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-2-5', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '1', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `category_id`, `is_public`)
VALUES ('ae0c9bb9-0f2d-4012-8363-5c247c0229d9', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-3-1', '12.21', '0', '3', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('839e4614-7ae6-49f4-b6be-4fb3164cbfc9', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-3-2', '12.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '3', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('3a360687-9214-49b1-b19d-57ec41faab10', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-3-3', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '3', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('ef109f1f-1c4d-435b-9d9e-520e0ce65fd2', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-3-4', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '3', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('95058bfb-a3f6-446a-a3d0-8c1e490ef90f', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-3-5', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '3', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `category_id`, `is_public`)
VALUES ('0866e74c-eeb8-49a4-9996-ca4749b52b72', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-4-1', '12.21', '0', '4', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('ba3468cd-c14d-4ec9-b635-7c49c8cc03d1', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-4-2', '12.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '4', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('317227bc-abdb-4449-8297-5e47589a1ef1', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-4-3', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '4', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('dbc5f9c4-14f8-4d2d-b8ee-d3134ada00f9', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-4-4', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '4', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('6dd568cb-6c4d-4667-9f25-902c8d0fb57d', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-4-5', '20.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '4', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `category_id`, `is_public`)
VALUES ('c72e8fcf-0dfa-4c04-b34e-f604c7ddbad9', 'Test Product Name That Should Be Long One For Testing Purpose.', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-5-1', '12.21', '0', '5', '1'); 

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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`, `is_public`)
VALUES ('ee471735-dccc-4a06-81c3-109506ab3de4', 'Test Product Name 2', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', 'test-product-path-5-2', '12.21', '0', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '5', '1'); 


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
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`)
VALUES ('af416205-26f5-4512-8197-798241576303', 'Test Product Name 3', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-5-3', '20.21', '1', '10.00', '2020-01-07 00:00:00', '2023-02-07 00:00:00', '5'); 


-- product (category = 5) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`)
VALUES ('c80dad9d-cd09-4445-82c2-8f1fcca914ac', 'Test Product Name 4', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-5-4', '20.21', '1', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '5'); 


-- product (category = 5) 
INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_path`, `product_base_unit_price`, `is_discount`, `product_base_discount_price`, `product_base_discount_start_date`, `product_base_discount_end_date`, `category_id`)
VALUES ('ae9da1ca-eb40-4bb1-8738-fca35aad4f65', 'Test Product Name 5', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'test-product-path-5-5', '20.21', '1', '10.00', '2020-01-07 00:00:00', '2020-02-07 00:00:00', '5'); 
