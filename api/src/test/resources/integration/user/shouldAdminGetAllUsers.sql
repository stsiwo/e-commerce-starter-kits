-- member user with no phones and addresses
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( 'a2901f19-715a-44fe-9701-fae6713fd764', 'Member', 'Test', 'test_member2@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');
  
  
-- member user with phones only
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( 'd2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', 'Member', 'Test', 'test_member3@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');
  
INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', 'd2474e1c-4c69-467b-8a7f-11d3ffe8d6d3'); 
  

-- member user with phones and address
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( '19829772-893b-4639-ab6b-173e86b5189e', 'Member', 'Test', 'test_member4@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '19829772-893b-4639-ab6b-173e86b5189e'); 

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) 
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '19829772-893b-4639-ab6b-173e86b5189e'); 


-- member user with  address only
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( '729ff8a6-df19-4a1a-bdbe-639e429d5654', 'Member', 'Test', 'test_member6@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`) 
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '729ff8a6-df19-4a1a-bdbe-639e429d5654'); 


-- member user with multiple phones and addresses
INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( '862fb67f-4d03-4554-a99a-9b66e0d8f82e', 'Member', 'Test', 'test_member7@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '862fb67f-4d03-4554-a99a-9b66e0d8f82e'); 
INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '862fb67f-4d03-4554-a99a-9b66e0d8f82e'); 
INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '862fb67f-4d03-4554-a99a-9b66e0d8f82e'); 

INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`)
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '862fb67f-4d03-4554-a99a-9b66e0d8f82e');
INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`)
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '862fb67f-4d03-4554-a99a-9b66e0d8f82e');
INSERT INTO `ec-schema`.`addresses` (`address_1`, `address_2`, `city`, `province`, `country`, `postal_code`, `is_billing_address`, `is_shipping_address`, `user_id`)
VALUES ('test_address_1', 'test_address_2', 'test_city'    , 'test_province', 'CA', 'test_postal_code', '0', '0', '862fb67f-4d03-4554-a99a-9b66e0d8f82e');



INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '5ee7493b-0762-46d2-9d19-eeb6b4cb47d2', 'Member', 'Test', 'test_member8@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '17256569-8ea3-4ba4-9301-507da1620734', 'Member', 'Test', 'test_member9@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '70e613e4-1fdd-4b7f-9896-7d78a1f96441', 'Member', 'Test', 'test_member10@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '738b5b6c-35ee-43f3-b74b-6085c151cafe', 'Member', 'Test', 'test_member11@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '991b3126-1e81-4fdf-965a-7e3977c46ab2', 'Member', 'Test', 'test_member12@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'e3976db2-d81d-4a69-b41e-e2be13118102', 'Member', 'Test', 'test_member13@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'e9761f0c-e9f2-4f92-ad59-5ffe7aad18df', 'Member', 'Test', 'test_member14@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'f1f77931-7fa5-4269-8352-7d072b81290c', 'Member', 'Test', 'test_member15@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( '87380264-56f3-4d2d-a185-158cff70cedf', 'Member', 'Test', 'test_member16@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`)
VALUES ( 'a41fbab1-af7d-48bd-8cf8-89a6b8b2b6e2', 'Member', 'Test', 'test_member17@test.com', '$2a$10$elqDcxXm.YgyuwRS/TcnfuwI4qO8JMKRDJqc4lJatXJ9LIRRhqzB2', '2');


