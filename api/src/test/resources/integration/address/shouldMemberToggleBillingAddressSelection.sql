INSERT INTO `ec-schema`.`addresses` (`address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) 
VALUES (100, 'test_address_1', 'test_address_2', 'test_city', 'test_province', 'CA', 'V5R 2C2', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9'); -- must match with test member user and make sure address_id (e.g., 100) match with its corresponding json. this is new billing address and it will be true after this request.

INSERT INTO `ec-schema`.`addresses` (`address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) 
VALUES (101, 'test_address_1', 'test_address_2', 'test_city', 'test_province', 'CA', 'V5R 2C2', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9'); -- must match with test member user and make sure address_id (e.g., 100) match with its corresponding json. this is old billing address and it will be false after this request.

INSERT INTO `ec-schema`.`addresses` (`address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) 
VALUES (102, 'test_address_1', 'test_address_2', 'test_city', 'test_province', 'CA', 'V5R 2C2', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9'); -- must match with test member user and make sure address_id (e.g., 100) match with its corresponding json
