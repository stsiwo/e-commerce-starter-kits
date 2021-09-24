import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import Pagination from "@material-ui/lab/Pagination/Pagination";
import {
  calcOrderTotalCost,
  calcOrderTotalItemNumber,
  getCurOrderStatus,
} from "domain/order";
import { orderStatusLabelList, OrderType } from "domain/order/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RRLink } from "react-router-dom";
import { fetchAuthOrderActionCreator } from "reducers/slices/app";
import { orderPaginationPageActions } from "reducers/slices/domain/order";
import { FetchStatusEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { cadCurrencyFormat, getApiUrl, toDateString } from "src/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center",
      margin: `${theme.spacing(3)}px 0`,
    },
    card: {},
    cardContent: {},
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: "100%",
      marginTop: "30",
    },
    actions: {},
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
      margin: theme.spacing(1),
    },
    loadingBox: {
      height: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    anchor: {
      textDecoration: "none",
      color: "inherit",
    },
  })
);

/**
 * guest & member orderlist page
 *
 **/
const OrderList: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const auth = useSelector(mSelector.makeAuthSelector());

  const curOrders = useSelector(mSelector.makeOrderSelector());

  const curQueryString = useSelector(mSelector.makeOrderQueryStringSelector());
  // fetch orders of this user.
  React.useEffect(() => {
    dispatch(fetchAuthOrderActionCreator({ userId: auth.user.userId }));
  }, [JSON.stringify(curQueryString)]);

  const pagination = useSelector(mSelector.makeOrderPaginationSelector());

  // pagination
  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    // need to decrement since we incremented when display
    const nextPage = value - 1;

    dispatch(orderPaginationPageActions.update(nextPage));
  };

  // render functions
  const renderOrders: () => React.ReactNode = () => {
    return curOrders.map((order: OrderType) => {
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
            <RRLink to={`/orders/${order.orderId}`} className={classes.anchor}>
              <CardHeader
                avatar={<ShoppingBasketIcon />}
                title={order.orderNumber}
                subheader={toDateString(order.createdAt)}
                //subheader={order.createdAt}
              />
              <CardMedia
                className={classes.media}
                // the first product image is the main one
                image={
                  order.orderDetails[0].product &&
                  order.orderDetails[0].product.productImages.length > 0
                    ? getApiUrl(
                        order.orderDetails[0].product.productImages[0]
                          .productImagePath
                      )
                    : ""
                }
              />
              <CardContent className={classes.cardContent}>
                <Typography variant="body2" color="textSecondary" component="p">
                  Total Cost:{" "}
                  <b>{cadCurrencyFormat(calcOrderTotalCost(order))}</b>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Total Items: <b>{calcOrderTotalItemNumber(order)}</b> items
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Status:{" "}
                  <b>{orderStatusLabelList[getCurOrderStatus(order)]}</b>
                </Typography>
              </CardContent>
            </RRLink>
            <CardActions className={classes.actions}>
              <Button
                component={RRLink}
                to={`/orders/${order.orderId}`}
                variant="contained"
              >
                Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });
  };

  // spinner stuff.
  const curFetchAuthOrderFetchStatus = useSelector(
    rsSelector.app.getFetchAuthOrderFetchStatus
  );

  return (
    <React.Fragment>
      {curFetchAuthOrderFetchStatus === FetchStatusEnum.FETCHING && (
        <Box className={classes.loadingBox}>
          <CircularProgress />
        </Box>
      )}
      {curFetchAuthOrderFetchStatus === FetchStatusEnum.FAILED && (
        <Box className={classes.loadingBox}>
          <Typography variant="body1" component="h2">
            {"failed to fetch data... please try again..."}
          </Typography>
        </Box>
      )}
      {curFetchAuthOrderFetchStatus === FetchStatusEnum.SUCCESS &&
        curOrders.length === 0 && (
          <Box className={classes.loadingBox}>
            <Typography variant="body1" component="p" align="center">
              {"Oops, Your order history is empty."}
            </Typography>
            <Box component="div" className={classes.controllerBox}>
              <Button variant="contained" component={RRLink} to={"/search"}>
                {"search"}
              </Button>
            </Box>
          </Box>
        )}
      {curOrders.length > 0 && (
        <React.Fragment>
          <Grid
            container
            className={classes.gridBox}
            spacing={0}
            justify="center"
          >
            {renderOrders()}
          </Grid>
          <Grid container justify="center" className={classes.controllerBox}>
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
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default OrderList;
