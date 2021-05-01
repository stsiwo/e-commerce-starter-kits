import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CartItem from 'components/common/CartItem';
import { calcSubTotalPriceAmount, calcSubTotalProductNumbers } from 'domain/cart';
import { CartItemType } from 'domain/cart/types';
import * as React from 'react';
import { useDispatch } from 'react-redux';
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

const CartBox: React.FunctionComponent<{}> = (props) => {


  const classes = useStyles();

  const dispatch = useDispatch()

  // implement later
  //const curCartItemList = useSelector(mSelector.makeCartItemListSelector())
  const testCartItems = React.useMemo(() => generateCartItemList(4), [])

  const renderCartItems: () => React.ReactNode = () => {
    return testCartItems.map((cartItem: CartItemType) => {
      return (
        <CartItem value={cartItem} key={cartItem.cartId} />
      )
    })
  }

  return (
    <React.Fragment>
      {(testCartItems.length === 0 &&
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
      {(testCartItems.length > 0 &&
        <React.Fragment>
          {renderCartItems()}
          <Box component="div" className={classes.subtotalBox}>
            <Typography variant="subtitle1" component="h3" align="right" >
               Subtotal (<b>{calcSubTotalProductNumbers(testCartItems)}</b>  items): $<b>{calcSubTotalPriceAmount(testCartItems)}</b>
            </Typography>
          </Box>
          <Box component="div" className={classes.controllerBox}>
            <Button>
              {"Checkout"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default CartBox

