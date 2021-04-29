import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { requestStripeClientSecretActionCreator } from 'reducers/slices/app/private/stripeClientSecret';
import { mSelector } from 'src/selectors/selector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
    }
  }),
);

declare type StripePaymentFormPropsType = {
}

/**
 * checkout: Stripe Payment Form component 
 *
 *  - use Stripe Element to process the payment
 *
 **/
const StripePaymentForm: React.FunctionComponent<StripePaymentFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // dispatch
  const dispatch = useDispatch()

  // client_secret state (redux store)
  const stripeClientSecret = useSelector(mSelector.makeStipeClientSecretSelector())

  // snakbar stuff when no phone & addresses are selected
  const { enqueueSnackbar } = useSnackbar();

  // stripe stuff
  const stripe = useStripe();
  const elements = useElements();

  // event handler on 'make payment' click event
  const handleMakePaymentClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // call stripe.confirmCardPayment method with client_secret and card info
    const result = await stripe.confirmCardPayment(stripeClientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen',
        },
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
      enqueueSnackbar("payment failed: " + result.error.message)
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        enqueueSnackbar("payment success:")
      }
    }
  }

  // event handler on 'final confirm' button
  const handleFinalConfirmClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    dispatch(requestStripeClientSecretActionCreator())
  }

  return (
    <Box component="div" className={classes.root}>
      <label>
        Card Details
        <CardElement />
      </label>
      <Button
        onClick={handleFinalConfirmClick}
      >
        {"Final Confirm"}
      </Button>
      <Button
        disabled={!stripe}
        onClick={handleMakePaymentClick}
      >
        {"Make Payment"}
      </Button>
    </Box>
  )
}

export default StripePaymentForm

