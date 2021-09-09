import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import CartItem from "components/common/CartItem";
import { CheckoutStepComponentPropsType } from "components/pages/Checkout/checkoutSteps";
import { calcSubTotalPriceAmount } from "domain/cart";
import { CartItemType } from "domain/cart/types";
import { UserType } from "domain/user/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RRLink } from "react-router-dom";
import { messageActions } from "reducers/slices/app";
import { MessageTypeEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { cadCurrencyFormat, getNanoId } from "src/utils";

/**
 * currently not used
 **/

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionBox: {
      textAlign: "right",
    },
  })
);

declare type OrderItemFormPropsType = {
  user: UserType;
} & CheckoutStepComponentPropsType;

/**
 * checkout: order items component
 *
 * process:
 *
 *  - display selected items and subtotal, tax, shipping fee, and total costo
 *
 *  - color, size, and quantity can be updated at this point
 *
 *    - color and size: implement at next version
 *
 **/
const OrderItemForm: React.FunctionComponent<OrderItemFormPropsType> = (
  props
) => {
  // mui: makeStyles
  const classes = useStyles();

  const dispatch = useDispatch();

  const cartItems = useSelector(mSelector.makeCartItemSelector());

  const selectedCartItems = useSelector(
    mSelector.makeSelectedCartItemSelector()
  );

  // event handler to validate phone & addresses
  const handleValidateClick: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    if (selectedCartItems.length == 0) {
      dispatch(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: "please select at least one product to buy.",
        })
      );
    } else {
      props.goToNextStep();
    }
  };

  // render current cart item
  const renderCartItems: () => React.ReactNode = () => {
    return cartItems.map((cartItem: CartItemType) => {
      return <CartItem value={cartItem} key={cartItem.cartItemId} />;
    });
  };

  return (
    <Grid container justify="center">
      {cartItems.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body2" component="p" align="center">
            {"Oops. Your cart is empty."}
          </Typography>
          <Box>
            <Button component={RRLink} to={"/search"} variant="contained">
              {"Search Products"}
            </Button>
          </Box>
        </Grid>
      )}
      {cartItems.length > 0 && (
        <React.Fragment>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              component="p"
              align="left"
              gutterBottom
            >
              you purchase only selected items e.g.,
              <Switch
                edge="end"
                readOnly
                checked={true}
                inputProps={{
                  "aria-labelledby": "switch-list-label-selected-cart-item",
                }}
                size="small"
              />
            </Typography>
            {renderCartItems()}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h3" align="right" gutterBottom>
              SubTotal:{" "}
              <b>
                {cadCurrencyFormat(calcSubTotalPriceAmount(selectedCartItems))}
              </b>
            </Typography>
            <Typography
              variant="caption"
              component="p"
              align="right"
              color="textSecondary"
              gutterBottom
            >
              * total cost included tax and shipping costs are available at next
              step.
            </Typography>
          </Grid>
        </React.Fragment>
      )}
      <Grid item xs={12}>
        <Box component="div" className={classes.actionBox}>
          <Button onClick={(e) => props.goToPrevStep()} variant="contained">
            {"Previous"}
          </Button>
          <Button onClick={handleValidateClick} variant="contained">
            {"Confirm"}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default OrderItemForm;
