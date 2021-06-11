-- base script for unit test.
-- you can put any common rows if necessary.

-- test member user 
-- put 'IGNORE' since integtest might create this record. I need to refactor this.
INSERT IGNORE INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `user_type_id`) 
VALUES ( 'c7081519-16e5-4f92-ac50-1834001f12b9', 'Member', 'Test', 'test_member1@test.com', '$2y$10$bqu9h3ffWjQKjp5p3cB9iudPB75agR2smLd0dme7edCwti7mAznNy', '2');

