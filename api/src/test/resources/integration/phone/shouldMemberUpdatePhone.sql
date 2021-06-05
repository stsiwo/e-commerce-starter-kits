INSERT INTO `ec-schema`.`phones` (`phone_id`, `phone_number`, `country_code`, `user_id`) VALUES ('100', '1234567890', '+12', 'c7081519-16e5-4f92-ac50-1834001f12b9'); -- must match with test member user and make sure address_id (e.g., 100) match with its corresponding json. this is target phone id to toggle is_selected to be true after request.


INSERT INTO `ec-schema`.`phones` (`phone_id`, `phone_number`, `country_code`, `user_id`, `is_selected`) VALUES ('101', '1234567890', '+12', 'c7081519-16e5-4f92-ac50-1834001f12b9', 1); -- must match with test member user and make sure address_id (e.g., 100) match with its corresponding json. this is old phone id to be toggled to false after request.


INSERT INTO `ec-schema`.`phones` (`phone_id`, `phone_number`, `country_code`, `user_id`) VALUES ('102', '1234567890', '+12', 'c7081519-16e5-4f92-ac50-1834001f12b9'); -- must match with test member user and make sure address_id (e.g., 100) match with its corresponding json


