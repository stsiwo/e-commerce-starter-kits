import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { OrderType } from 'domain/order/types';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

interface AdminOrderDetailPropsType {
  order: OrderType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: "center",
    },
    textFieldBox: {
      textAlign: "center",
    },
    textField: {
      margin: theme.spacing(1),
    }
  }),
);

/**
 * order detail component
 **/
const AdminOrderDetail: React.FunctionComponent<AdminOrderDetailPropsType> = ({ order }) => {

  const classes = useStyles();

  return (
    <React.Fragment>
      <Box component="div" className={classes.textFieldBox}>
        <TextField
          id="order-number"
          label="Order #"
          className={`${classes.textField}`}
          value={order.orderNumber}
          disabled
        />
        <TextField
          id="order-product-cost"
          label="Product Cost"
          className={`${classes.textField}`}
          value={order.productCost}
          disabled
        />
        <TextField
          id="order-tax-cost"
          label="Tax Cost"
          className={`${classes.textField}`}
          value={order.taxCost}
          disabled
        />
        <TextField
          id="order-total-cost"
          label="Total Cost"
          className={`${classes.textField}`}
          value={order.taxCost + order.productCost}
          disabled
        />
      </Box>
    </React.Fragment>
  )
}

export default AdminOrderDetail
