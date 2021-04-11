import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CartItem from 'components/common/CartItem';
import { CheckoutStepComponentPropsType } from 'components/pages/Checkout/checkoutSteps';
import { CartItemType } from 'domain/cart/types';
import { UserType } from 'domain/user/types';
import * as React from 'react';
import CartItemTotal from 'components/common/CartItemTotal';
import { generateCartItemList } from 'tests/data/cart';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useSnackbar } from 'notistack';
import CustomerBasicConfirm from './CustomerBasicConfirm';
import CustomerContactConfirm from './CustomerContactConfirm';
import CartItemConfirmCard from './CartItemConfirmCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  const [isOpenErrorSnackbar, setOpenErrorSnackbar] = React.useState<boolean>(false)
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
      >
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Button onClick={handleValidateClick}>
          {"Confirm"}
        </Button>
      </Grid>
    </Grid>
  )
}

export default Payment
