import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CartItem from 'components/common/CartItem';
import { calcSubTotalPriceAmount, calcSubTotalProductNumbers, validateCartItemsForCheckout } from 'domain/cart';
import { CartItemType } from 'domain/cart/types';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { messageActions } from 'reducers/slices/app';
import { fetchCartItemActionCreator } from 'reducers/slices/domain/cartItem';
import { MessageTypeEnum, UserTypeEnum } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import { cadCurrencyFormat, getNanoId } from 'src/utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center"
    }
  }),
);

declare type CartBoxPropsType = {
  toggleDrawer?: (nextOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void
}

/**
 * member & guest
 *
 **/
const CartBox: React.FunctionComponent<CartBoxPropsType> = (props) => {

  const classes = useStyles();

  const auth = useSelector(mSelector.makeAuthSelector());

  const dispatch = useDispatch()

  const curCartItems = useSelector(mSelector.makeCartItemSelector())

  const history = useHistory();
  
  // fetch cart item from api (member only)
  React.useEffect(() => {
    if (auth.userType === UserTypeEnum.MEMBER) {
      dispatch(fetchCartItemActionCreator());
    }
  }, [
  ])

  const renderCartItems: () => React.ReactNode = () => {
    return curCartItems.map((cartItem: CartItemType) => {
      return (
        <CartItem 
          value={cartItem} 
          key={cartItem.cartItemId} 
        />
      )
    })
  }

  const handleCheckoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (validateCartItemsForCheckout(curCartItems)) {
      history.push("/checkout");

      if (props.toggleDrawer) {
        props.toggleDrawer(false)(e);
      }
    } else {
      dispatch(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: "please select at least one product to buy.",
        }) 
      );
    }
  }

  return (
    <React.Fragment>
      {(curCartItems.length === 0 &&
        <React.Fragment>
        <Typography variant="body1" component="p" align="center">
          {"Oops, Your cart is empty."}
        </Typography>
        <Box component="div" className={classes.controllerBox}>
          <Button variant="contained">  
            {"go search"}
          </Button>
        </Box>
        </React.Fragment>
      )}
      {(curCartItems.length > 0 &&
        <React.Fragment>
          {renderCartItems()}
          <Box component="div" className={classes.subtotalBox}>
            <Typography variant="subtitle1" component="h3" align="right" >
               Subtotal (<b>{calcSubTotalProductNumbers(curCartItems)}</b>  items): $<b>{cadCurrencyFormat(calcSubTotalPriceAmount(curCartItems))}</b>
            </Typography>
          </Box>
          <Box component="div" className={classes.controllerBox}>
            <Button onClick={handleCheckoutClick} variant="contained">
              {"Checkout"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default CartBox

