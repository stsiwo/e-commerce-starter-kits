-- member user
UPDATE `companies`
INNER JOIN `users` ON `users`.`user_id` = `companies`.`user_id`
SET `companies`.`postal_code` = 'V5R 2C2'
WHERE `users`.`user_id` = 'e95bf632-1518-4bf2-8ba9-cd8b7587530b';


