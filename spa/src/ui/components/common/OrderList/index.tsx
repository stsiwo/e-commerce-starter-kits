import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { OrderType } from 'domain/order/types';
import ListItem from '@material-ui/core/ListItem';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { toDateString, cadCurrencyFormat } from 'src/utils';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { calcOrderTotalCost, calcOrderTotalItemNumber, getCurOrderStatus } from 'domain/order';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { generateOrderList } from 'tests/data/order';
import Grid from '@material-ui/core/Grid';
import { orderPaginationPageActions, fetchOrderActionCreator } from 'reducers/slices/domain/order';
import Pagination from '@material-ui/lab/Pagination/Pagination';
import AdminOrderFormDrawer from 'components/pages/Admin/AdminOrder/AdminOrderFormDrawer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center"
    },
    card: {
    },
    cardContent: {
    },
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: '100%',
      marginTop: '30'
    },
    actions: {
    },
    gridBox: {
      // need to set this. otherwise, <Grid spacing={x}> causes overflow horizontally.
      // ref: https://material-ui.com/components/grid/#limitations
      //
      // still overflow!
      //  - quit using <Grid spacing={x}>. 
      //  - use 'margin' on <Grid item> // it works
      overflow: "hidden",
      padding: theme.spacing(0, 1, 0, 1),
      margin: theme.spacing(3, 0, 3, 0),
      minHeight: "100vh",
    },
    gridItem: {
      maxWidth: 200,
      margin: theme.spacing(1)
    }
  }),
);

/**
 * guest & member orderlist page
 *
 **/
const OrderList: React.FunctionComponent<{}> = (props) => {


  const classes = useStyles();

  const dispatch = useDispatch()

  /**
   * TODO: replace when ready
   **/
  const curOrders = useSelector(mSelector.makeOrderSelector())
  const testOrders = generateOrderList(10);

  const [curOrder, setOrder] = React.useState<OrderType>(null)

  const pagination = useSelector(mSelector.makeOrderPaginationSelector())
  
  // detail drawer
  const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

  // detail click handler
  const handleOrderDetailsClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const targetOrderId = e.currentTarget.getAttribute("data-order-id")

    /**
     * TODO: replace when ready
     **/
    //const targetOrder = curOrders.find((order: OrderType) => order.orderId === targetOrderId)
    const targetOrder = testOrders.find((order: OrderType) => order.orderId === targetOrderId)

    setOrder(targetOrder)

    setFormOpen(true);
  }

  // pagination
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {

    // need to decrement since we incremented when display
    const nextPage = value - 1;

    dispatch(orderPaginationPageActions.update(nextPage))
  };

  // api request every time query/page changes
  React.useEffect(() => {
    dispatch(fetchOrderActionCreator())
  }, [
      //JSON.stringify(curQuery), // later
      pagination.page,
    ])

  // render functions
  const renderOrders: () => React.ReactNode = () => {
    return testOrders.map((order: OrderType) => {
      return (
        <Grid
          key={order.orderId}
          item
          xs={12}
          sm={6}
          md={4}
          className={classes.gridItem}
        >
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <ShoppingBasketIcon />
              }
              title={order.orderId}
              subheader={toDateString(order.createdAt)}
            />
            <CardMedia
              className={classes.media}
              // the first product image is the main one
              image={(order.orderDetails[0].product && order.orderDetails[0].product.productImages.length > 0) ? order.orderDetails[0].product.productImages[0].productImagePath : ""}
            />
            <CardContent className={classes.cardContent}>
              <Typography variant="body2" color="textSecondary" component="p">
                Total Cost: <b>{cadCurrencyFormat(calcOrderTotalCost(order))}</b>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Total Items: <b>{calcOrderTotalItemNumber(order)}</b> items
              </Typography>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button disabled>
                {getCurOrderStatus(order)}
              </Button>
              <Button data-order-id={order.orderId} onClick={handleOrderDetailsClick}>
                Details
            </Button>
            </CardActions>
          </Card>
        </Grid>
      )
    })
  }

  return (
    <React.Fragment>
      <Grid
        container
        className={classes.gridBox}
        spacing={0}
        justify="center"
      >
        {renderOrders()}
        <Pagination
          page={pagination.page + 1} // don't forget to increment when display
          count={pagination.totalPages}
          color="primary"
          showFirstButton
          showLastButton
          size={"medium"}
          onChange={handlePaginationChange}
        />
      </Grid>
      <AdminOrderFormDrawer
        curFormOpen={curFormOpen}
        setFormOpen={setFormOpen}
        order={curOrder}
      />
    </React.Fragment>
  )
}

export default OrderList




