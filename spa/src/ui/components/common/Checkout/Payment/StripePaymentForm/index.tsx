import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { calcSubTotalPriceAmount } from 'domain/cart';
import { toFullNameString, toPhoneString } from 'domain/user';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { cadCurrencyFormat } from 'src/utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",

    },
    cartInputBox: {
      margin: `${theme.spacing(1)}px auto`,
      maxWidth: 300,
    },
    btnBox: {
      margin: `${theme.spacing(1)}px 0`,
      textAlign: "right",
    },
    btn: {
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

  // auth (customer)
  const auth = useSelector(mSelector.makeAuthSelector());

  // selected phone
  const selectedPhone = useSelector(mSelector.makeAuthSelectedPhoneSelector())

  // shipping & billing address
  const shippingAddress = useSelector(mSelector.makeAuthShippingAddressSelector())
  const billingAddress = useSelector(mSelector.makeAuthBillingAddressSelector())

  // selected cart items
  const selectedCartItems = useSelector(mSelector.makeSelectedCartItemSelector())


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
          name: toFullNameString(auth.user),
          address: {
            line1: billingAddress.address1,
            line2: billingAddress.address2,
            city: billingAddress.city,
            state: billingAddress.province,
            country: billingAddress.country,
            postal_code: billingAddress.postalCode,
          },
          email: auth.user.email,
          phone: toPhoneString(selectedPhone),
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

  return (
    <Box component="div" className={classes.root}>
      <Box className={classes.cartInputBox}>
        <CardElement />
      </Box>
      <Box className={classes.btnBox}>
        <Button
          disabled={!stripe}
          onClick={handleMakePaymentClick}
          className={classes.btn}
        >
          Make Payment (<b>$ {cadCurrencyFormat(calcSubTotalPriceAmount(selectedCartItems))} </b>)
        </Button>
      </Box>
    </Box>
  )
}

export default StripePaymentForm

