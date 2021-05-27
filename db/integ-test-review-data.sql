-- reviews 
-- no duplication on the combination of user_id & product_id
-- make sure these ids exist on the other sql

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 1', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '4.9', 'sample title 2', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('c7081519-16e5-4f92-ac50-1834001f12b9', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '2.0', 'sample title 3', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.0', 'sample title 4', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.0', 'sample title 5', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('a2901f19-715a-44fe-9701-fae6713fd764', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '0.5', 'sample title 6', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '4.0', 'sample title 7', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '5.0', 'sample title 8', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('d2474e1c-4c69-467b-8a7f-11d3ffe8d6d3', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '2.0', 'sample title 9', 'sample description', 0); 


INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('19829772-893b-4639-ab6b-173e86b5189e', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.9', 'sample title 10', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('19829772-893b-4639-ab6b-173e86b5189e', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '4.9', 'sample title 12', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('19829772-893b-4639-ab6b-173e86b5189e', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '2.0', 'sample title 13', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('729ff8a6-df19-4a1a-bdbe-639e429d5654', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '3.0', 'sample title 14', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('729ff8a6-df19-4a1a-bdbe-639e429d5654', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '1.0', 'sample title 15', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('729ff8a6-df19-4a1a-bdbe-639e429d5654', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '0.5', 'sample title 16', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('862fb67f-4d03-4554-a99a-9b66e0d8f82e', '9e3e67ca-d058-41f0-aad5-4f09c956a81f', '4.0', 'sample title 17', 'sample description', 0); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('862fb67f-4d03-4554-a99a-9b66e0d8f82e', '773f1fc7-c037-447a-a5b2-f790ea2302e5', '5.0', 'sample title 18', 'sample description', 1); 

INSERT INTO `reviews` (`user_id`, `product_id`, `review_point`, `review_title`, `review_description`, `is_verified`)
VALUES ('862fb67f-4d03-4554-a99a-9b66e0d8f82e', 'a362bbc3-5c70-4e82-96d3-5fa1e3103332', '2.0', 'sample title 19', 'sample description', 0); 

