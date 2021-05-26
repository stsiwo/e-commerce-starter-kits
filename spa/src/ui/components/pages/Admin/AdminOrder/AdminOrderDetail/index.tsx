import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { OrderType } from 'domain/order/types';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';

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
          inputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="order-product-cost"
          label="Product Cost"
          className={`${classes.textField}`}
          value={order.productCost}
          inputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          id="order-tax-cost"
          label="Tax Cost"
          className={`${classes.textField}`}
          value={order.taxCost}
          inputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          id="order-total-cost"
          label="Total Cost"
          className={`${classes.textField}`}
          value={order.taxCost + order.productCost}
          inputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </Box>
    </React.Fragment>
  )
}

export default AdminOrderDetail
