import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { OrderType } from 'domain/order/types';
import * as React from 'react';

interface AdminOrderDetailPropsType {
  order: OrderType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

/**
 * order detail component
 *
 **/
const AdminOrderDetail: React.FunctionComponent<AdminOrderDetailPropsType> = ({ order }) => {

  const classes = useStyles();

  return (
    <React.Fragment>
      <TextField
        id="order-number"
        label="Order #"
        value={order.orderNumber}
        disabled
      />
      <TextField
        id="order-product-cost"
        label="Product Cost"
        value={order.productCost}
        disabled
      />
      <TextField
        id="order-tax-cost"
        label="Tax Cost"
        value={order.taxCost}
        disabled
      />
      <TextField
        id="order-total-cost"
        label="Total Cost"
        value={order.taxCost + order.productCost}
        disabled
      />
    </React.Fragment>
  )
}

export default AdminOrderDetail


