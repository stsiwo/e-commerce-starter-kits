-- MySQL Script generated by MySQL Workbench
-- Wed 19 May 2021 04:06:31 PM PDT
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema ec-schema
-- -----------------------------------------------------
-- stsDev ecommerce schema

-- -----------------------------------------------------
-- Schema ec-schema
--
-- stsDev ecommerce schema
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ec-schema` DEFAULT CHARACTER SET utf8mb4 ;
USE `ec-schema` ;

-- -----------------------------------------------------
-- Table `ec-schema`.`user_types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`user_types` (
  `user_type_id` BIGINT NOT NULL,
  `user_type` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`user_type_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`users` (
  `user_id` VARCHAR(36) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `avatar_image_path` VARCHAR(500) NULL,
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  `deleted_account_date` TIMESTAMP NULL,
  `deleted_account_reason` VARCHAR(1000) NULL,
  `user_type_id` BIGINT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  `stripe_customer_id` VARCHAR(100) NULL,
  `active` VARCHAR(45) NOT NULL DEFAULT 'TEMP' COMMENT 'either \'TEMP\', \'ACTIVE\', or \'BLACKLIST\'',
  `verification_token` VARCHAR(36) NOT NULL DEFAULT 'default-token',
  `verification_token_expiry_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `forgot_password_token` VARCHAR(36) NOT NULL DEFAULT 'default-token',
  `forgot_password_token_expiry_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  INDEX `FK_users__user_types_idx` (`user_type_id` ASC),
  CONSTRAINT `FK_users__user_types`
    FOREIGN KEY (`user_type_id`)
    REFERENCES `ec-schema`.`user_types` (`user_type_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`phones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`phones` (
  `phone_id` BIGINT NOT NULL AUTO_INCREMENT,
  `phone_number` VARCHAR(45) NOT NULL,
  `extension` VARCHAR(10) NULL,
  `country_code` VARCHAR(10) NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  `is_selected` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`phone_id`),
  INDEX `FK_phones__users_idx` (`user_id` ASC),
  CONSTRAINT `FK_phones__users`
    FOREIGN KEY (`user_id`)
    REFERENCES `ec-schema`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`addresses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`addresses` (
  `address_id` BIGINT NOT NULL AUTO_INCREMENT,
  `address_1` VARCHAR(100) NOT NULL,
  `address_2` VARCHAR(100) NULL,
  `city` VARCHAR(100) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `country` CHAR(2) NOT NULL COMMENT 'shipping api (Canada Post) require 2char country code, so match with it.',
  `postal_code` VARCHAR(20) NOT NULL,
  `is_billing_address` TINYINT(1) NULL,
  `is_shipping_address` TINYINT(1) NOT NULL DEFAULT 0,
  `user_id` VARCHAR(36) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`address_id`),
  INDEX `FK_addresses_users_idx` (`user_id` ASC),
  CONSTRAINT `FK_addresses_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `ec-schema`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`product_sizes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`product_sizes` (
  `product_size_id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_size_name` VARCHAR(50) NOT NULL,
  `product_size_description` VARCHAR(1000) NULL,
  PRIMARY KEY (`product_size_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`categories` (
  `category_id` BIGINT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL,
  `category_description` VARCHAR(1000) NULL,
  `category_path` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE INDEX `category_path_UNIQUE` (`category_path` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`products` (
  `product_id` VARCHAR(36) NOT NULL,
  `product_name` VARCHAR(500) NOT NULL,
  `product_description` VARCHAR(1000) NOT NULL,
  `product_path` VARCHAR(100) NOT NULL,
  `product_base_unit_price` DECIMAL(13,2) NULL,
  `product_base_discount_price` DECIMAL(13,2) NULL,
  `product_base_discount_start_date` TIMESTAMP NULL,
  `product_base_discount_end_date` TIMESTAMP NULL,
  `average_review_point` DECIMAL(13,2) NOT NULL DEFAULT 0,
  `is_discount` TINYINT(1) NOT NULL DEFAULT 0,
  `is_public` TINYINT(1) NOT NULL DEFAULT 0,
  `category_id` BIGINT NOT NULL,
  `release_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `note` VARCHAR(1000) NOT NULL DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`product_id`),
  INDEX `FK_products__categories_idx` (`category_id` ASC),
  UNIQUE INDEX `product_path_UNIQUE` (`product_path` ASC),
  CONSTRAINT `FK_products__categories`
    FOREIGN KEY (`category_id`)
    REFERENCES `ec-schema`.`categories` (`category_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`product_variants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`product_variants` (
  `variant_id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_size_id` BIGINT NOT NULL DEFAULT 1,
  `variant_color` VARCHAR(100) NOT NULL,
  `variant_unit_price` DECIMAL(13,2) NULL,
  `variant_discount_price` DECIMAL(13,2) NULL,
  `variant_discount_start_date` TIMESTAMP NULL,
  `variant_discount_end_date` TIMESTAMP NULL,
  `variant_stock` INT(11) NOT NULL DEFAULT 1,
  `is_discount` TINYINT(1) NOT NULL DEFAULT 0,
  `sold_count` INT(11) NOT NULL DEFAULT 0,
  `product_id` VARCHAR(36) NOT NULL,
  `note` VARCHAR(1000) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  `variant_weight` DECIMAL(6,2) NOT NULL COMMENT 'kg',
  `variant_height` DECIMAL(6,2) NOT NULL COMMENT 'cm',
  `variant_width` DECIMAL(6,2) NOT NULL COMMENT 'cm',
  `variant_length` DECIMAL(6,2) NOT NULL COMMENT 'cm',
  PRIMARY KEY (`variant_id`),
  INDEX `FK_product_variants__product_sizes_idx` (`product_size_id` ASC),
  INDEX `FK_product_variants__products_idx` (`product_id` ASC),
  CONSTRAINT `FK_product_variants__product_sizes`
    FOREIGN KEY (`product_size_id`)
    REFERENCES `ec-schema`.`product_sizes` (`product_size_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `FK_product_variants__products`
    FOREIGN KEY (`product_id`)
    REFERENCES `ec-schema`.`products` (`product_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`cart_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`cart_items` (
  `cart_item_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(36) NOT NULL,
  `variant_id` BIGINT NOT NULL,
  `is_selected` TINYINT(1) NOT NULL DEFAULT 0,
  `quantity` INT(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`cart_item_id`),
  INDEX `FK_carts__product_variants` (`variant_id` ASC),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC, `variant_id` ASC),
  INDEX `FK_carts__users` (`user_id` ASC),
  CONSTRAINT `FK_carts__users`
    FOREIGN KEY (`user_id`)
    REFERENCES `ec-schema`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_carts_product_variants`
    FOREIGN KEY (`variant_id`)
    REFERENCES `ec-schema`.`product_variants` (`variant_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`wishlist_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`wishlist_items` (
  `wishlist_item_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(36) NOT NULL,
  `variant_id` BIGINT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`wishlist_item_id`),
  INDEX `FK_wish_lists__product_variants` (`variant_id` ASC),
  INDEX `FK_wish_lists__users` (`user_id` ASC),
  UNIQUE INDEX `wish_lists_unique` (`user_id` ASC, `variant_id` ASC),
  CONSTRAINT `FK_wish_lists__users`
    FOREIGN KEY (`user_id`)
    REFERENCES `ec-schema`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_wish_lists_product_variants`
    FOREIGN KEY (`variant_id`)
    REFERENCES `ec-schema`.`product_variants` (`variant_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`order_addresses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`order_addresses` (
  `order_address_id` BIGINT NOT NULL AUTO_INCREMENT,
  `address_1` VARCHAR(100) NOT NULL,
  `address_2` VARCHAR(100) NULL,
  `city` VARCHAR(100) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`order_address_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`orders` (
  `order_id` VARCHAR(36) NOT NULL,
  `order_number` VARCHAR(36) NOT NULL,
  `product_cost` DECIMAL(13,2) NOT NULL,
  `tax_cost` DECIMAL(13,2) NOT NULL,
  `shipping_cost` DECIMAL(13,2) NOT NULL,
  `note` VARCHAR(1000) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TINYINT(1) NULL,
  `shipping_address_id` BIGINT NOT NULL,
  `billing_address_id` BIGINT NOT NULL,
  `user_id` VARCHAR(36) NULL,
  `order_first_name` VARCHAR(100) NOT NULL,
  `order_last_name` VARCHAR(100) NOT NULL,
  `order_email` VARCHAR(100) NOT NULL,
  `order_phone` VARCHAR(45) NOT NULL,
  `stripe_payment_intent_id` VARCHAR(100) NOT NULL,
  `shipment_id` VARCHAR(100) NULL,
  `tracking_pin` VARCHAR(100) NULL,
  `refund_link` VARCHAR(100) NULL,
  `auth_return_tracking_pin` VARCHAR(100) NULL,
  `auth_return_expiry_date` TIMESTAMP NULL,
  `auth_return_url` VARCHAR(100) NULL,
  `shipment_original_response` BLOB NULL,
  `auth_return_original_response` BLOB NULL,
  PRIMARY KEY (`order_id`),
  INDEX `fk_orders_order_addresses1_idx` (`shipping_address_id` ASC),
  INDEX `fk_orders_order_addresses2_idx` (`billing_address_id` ASC),
  INDEX `fk_orders_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_orders_order_addresses1`
    FOREIGN KEY (`shipping_address_id`)
    REFERENCES `ec-schema`.`order_addresses` (`order_address_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_orders_order_addresses2`
    FOREIGN KEY (`billing_address_id`)
    REFERENCES `ec-schema`.`order_addresses` (`order_address_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_orders_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ec-schema`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`reviews` (
  `review_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `review_point` DECIMAL(13,2) NOT NULL,
  `review_title` VARCHAR(100) NOT NULL,
  `review_description` VARCHAR(1000) NOT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  `note` VARCHAR(1000) NULL,
  PRIMARY KEY (`review_id`),
  INDEX `FK_reviews_users_idx` (`user_id` ASC),
  INDEX `FK_reviews_products_idx` (`product_id` ASC),
  CONSTRAINT `FK_reviews_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `ec-schema`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_reviews_products`
    FOREIGN KEY (`product_id`)
    REFERENCES `ec-schema`.`products` (`product_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`product_images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`product_images` (
  `product_image_id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_image_path` VARCHAR(100) NOT NULL DEFAULT '',
  `product_id` VARCHAR(36) NOT NULL,
  `is_change` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'used to detect if the image is updated/deleted at client side.',
  `product_image_name` VARCHAR(100) NOT NULL DEFAULT '' COMMENT 'this name must match with the file name of its corresponding file.',
  PRIMARY KEY (`product_image_id`),
  INDEX `fk_product_images_products1_idx` (`product_id` ASC),
  CONSTRAINT `FK_product_images__products`
    FOREIGN KEY (`product_id`)
    REFERENCES `ec-schema`.`products` (`product_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`order_events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`order_events` (
  `order_event_id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` TIMESTAMP(3) NOT NULL COMMENT 'don\'t forget \'(3)\' otherwise, a query to retrieve the lastest order event status might return multiple records since TIMESTAMP does not include milliseconds.',
  `order_id` VARCHAR(36) NOT NULL,
  `order_status` VARCHAR(36) NOT NULL,
  `undoable` TINYINT(1) NOT NULL DEFAULT 0,
  `is_undo` TINYINT(1) NOT NULL DEFAULT 0,
  `user_id` VARCHAR(36) NULL COMMENT 'optional because of guest user',
  `note` VARCHAR(500) NULL,
  PRIMARY KEY (`order_event_id`),
  INDEX `fk_events_orders1_idx` (`order_id` ASC),
  INDEX `fk_order_events_users1_idx` (`user_id` ASC),
  CONSTRAINT `FK_events__orders`
    FOREIGN KEY (`order_id`)
    REFERENCES `ec-schema`.`orders` (`order_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_order_events__users`
    FOREIGN KEY (`user_id`)
    REFERENCES `ec-schema`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ec-schema`.`order_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`order_details` (
  `order_detail_id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_quantity` INT(11) NOT NULL,
  `product_unit_price` DECIMAL(13,2) NOT NULL,
  `product_color` VARCHAR(100) NOT NULL,
  `product_size` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(500) NOT NULL,
  `order_id` VARCHAR(36) NOT NULL,
  `product_variant_id` BIGINT NOT NULL,
  PRIMARY KEY (`order_detail_id`),
  INDEX `fk_order_details_orders1_idx` (`order_id` ASC),
  INDEX `fk_order_details_product_variants1_idx` (`product_variant_id` ASC),
  CONSTRAINT `fk_order_details_orders1`
    FOREIGN KEY (`order_id`)
    REFERENCES `ec-schema`.`orders` (`order_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_order_details_product_variants1`
    FOREIGN KEY (`product_variant_id`)
    REFERENCES `ec-schema`.`product_variants` (`variant_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'to keep track of the price, color, size, and other detail of products since those properties change over the time (e.g., temporary discount price).\n\ndon\'t rely on the information from other tables (e.g., products, product_sizes, and so on) since it might change in the future and the value might be different from the one when purchased.';


-- -----------------------------------------------------
-- Table `ec-schema`.`companies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ec-schema`.`companies` (
  `company_id` BIGINT NOT NULL,
  `company_name` VARCHAR(100) NOT NULL DEFAULT '',
  `company_description` VARCHAR(500) NOT NULL DEFAULT '',
  `company_email` VARCHAR(100) NOT NULL DEFAULT '',
  `user_id` VARCHAR(36) NOT NULL,
  `phone_number` VARCHAR(45) NOT NULL DEFAULT '0000000000',
  `country_code` VARCHAR(10) NOT NULL DEFAULT '+1',
  `address_1` VARCHAR(100) NOT NULL DEFAULT '',
  `address_2` VARCHAR(100) NOT NULL DEFAULT '',
  `city` VARCHAR(100) NOT NULL DEFAULT '',
  `province` VARCHAR(100) NOT NULL DEFAULT '',
  `country` CHAR(2) NOT NULL DEFAULT '',
  `postal_code` VARCHAR(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`company_id`),
  INDEX `fk_companies_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_companies_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ec-schema`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'used only for admin user';


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `ec-schema`.`user_types`
-- -----------------------------------------------------
START TRANSACTION;
USE `ec-schema`;
INSERT INTO `ec-schema`.`user_types` (`user_type_id`, `user_type`, `created_at`, `updated_at`) VALUES (1, 'ADMIN', DEFAULT, NULL);
INSERT INTO `ec-schema`.`user_types` (`user_type_id`, `user_type`, `created_at`, `updated_at`) VALUES (2, 'MEMBER', DEFAULT, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ec-schema`.`users`
-- -----------------------------------------------------
START TRANSACTION;
USE `ec-schema`;
INSERT INTO `ec-schema`.`users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `avatar_image_path`, `is_deleted`, `deleted_account_date`, `deleted_account_reason`, `user_type_id`, `created_at`, `updated_at`, `stripe_customer_id`, `active`, `verification_token`, `verification_token_expiry_date`, `forgot_password_token`, `forgot_password_token_expiry_date`) VALUES ('e95bf632-1518-4bf2-8ba9-cd8b7587530b', 'Admin First Name', 'Admin Last Name', 'test_admin@test.com', '$2a$10$iRnpNpN7XsJq3wjHwRza1eda6CKz.GnMfLAmnozUXepQnm3w7i1yS', NULL, DEFAULT, NULL, NULL, 1, DEFAULT, NULL, NULL, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ec-schema`.`product_sizes`
-- -----------------------------------------------------
START TRANSACTION;
USE `ec-schema`;
INSERT INTO `ec-schema`.`product_sizes` (`product_size_id`, `product_size_name`, `product_size_description`) VALUES (DEFAULT, 'XS', 'extra small');
INSERT INTO `ec-schema`.`product_sizes` (`product_size_id`, `product_size_name`, `product_size_description`) VALUES (DEFAULT, 'S', 'small');
INSERT INTO `ec-schema`.`product_sizes` (`product_size_id`, `product_size_name`, `product_size_description`) VALUES (DEFAULT, 'M', 'medium');
INSERT INTO `ec-schema`.`product_sizes` (`product_size_id`, `product_size_name`, `product_size_description`) VALUES (DEFAULT, 'L', 'large');
INSERT INTO `ec-schema`.`product_sizes` (`product_size_id`, `product_size_name`, `product_size_description`) VALUES (DEFAULT, 'XL', 'extra large');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ec-schema`.`companies`
-- -----------------------------------------------------
START TRANSACTION;
USE `ec-schema`;
INSERT INTO `ec-schema`.`companies` (`company_id`, `company_name`, `company_description`, `company_email`, `user_id`, `phone_number`, `country_code`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`) VALUES (1, 'Sample Company Name', 'Sample Company Description', 'sample@company.com', 'e95bf632-1518-4bf2-8ba9-cd8b7587530b', DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT);

COMMIT;

