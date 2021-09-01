-- update order.transaction_result = 1 if the latest order status is not in (('RETURNED', 'ERROR', 'CANCELED', 'DRAFT', 'PAYMENT_FAILED', 'ORDERED'))
UPDATE orders oo
SET transaction_result = 1
WHERE (
    select oe.order_status
    from (
        select * from orders
        ) o
    inner join order_events oe on oe.order_id = o.order_id
    where oe.created_at = (
        select max(ioe.created_at)
        from order_events ioe
        where ioe.order_id = o.order_id
        )
        and oo.order_id = o.order_id
    ) NOT IN ('RETURNED', 'ERROR', 'CANCELED', 'DRAFT', 'PAYMENT_FAILED', 'ORDERED', 'SESSION_TIMEOUT');
