import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutStepComponentPropsType } from "components/pages/Checkout/checkoutSteps";
import { stripePromise } from "configs/stripeConfig";
import { UserType } from "domain/user/types";
import * as React from "react";
import { useSelector } from "react-redux";
import { mSelector } from "src/selectors/selector";
import StripePaymentForm from "./StripePaymentForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    totalCost: {
      alignSelf: "end",
    },
    root: {
      margin: "0 auto",
    },
  })
);

declare type PaymentPropsType = {
  user: UserType;
} & CheckoutStepComponentPropsType;

/**
 * checkout: payment page
 *
 * process:
 *
 *  - display all information (customer information, selected products, and cost)
 *
 *  - integrate with Stripe Elements for the payment
 *
 **/
const Payment: React.FunctionComponent<PaymentPropsType> = (props) => {
  // mui: makeStyles
  const classes = useStyles();

  const selectedCartItems = useSelector(
    mSelector.makeSelectedCartItemSelector()
  );

  return (
    <Box className={classes.root}>
      <Elements stripe={stripePromise}>
        <StripePaymentForm goToStep={props.goToStep} />
        <Typography variant="body1" component="p" align="center">
          test credit card for success: <b>4242424242424242</b>
        </Typography>
        <Typography variant="body1" component="p" align="center">
          test credit card for failure: <b>4000000000000069</b>
        </Typography>
        <Typography variant="body1" component="p" align="center">
          expiration date: <b>any future date</b>
        </Typography>
        <Typography variant="body1" component="p" align="center">
          CVC number: <b>any number</b>
        </Typography>
      </Elements>
    </Box>
  );
};

export default Payment;
