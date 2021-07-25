import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ReceiptIcon from "@material-ui/icons/Receipt";
import OrderTimeline from "components/common/OrderTimeline";
import UserCard from "components/common/UserCard";
import { OrderDetailType, OrderType } from "domain/order/types";
import * as React from "react";
import { UserTypeEnum } from "src/app";
import { Link as RRLink } from "react-router-dom";
import OrderDetail from "components/common/OrderDetail";
import PhoneCard from "components/pages/Admin/AdminOrder/AdminOrderForm/PhoneCard";
import AddressCard from "components/pages/Admin/AdminOrder/AdminOrderForm/AddressCard";
import { useSelector } from "react-redux";
import { mSelector } from "src/selectors/selector";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useHistory } from "react-router";
import OrderProductHorizontalCard from "./OrderProductHorizontalCard";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

interface OrderFormPropsType {
  order: OrderType;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    orderDetailBox: {},
    title: {
      textAlign: "center",
      fontWeight: theme.typography.fontWeightBold,
    },
  })
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
const OrderForm: React.FunctionComponent<OrderFormPropsType> = (props) => {
  // mui: makeStyles
  const classes = useStyles();

  const auth = useSelector(mSelector.makeAuthSelector());

  const history = useHistory();

  /**
   * order detail menus
   *
   * - need to display a menu for each order detail.
   * so anchorEl should be an array and each element contains the html element which is gonna be an anchor of the menu.
   **/
  const [anchorEls, setAnchorEls] = React.useState<null | HTMLElement[]>(
    new Array(props.order.orderDetails.length).fill(null)
  );

  const handleMenuOpenClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    const target = event.currentTarget;
    /**
     * if you update array as state, you need to return the new array since react cannot detect any mutation.
     */
    setAnchorEls((prev: null | HTMLElement[]) => {
      prev.fill(null);
      prev[index] = target;

      log("is open? ");
      log(Boolean(prev[index]));

      return [...prev];
    });
  };

  const handleMenuClose = () => {
    /**
     * if you update array as state, you need to return the new array since react cannot detect any mutation.
     */
    setAnchorEls((prev: null | HTMLElement[]) => [...prev.fill(null)]);
  };

  /**
   * review management stuff
   **/
  const handleReviewClick = (
    e: React.MouseEvent<HTMLElement>,
    productId: string,
    userId: string
  ) => {
    history.push(`/review?productId=${productId}&userId=${userId}`);
  };

  return (
    <Grid container justify="center">
      <Grid item xs={12} className={classes.orderDetailBox}>
        <Typography
          variant="subtitle1"
          component="h6"
          className={classes.title}
        >
          {"Basic Information"}
        </Typography>
        <OrderDetail order={props.order} />
      </Grid>
      <Grid item xs={12} md={12}>
        <Typography
          variant="subtitle1"
          component="h6"
          className={classes.title}
        >
          {"Customer"}
        </Typography>
        <UserCard
          firstName={props.order.orderFirstName}
          lastName={props.order.orderLastName}
          email={props.order.orderEmail}
          userType={
            props.order.user
              ? props.order.user.userType.userType
              : UserTypeEnum.GUEST
          }
          avatarImagePath={
            props.order.user ? props.order.user.avatarImagePath : null
          }
        />
        <Grid container justify="center">
          <Grid item xs={12} md={4}>
            <PhoneCard phone={props.order.orderPhone} />
          </Grid>
          <Grid item xs={12} md={4}>
            <AddressCard
              address={props.order.shippingAddress}
              headerIcon={<LocalShippingIcon />}
              title={"Shipping Address"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AddressCard
              address={props.order.billingAddress}
              headerIcon={<ReceiptIcon />}
              title={"Billing Address"}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography
          variant="subtitle1"
          component="h6"
          className={classes.title}
        >
          {"Products"}
        </Typography>
        {
          /**
           * order's product & variant might be null if the product is deleted.
           *
           * - must display the order detail but don't need to display the product information if null.
           **/
          props.order.orderDetails.map(
            (orderDetail: OrderDetailType, index: number) => {
              return (
                <OrderProductHorizontalCard
                  orderDetail={orderDetail}
                  key={orderDetail.orderDetailId}
                  menu={
                    orderDetail.isReviewable && (
                      <React.Fragment>
                        <IconButton
                          aria-label="order-detail-setting"
                          onClick={(e) => handleMenuOpenClick(e, index)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id={`product-horizontal-card-more-menu-${orderDetail.orderDetailId}`}
                          anchorEl={anchorEls[index]}
                          keepMounted
                          open={Boolean(anchorEls[index])}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            component={RRLink}
                            to={`/review?productId=${orderDetail.product.productId}&userId=${auth.user.userId}`}
                          >
                            Manage Review
                          </MenuItem>
                        </Menu>
                      </React.Fragment>
                    )
                  }
                />
              );
            }
          )
        }
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography
          variant="subtitle1"
          component="h6"
          className={classes.title}
        >
          {"Status"}
        </Typography>
        <OrderTimeline order={props.order} />
      </Grid>
    </Grid>
  );
};

export default OrderForm;
