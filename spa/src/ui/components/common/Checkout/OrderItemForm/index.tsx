import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CartItem from 'components/common/CartItem';
import { CheckoutStepComponentPropsType } from 'components/pages/Checkout/checkoutSteps';
import { calcSubTotalPriceAmount } from 'domain/cart';
import { CartItemType } from 'domain/cart/types';
import { UserType } from 'domain/user/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import Box from '@material-ui/core/Box';
import { Link as RRLink } from "react-router-dom";

/**
 * currently not used
 **/

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
  const { enqueueSnackbar } = useSnackbar();

  const cartItems = useSelector(mSelector.makeCartItemSelector())

  const selectedCartItems = useSelector(mSelector.makeSelectedCartItemSelector())

  // event handler to validate phone & addresses
  const handleValidateClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    if (selectedCartItems.length == 0) {
      enqueueSnackbar("Please select product items to buy.", {
        variant: 'error',
      })
    } else {
      props.goToNextStep()
    }
  }

  // render current cart item
  const renderCartItems: () => React.ReactNode = () => {
    return cartItems
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
      {(cartItems.length === 0 &&
        <Grid
          item
          xs={12}
        >
          <Typography variant="body2" component="p" align="center" >
            {"Oops. Your cart is empty."}
          </Typography>
          <Box>
            <Button component={RRLink} to={"/search"} >
              {"Search Products"}
            </Button>
          </Box>
        </Grid>
      )}
      {(cartItems.length > 0 &&
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
            <Typography variant="h6" component="h3" align="right" gutterBottom>
              SubTotal: $<b>{calcSubTotalPriceAmount(props.user.cartItems)}</b>
            </Typography>
            <Typography variant="body2" component="p" align="right" gutterBottom >
              * tax and shipping costs are not included yet.
            </Typography>
          </Grid>
        </React.Fragment>
      )}
      <Grid
        item
        xs={12}
      >
        <Button onClick={(e) => props.goToPrevStep()}>
          {"Previous"}
        </Button>
        <Button onClick={handleValidateClick}>
          {"Confirm"}
        </Button>
      </Grid>
    </Grid>
  )
}

export default OrderItemForm
