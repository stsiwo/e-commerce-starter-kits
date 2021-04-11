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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

declare type OrderItemFormPropsType = {
  user: UserType
} & CheckoutStepComponentPropsType

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
const OrderItemForm: React.FunctionComponent<OrderItemFormPropsType> = (props) => {

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
  const renderCartItems: () => React.ReactNode = () => {
    return testCartItems
      .filter((cartItem: CartItemType) => cartItem.isSelected)
      .map((cartItem: CartItemType) => {
        return (
          <CartItem
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
      {(testCartItems.filter((cartItem: CartItemType) => cartItem.isSelected).length === 0 &&
        <Grid
          item
          xs={12}
        >
          <Typography variant="body2" component="p" align="center" >
            {"Oops. You don't have any item to buy."}
          </Typography>
        </Grid>
      )}
      {(testCartItems.filter((cartItem: CartItemType) => cartItem.isSelected).length > 0 &&
        <React.Fragment>
          <Grid
            item
            xs={12}
            md={6}
          >
            {renderCartItems()}
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <CartItemTotal />
          </Grid>
        </React.Fragment>
      )}
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

export default OrderItemForm
