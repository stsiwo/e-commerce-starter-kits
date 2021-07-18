-- increase the size of varchar on several tables:
ALTER TABLE categories MODIFY COLUMN category_description TEXT;
ALTER TABLE products MODIFY COLUMN product_description TEXT;
ALTER TABLE products MODIFY COLUMN note TEXT;
ALTER TABLE product_variants MODIFY COLUMN note TEXT;
ALTER TABLE reviews MODIFY COLUMN review_title VARCHAR(500);
ALTER TABLE reviews MODIFY COLUMN review_description TEXT;
ALTER TABLE reviews MODIFY COLUMN note TEXT;
ALTER TABLE companies MODIFY COLUMN company_description TEXT;
ALTER TABLE order_events MODIFY COLUMN note VARCHAR(1000);
