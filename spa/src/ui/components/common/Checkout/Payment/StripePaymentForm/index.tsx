import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { CheckoutStepEnum } from 'components/pages/Checkout';
import { calcOrderTotalCost } from 'domain/order';
import { toFullNameString } from 'domain/user';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { messageActions } from 'reducers/slices/app';
import { postOrderFetchStatusActions } from 'reducers/slices/app/fetchStatus/order';
import { cartItemActions } from 'reducers/slices/domain/cartItem';
import { checkoutOrderActions } from 'reducers/slices/domain/checkout';
import { stripeClientSecretActions } from 'reducers/slices/sensitive';
import { MessageTypeEnum } from 'src/app';
import { mSelector, rsSelector } from 'src/selectors/selector';
import { cadCurrencyFormat, getNanoId } from 'src/utils';
import { resetCheckoutStateActionCreator } from 'reducers/slices/common';

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
     *
     **/
    /**
     * currently, this action (resetCheckoutStatus) is caught by following case reducers:
     *
        - stripeClientSecretActions
        - checkoutOrderActions
        - postOrderFetchStatusActions
     *
     *
     **/
    dispatch(
      resetCheckoutStateActionCreator()
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
          persist: true,
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
        {/**
          * The card element automatically determines your customer’s billing address country based on their card number. 
          * Using this information, the postal code field validation reflects whether that country uses numeric or alphanumeric-formatted postal codes, or if the country uses postal codes at all. 
          * For instance, if a U.S. card is entered, the postal code field only accepts a five-digit numeric value. 
          * If it’s a UK card, an alphanumeric value can be provided instead. 
          **/}
        <CardElement 
          options={{
            // we already got billing address so don't need this one.
            hidePostalCode: true,   
          }} 
        />
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

