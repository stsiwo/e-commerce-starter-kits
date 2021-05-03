import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CartItem from 'components/common/CartItem';
import { calcSubTotalPriceAmount, calcSubTotalProductNumbers } from 'domain/cart';
import { CartItemType } from 'domain/cart/types';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RRLink } from "react-router-dom";
import { fetchCartItemActionCreator } from 'reducers/slices/domain/cartItem';
import { UserTypeEnum } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import { generateCartItemList } from 'tests/data/cart';

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

/**
 * member & guest
 *
 **/
const CartBox: React.FunctionComponent<{}> = (props) => {


  const classes = useStyles();

  const auth = useSelector(mSelector.makeAuthSelector());

  const dispatch = useDispatch()

  const curCartItems = useSelector(mSelector.makeCartItemSelector())

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
          key={cartItem.cartId} 
        />
      )
    })
  }

  return (
    <React.Fragment>
      {(curCartItems.length === 0 &&
        <React.Fragment>
        <Typography variant="body1" component="p" align="center">
          {"Oops, you don't have any item in your cart."}
        </Typography>
        <Box component="div">
          <Button>  
            {"log in"}
          </Button>
          <Button>  
            {"search"}
          </Button>
        </Box>
        </React.Fragment>
      )}
      {(curCartItems.length > 0 &&
        <React.Fragment>
          {renderCartItems()}
          <Box component="div" className={classes.subtotalBox}>
            <Typography variant="subtitle1" component="h3" align="right" >
               Subtotal (<b>{calcSubTotalProductNumbers(curCartItems)}</b>  items): $<b>{calcSubTotalPriceAmount(curCartItems)}</b>
            </Typography>
          </Box>
          <Box component="div" className={classes.controllerBox}>
            <Button component={RRLink} to="/checkout">
              {"Checkout"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default CartBox

