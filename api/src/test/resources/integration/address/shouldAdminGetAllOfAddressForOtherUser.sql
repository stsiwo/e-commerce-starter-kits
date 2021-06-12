-- users

INSERT INTO `ec-schema`.`users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`, `created_at`, `updated_at`, `active`) 
VALUES ('29c845ad-54b1-430a-8a71-5caba98d5978', 'first_name_1', 'last_name_1', 'test_1@test.com', '$2a$10$iRnpNpN7XsJq3wjHwRza1eda6CKz.GnMfLAmnozUXepQnm3w7i1yS', '2', '2020-01-01 16:27:55', '2020-01-01 16:27:55', 'ACTIVE');

-- address

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) VALUES ('test_address_1', 'test_address_2', 'test_city', 'test_province', 'CA', 'test_postal_code', '0', '0', '29c845ad-54b1-430a-8a71-5caba98d5978'); -- must match with the user above

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) VALUES ('test_address_1_1', 'test_address_2_1', 'test_city', 'test_province', 'CA', 'test_postal_code', '0', '0', '29c845ad-54b1-430a-8a71-5caba98d5978'); -- must match with the user above

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) VALUES ('test_address_1_1', 'test_address_2_1', 'test_city', 'test_province', 'CA', 'test_postal_code', '0', '0', '29c845ad-54b1-430a-8a71-5caba98d5978'); -- must match with the user above 

