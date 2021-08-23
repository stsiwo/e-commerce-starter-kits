-- member user
UPDATE `users`
SET `active` = 'TEMP', `verification_token` = 'dummy_token', `verification_token_expiry_date` = '2030-08-07 00:00:00'
WHERE `user_id` = 'c7081519-16e5-4f92-ac50-1834001f12b9';

