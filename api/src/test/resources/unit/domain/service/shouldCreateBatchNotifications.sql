-- member user with no phones and addresses
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`, `active`) 
VALUES ( 'a2901f19-715a-44fe-9701-fae6713fd764', 'Member', 'Test', 'test_member2@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2', 'ACTIVE');


-- member user with phones only
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`, `active`) 
VALUES ( 'd2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', 'Member', 'Test', 'test_member3@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2', 'ACTIVE');

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', 'd2474e1c-4c69-467b-8a7f-11d3ffe8d6d3'); 


-- member user with phones and address
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`, `active`) 
VALUES ( '19829772-893b-4639-ab6b-173e86b5189e', 'Member', 'Test', 'test_member4@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2', 'ACTIVE');

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '19829772-893b-4639-ab6b-173e86b5189e'); 

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) 
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '19829772-893b-4639-ab6b-173e86b5189e'); 


-- member user with  address only
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( '729ff8a6-df19-4a1a-bdbe-639e429d5654', 'Member', 'Test', 'test_member6@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2');

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) 
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '729ff8a6-df19-4a1a-bdbe-639e429d5654'); 


-- member user with multiple phones and addresses
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( '862fb67f-4d03-4554-a99a-9b66e0d8f82e', 'Member', 'Test', 'test_member7@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2');

