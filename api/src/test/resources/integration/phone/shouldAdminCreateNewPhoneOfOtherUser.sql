-- users

INSERT INTO `ec-schema`.`users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`, `created_at`, `updated_at`, `active`) 
VALUES ('29c845ad-54b1-430a-8a71-5caba98d5978', 'first_name_1', 'last_name_1', 'test_1@test.com', '$2a$10$iRnpNpN7XsJq3wjHwRza1eda6CKz.GnMfLAmnozUXepQnm3w7i1yS', '2', '2020-01-01 16:27:55', '2020-01-01 16:27:55', 'ACTIVE');

-- phone

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234567890', '+12', '29c845ad-54b1-430a-8a71-5caba98d5978'); -- must match with the user above

INSERT INTO `ec-schema`.`phones` (`phone_number`, `country_code`, `user_id`) VALUES ('1234234234', '+1', '29c845ad-54b1-430a-8a71-5caba98d5978'); -- must match with the user above
