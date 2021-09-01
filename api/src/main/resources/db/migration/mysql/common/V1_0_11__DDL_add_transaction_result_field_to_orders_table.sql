-- drop this index. this is mistake.
ALTER TABLE orders
ADD COLUMN transaction_result BOOLEAN NOT NULL DEFAULT 0;
