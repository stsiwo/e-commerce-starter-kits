import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CartItemTotal from "components/common/CartItemTotal";
import { CheckoutStepEnum } from "components/pages/Checkout";
import { CheckoutStepComponentPropsType } from "components/pages/Checkout/checkoutSteps";
import { CartItemType } from "domain/cart/types";
import { UserType } from "domain/user/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageActions } from "reducers/slices/app";
import { postOrderActionCreator } from "reducers/slices/domain/order";
import { FetchStatusEnum, MessageTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import CartItemConfirmCard from "./CartItemConfirmCard";
import CustomerBasicConfirm from "./CustomerBasicConfirm";
import CustomerContactConfirm from "./CustomerContactConfirm";
import { checkoutSessionStatusActions } from "reducers/slices/domain/checkout";
import { CheckoutSessionStatusEnum } from "domain/order/types";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    totalCost: {
      alignSelf: "end",
    },
  })
);

declare type FinalConfirmFormPropsType = {
  user: UserType;
} & CheckoutStepComponentPropsType;

/**
 * checkout: finalconfirmform page
 *
 * process:
 *
 *  - display all information (customer information, selected products, and cost)
 *
 *  - integrate with Stripe Elements for the finalconfirmform
 *
 **/
const FinalConfirmForm: React.FunctionComponent<FinalConfirmFormPropsType> = (
  props
) => {
  // mui: makeStyles
  const classes = useStyles();

  // dispatch
  const dispatch = useDispatch();

  // cur OrderCriteria
  const curOrderCriteria = useSelector(mSelector.makeOrderCriteriaSelector());

  // selected cart item
  const selectedCartItems = useSelector(
    mSelector.makeSelectedCartItemSelector()
  );

  // validation: basic info
  const isValidCustomerBasicInfo = useSelector(
    mSelector.makeAuthValidateCustomerBasicInfoSelector()
  );
  const isValidCustomerShippingAddress = useSelector(
    mSelector.makeAuthValidateCustomerShippingAddressSelector()
  );
  const isValidCustomerBillingAddress = useSelector(
    mSelector.makeAuthValidateCustomerBillingAddressSelector()
  );
  const isRatingSuccess = useSelector(
    rsSelector.domain.getCheckoutIsRatingSuccess
  );

  // event handler to validate phone & addresses
  const handleValidateClick: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    let result = true;
    let message = "";

    // validate basic info
    if (!isValidCustomerBasicInfo) {
      message = "You are missing some of customer basic information.";
      result = false;
    }

    // validate phone/shipping/billing address
    if (!isValidCustomerBillingAddress || !isValidCustomerShippingAddress) {
      message = "You are missing some of customer contact information.";
      result = false;
    }

    // validate cart items
    if (selectedCartItems.length === 0) {
      message = "Please select product items to buy.";
      result = false;
    }

    // validate isRatingSuccess (e.g., estimated shipping cost & delivery date)
    if (!isRatingSuccess) {
      message =
        "Failed to get the estimated shipping cost and delivery date. please try again later.";
      result = false;
    }

    if (!result) {
      messageActions.update({
        id: getNanoId(),
        type: MessageTypeEnum.ERROR,
        message: message,
      });
      return false;
    }

    // request client secret (Stripe)
    dispatch(postOrderActionCreator(curOrderCriteria));
  };

  /**
   * wait for the request for stripe client to be done and based on the result, guide the customer to the payment page.
   **/
  const curRequestStripeClientFetchStatus = useSelector(
    rsSelector.app.getPostOrderFetchStatus
  );
  const curCheckoutOrder = useSelector(rsSelector.domain.getCheckoutOrder);
  React.useEffect(() => {
    if (curRequestStripeClientFetchStatus === FetchStatusEnum.SUCCESS) {
      log(
        "order creation succeeded so update session status and move to payment section."
      );
      // update session status
      dispatch(
        checkoutSessionStatusActions.update(
          CheckoutSessionStatusEnum.IN_SESSION
        )
      );

      // move to payment section
      props.goToNextStep();
    }
  }, [curRequestStripeClientFetchStatus]);

  // render current cart item
  const renderCartItemConfirmCards: () => React.ReactNode = () => {
    return selectedCartItems.map((cartItem: CartItemType) => {
      return <CartItemConfirmCard value={cartItem} key={cartItem.cartItemId} />;
    });
  };

  return (
    <Grid container justify="center">
      <Grid item xs={12}>
        <Typography variant="h6" component="h6" align="left">
          {"Basic Information"}
        </Typography>
        <CustomerBasicConfirm goToStep={props.goToStep} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="h6" align="left">
          {"Contact Information"}
        </Typography>
        <CustomerContactConfirm goToStep={props.goToStep} />
      </Grid>
      <Grid item xs={12} md={6}>
        <React.Fragment>
          <Typography variant="h6" component="h6" align="left">
            {"Order Items"}
          </Typography>
          {selectedCartItems.length == 0 && (
            <React.Fragment>
              <Typography variant="body2" component="p" align="center">
                {"Oops. You haven't selected any item in your cart."}
              </Typography>
              <Box>
                <Button
                  onClick={(e) => props.goToStep(CheckoutStepEnum.ORDER_ITEMS)}
                  variant="contained"
                >
                  {"Go Back To Order Items Step"}
                </Button>
              </Box>
            </React.Fragment>
          )}
          {renderCartItemConfirmCards()}
        </React.Fragment>
      </Grid>
      <Grid item xs={12} md={6} className={classes.totalCost}>
        <CartItemTotal />
      </Grid>
      <Box>
        <Button onClick={handleValidateClick} variant="contained">
          {"Final Confirm"}
        </Button>
      </Box>
    </Grid>
  );
};

export default FinalConfirmForm;
