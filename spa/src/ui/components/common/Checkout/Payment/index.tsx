import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CartItemTotal from 'components/common/CartItemTotal';
import { CheckoutStepComponentPropsType } from 'components/pages/Checkout/checkoutSteps';
import { CartItemType } from 'domain/cart/types';
import { UserType } from 'domain/user/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { generateCartItemList } from 'tests/data/cart';
import CartItemConfirmCard from './CartItemConfirmCard';
import CustomerBasicConfirm from './CustomerBasicConfirm';
import CustomerContactConfirm from './CustomerContactConfirm';
import StripePaymentForm from './StripePaymentForm';
import { stripePromise } from 'configs/stripeConfig';
import { Elements } from '@stripe/react-stripe-js';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    totalCost: {
      alignSelf: "end",
    }
  }),
);

declare type PaymentPropsType = {
  user: UserType
} & CheckoutStepComponentPropsType

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


  // snakbar stuff when no phone & addresses are selected
  const { enqueueSnackbar } = useSnackbar();

  // get cur cart items from redux store
  const testCartItems = React.useMemo(() => generateCartItemList(5), [])

  // event handler to validate phone & addresses
  const handleValidateClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    if (testCartItems.filter((cartItem: CartItemType) => cartItem.isSelected).length === 0) {
      enqueueSnackbar("Please select product items to buy.", {
        variant: 'error',
      })
    } else {
      props.onNextStepClick(e)
    }
  }

  // render current cart item
  const renderCartItemConfirmCards: () => React.ReactNode = () => {
    return testCartItems
      .filter((cartItem: CartItemType) => cartItem.isSelected)
      .map((cartItem: CartItemType) => {
        return (
          <CartItemConfirmCard
            value={cartItem}
            key={cartItem.cartId}
          />
        )
      })
  }

  return (
    <Grid
      container
      justify="center"
    >
      <Grid
        item
        xs={12}
      >
        <CustomerBasicConfirm />
      </Grid>
      <Grid
        item
        xs={12}
      >
        <CustomerContactConfirm />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        {renderCartItemConfirmCards()}
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        className={classes.totalCost}
      >
        <CartItemTotal />
        <Elements stripe={stripePromise}>
          <StripePaymentForm />
        </Elements>
      </Grid>
    </Grid>
  )
}

export default Payment
