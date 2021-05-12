-- orders

-- test member 1

-- order 1

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('1', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('2', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'order_w0vDYZvqy_Y', '123.00', '2.00', '10.00', '1', '2', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('1', '3', '5.00', 'white', 'XS', 'sample product name 1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('2', '1', '10.00', 'purple', 'M', 'sample product name 2', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('3', '1', '3.00', 'white', 'XS', 'sample product name 3', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('1', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('2', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('3', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');


-- order 2

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('3', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('4', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('34c6c314-de67-41d1-9a97-3bdb7aa5f076', 'order_okkfl1Ez7UN', '23.00', '5.00', '3.00', '3', '4', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('4', '3', '5.00', 'white', 'XS', 'sample product name 1', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('5', '1', '10.00', 'purple', 'M', 'sample product name 2', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('6', '1', '3.00', 'white', 'XS', 'sample product name 3', '34c6c314-de67-41d1-9a97-3bdb7aa5f076', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('4', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('5', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('6', 'c8f8591c-bb83-4fd1-a098-3fac8d40e450', 'PAYMENT_FAILED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');


-- order 3

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('5', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('6', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('7923d2aa-5f4b-4344-8773-d810f5505496', 'order_IxaCXIxluYA', '23.00', '5.00', '3.00', '5', '6', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('7', '3', '5.00', 'white', 'XS', 'sample product name 1', '7923d2aa-5f4b-4344-8773-d810f5505496', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('8', '1', '10.00', 'purple', 'M', 'sample product name 2', '7923d2aa-5f4b-4344-8773-d810f5505496', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('9', '1', '3.00', 'white', 'XS', 'sample product name 3', '7923d2aa-5f4b-4344-8773-d810f5505496', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('7', '7923d2aa-5f4b-4344-8773-d810f5505496', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('8', '7923d2aa-5f4b-4344-8773-d810f5505496', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('9', '7923d2aa-5f4b-4344-8773-d810f5505496', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('10', '7923d2aa-5f4b-4344-8773-d810f5505496', 'CANCEL_REQUEST', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');



-- order 4

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('7', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('8', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'order__b5UeIc4ZN4', '23.00', '5.00', '3.00', '7', '8', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('10', '3', '5.00', 'white', 'XS', 'sample product name 1', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('11', '1', '10.00', 'purple', 'M', 'sample product name 2', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('12', '1', '3.00', 'white', 'XS', 'sample product name 3', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('11', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('12', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('13', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('14', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'CANCEL_REQUEST', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('15', '753f5ac2-f704-4f8b-a52c-51f2338c9e0c', 'RECEIVED_CANCEL_REQUEST', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');



-- order 5

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('9', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('10', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('482a0801-495b-44e4-8379-f7bc70fa8d6a', 'order_HYG5z3QXMoK', '23.00', '5.00', '3.00', '9', '10', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('13', '3', '5.00', 'white', 'XS', 'sample product name 1', '482a0801-495b-44e4-8379-f7bc70fa8d6a', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('14', '1', '10.00', 'purple', 'M', 'sample product name 2', '482a0801-495b-44e4-8379-f7bc70fa8d6a', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('15', '1', '3.00', 'white', 'XS', 'sample product name 3', '482a0801-495b-44e4-8379-f7bc70fa8d6a', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('16', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('17', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('18', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('19', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'CANCEL_REQUEST', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('20', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'RECEIVED_CANCEL_REQUEST', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('21', '482a0801-495b-44e4-8379-f7bc70fa8d6a', 'CANCELED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');



-- order 6

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('11', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('12', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('84c6354e-3e59-41f3-8c66-726e1a608649', 'order_HYG5z3QXMoK', '23.00', '5.00', '3.00', '10', '11', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('16', '3', '5.00', 'white', 'XS', 'sample product name 1', '84c6354e-3e59-41f3-8c66-726e1a608649', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('17', '1', '10.00', 'purple', 'M', 'sample product name 2', '84c6354e-3e59-41f3-8c66-726e1a608649', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('18', '1', '3.00', 'white', 'XS', 'sample product name 3', '84c6354e-3e59-41f3-8c66-726e1a608649', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('22', '84c6354e-3e59-41f3-8c66-726e1a608649', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('23', '84c6354e-3e59-41f3-8c66-726e1a608649', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('24', '84c6354e-3e59-41f3-8c66-726e1a608649', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('25', '84c6354e-3e59-41f3-8c66-726e1a608649', 'SHIPPED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');



-- order 7

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('13', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('14', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'order_HYG5z3QXMoK', '23.00', '5.00', '3.00', '13', '14', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('19', '3', '5.00', 'white', 'XS', 'sample product name 1', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('20', '1', '10.00', 'purple', 'M', 'sample product name 2', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('21', '1', '3.00', 'white', 'XS', 'sample product name 3', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('26', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('27', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('28', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('29', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'SHIPPED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('30', 'cdfc8e21-0ac0-45c8-8a7e-644798166fd8', 'DELIVERED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');



-- order 7

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('15', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('16', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('5e5b3163-acba-4c18-90f7-310e0f104786', 'order_CLKDGbYkgvg', '23.00', '5.00', '3.00', '15', '16', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('22', '3', '5.00', 'white', 'XS', 'sample product name 1', '5e5b3163-acba-4c18-90f7-310e0f104786', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('23', '1', '10.00', 'purple', 'M', 'sample product name 2', '5e5b3163-acba-4c18-90f7-310e0f104786', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('24', '1', '3.00', 'white', 'XS', 'sample product name 3', '5e5b3163-acba-4c18-90f7-310e0f104786', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('31', '5e5b3163-acba-4c18-90f7-310e0f104786', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('32', '5e5b3163-acba-4c18-90f7-310e0f104786', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('33', '5e5b3163-acba-4c18-90f7-310e0f104786', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('34', '5e5b3163-acba-4c18-90f7-310e0f104786', 'SHIPPED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('35', '5e5b3163-acba-4c18-90f7-310e0f104786', 'DELIVERED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('36', '5e5b3163-acba-4c18-90f7-310e0f104786', 'RETURN_REQUEST', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');


-- order 8

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('17', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('18', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('6511c283-5405-4335-b227-5ee3d6d9ed74', 'order_gAQqZSby9HD', '23.00', '5.00', '3.00', '17', '18', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('25', '3', '5.00', 'white', 'XS', 'sample product name 1', '6511c283-5405-4335-b227-5ee3d6d9ed74', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('26', '1', '10.00', 'purple', 'M', 'sample product name 2', '6511c283-5405-4335-b227-5ee3d6d9ed74', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('27', '1', '3.00', 'white', 'XS', 'sample product name 3', '6511c283-5405-4335-b227-5ee3d6d9ed74', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('37', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('38', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('39', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('41', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'SHIPPED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('42', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'DELIVERED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('43', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'RETURN_REQUEST', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('44', '6511c283-5405-4335-b227-5ee3d6d9ed74', 'RECEIVED_RETURN_REQUEST', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');



-- order 9

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('19', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('20', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('8fa1e551-d192-4203-badb-a4bb85df3f11', 'order_zNmyD8K8fmg', '23.00', '5.00', '3.00', '19', '20', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('28', '3', '5.00', 'white', 'XS', 'sample product name 1', '8fa1e551-d192-4203-badb-a4bb85df3f11', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('29', '1', '10.00', 'purple', 'M', 'sample product name 2', '8fa1e551-d192-4203-badb-a4bb85df3f11', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('30', '1', '3.00', 'white', 'XS', 'sample product name 3', '8fa1e551-d192-4203-badb-a4bb85df3f11', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('45', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('46', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('47', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('48', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'SHIPPED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('49', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'DELIVERED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('50', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'RETURN_REQUEST', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('51', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'RECEIVED_RETURN_REQUEST', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('52', '8fa1e551-d192-4203-badb-a4bb85df3f11', 'RETURNED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');



-- order 10

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('21', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('22', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('a3324b0a-199b-4529-a75e-d0d6bc25fcce', 'order_zNmyD8K8fmg', '23.00', '5.00', '3.00', '21', '22', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('31', '3', '5.00', 'white', 'XS', 'sample product name 1', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('32', '1', '10.00', 'purple', 'M', 'sample product name 2', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('33', '1', '3.00', 'white', 'XS', 'sample product name 3', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('53', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('54', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('55', 'a3324b0a-199b-4529-a75e-d0d6bc25fcce', 'ERROR', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');



-- order 11

-- order address
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('23', 'shipping_address_1', 'shipping_address_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_postal_code');
INSERT INTO `order_addresses` (`order_address_id`, `address_1`, `address_2`, `city`, `province`, `country`, `postal_code`)
VALUES ('24', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_country', 'billing_postal_code');

INSERT INTO `orders` (`order_id`, `order_number`, `product_cost`, `tax_cost`, `shipping_cost`, `shipping_address_id`, `billing_address_id`, `user_id`, `order_first_name`, `order_last_name`, `order_email`, `order_phone`, `stripe_payment_intent_id`)
VALUES ('4558b985-1675-49e1-994f-0d08bc881486', 'order_g1W2H-d02TW', '23.00', '5.00', '3.00', '23', '24', 'c7081519-16e5-4f92-ac50-1834001f12b9', 'first name', 'last name', 'test_order@email.com', '+12342342345', 'sample_stripe_payment_intent_id');

-- order detail
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('34', '3', '5.00', 'white', 'XS', 'sample product name 1', '4558b985-1675-49e1-994f-0d08bc881486', '1');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('35', '1', '10.00', 'purple', 'M', 'sample product name 2', '4558b985-1675-49e1-994f-0d08bc881486', '9');
INSERT INTO `order_details` (`order_detail_id`, `product_quantity`, `product_unit_price`, `product_color`, `product_size`, `product_name`, `order_id`, `product_variant_id`)
VALUES ('36', '1', '3.00', 'white', 'XS', 'sample product name 3', '4558b985-1675-49e1-994f-0d08bc881486', '14');

-- order event
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('56', '4558b985-1675-49e1-994f-0d08bc881486', 'DRAFT', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('57', '4558b985-1675-49e1-994f-0d08bc881486', 'ORDERED', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('58', '4558b985-1675-49e1-994f-0d08bc881486', 'PAID', '0', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('59', '4558b985-1675-49e1-994f-0d08bc881486', 'SHIPPED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('60', '4558b985-1675-49e1-994f-0d08bc881486', 'DELIVERED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');
INSERT INTO `order_events` (`order_event_id`, `order_id`, `order_status`, `undoable`, `is_undo`, `user_id`)
VALUES ('61', '4558b985-1675-49e1-994f-0d08bc881486', 'COMPLETED', '1', '0', 'c7081519-16e5-4f92-ac50-1834001f12b9');


