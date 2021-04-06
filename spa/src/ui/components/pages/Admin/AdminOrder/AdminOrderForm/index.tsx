import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import OrderTimeline from 'components/common/OrderTimeline';
import ProductHorizontalCard from 'components/common/ProductCard/ProductHorizontalCard';
import TimelineUpdateForm from 'components/common/TimelineUpdateForm';
import UserCard from 'components/common/UserCard';
import { OrderDetailType, OrderType } from 'domain/order/types';
import * as React from 'react';
import { generateOrderList } from 'tests/data/order';
import AdminOrderDetail from '../AdminOrderDetail';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    orderDetailBox: {

    },
    title: {
      textAlign: "center",
      fontWeight: theme.typography.fontWeightBold
    },
  }),
);

/**
 * member or admin account management component
 *
 * process:
 *
 *    - 1. request to grab information about this user
 *
 *    - 2. display the info to this component
 *
 *    - 3. the user modify the input
 *
 *    - 4. every time the user modify the input, validate each of them
 *
 *    - 5. the user click the save button
 *
 *    - 6. display result popup message
 **/
const AdminOrderForm: React.FunctionComponent<{}> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  /**
   * test order date
   **/
  const testOrder: OrderType = generateOrderList(1)[0]

  return (
    <Grid
      container
      justify="center"
    >
      <Grid
        item
        xs={12}
        justify="center"
        className={classes.orderDetailBox}
      >
        <Typography variant="subtitle1" component="h6" className={classes.title}>
          {"Basic Information"}
        </Typography>
        <AdminOrderDetail order={testOrder} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <Typography variant="subtitle1" component="h6" className={classes.title}>
          {"Customer"}
        </Typography>
        <UserCard user={testOrder.user} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <Typography variant="subtitle1" component="h6" className={classes.title}>
          {"Products"}
        </Typography>
        {
          testOrder.orderDetails.map((orderDetail: OrderDetailType, index: number) => (
            <ProductHorizontalCard orderDetail={orderDetail} key={index}/>
          ))
        }
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Typography variant="subtitle1" component="h6" className={classes.title}>
          {"Status"}
        </Typography>
        <OrderTimeline orderEvents={testOrder.orderEvents} /> 
      </Grid>
      <Grid
        item
        xs={12}
      >
        <TimelineUpdateForm orderEvents={testOrder.orderEvents} /> 
      </Grid>
    </Grid>
  )
}

export default AdminOrderForm

