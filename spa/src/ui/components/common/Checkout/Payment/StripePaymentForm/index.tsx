import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { calcSubTotalPriceAmount } from 'domain/cart';
import { toPhoneString, toFullNameString } from 'domain/user';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mSelector, rsSelector } from 'src/selectors/selector';
import { cadCurrencyFormat, getNanoId } from 'src/utils';
import { messageActions } from 'reducers/slices/app';
import { MessageTypeEnum } from 'src/app';
import { useHistory } from 'react-router';
import { stripeClientSecretActions } from 'reducers/slices/sensitive';
import { calcOrderTotalCost } from 'domain/order';
import { checkoutOrderActions } from 'reducers/slices/domain/checkout';
import { CheckoutStepEnum } from 'components/pages/Checkout';
import { postOrderFetchStatusActions } from 'reducers/slices/app/fetchStatus/order';
import { cartItemActions } from 'reducers/slices/domain/cartItem';

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
  goToStep: (step: CheckoutStepEnum) => void
  setPaymentAttempt: React.Dispatch<React.SetStateAction<boolean>>
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

  // history
  const history = useHistory()

  // cur checkout order
  const curCheckoutOrder = useSelector(rsSelector.domain.getCheckoutOrder)

  // client_secret state (redux store)
  const stripeClientSecret = useSelector(mSelector.makeStipeClientSecretSelector())

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
          name: toFullNameString(curCheckoutOrder.orderFirstName, curCheckoutOrder.orderLastName),
          address: {
            line1: curCheckoutOrder.billingAddress.address1,
            line2: curCheckoutOrder.billingAddress.address2,
            city: curCheckoutOrder.billingAddress.city,
            state: curCheckoutOrder.billingAddress.province,
            country: curCheckoutOrder.billingAddress.country,
            postal_code: curCheckoutOrder.billingAddress.postalCode,
          },
          email: curCheckoutOrder.orderEmail,
          phone: curCheckoutOrder.orderPhone,
        },
      }
    });

    // payment done 

    /**
     * make sure to delete clientSecret. it is sensitive data and should be deleted as soon as you used.
     *
     * also, cur order too.
     * also, post order fetch status too
     **/
    dispatch(
      stripeClientSecretActions.clear()
    );

    dispatch(
      checkoutOrderActions.clear()
    );

    dispatch(
      postOrderFetchStatusActions.clear()
    )

    // prepare for the next payment if failed
    props.setPaymentAttempt(true);

    /**
     * Payment Failed
     **/
    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);

      /**
       * update message
       **/
      dispatch(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: "sorry, we failed to process your payment. please start over again. (reason: " + result.error.message + ")",
        })
      )
      // reload instead of steping back to the fist section.
      // to reset all state (e.g., session timeout)
      // this does not work since error message does not show since this reloading.
      //window.location.reload();

      props.goToStep(CheckoutStepEnum.CUSTOMER_BASIC_INFORMATION);

    } else {
    /**
     * Payment Succeeded
     **/

      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.SUCCESS,
            message: "thank you for your purchase. we will send the confirmation email soon.",
          })
        )
      }

      // remove purchased product from cart.
      dispatch(
        cartItemActions.deleteSelectedItems()
      )

      history.push("/");
    }
  }

  const totalCost = curCheckoutOrder ? cadCurrencyFormat(calcOrderTotalCost(curCheckoutOrder)) : cadCurrencyFormat(0)

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
          Make Payment (<b>$ {totalCost} </b>)
        </Button>
      </Box>
    </Box>
  )
}

export default StripePaymentForm

