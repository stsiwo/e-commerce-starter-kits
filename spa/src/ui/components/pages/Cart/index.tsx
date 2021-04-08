import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { generateCartItemList } from 'tests/data/cart';
import { CartItemType } from 'domain/cart/types';
import { useDispatch, useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CartItem from 'components/common/CartItem';
import ProductTotal from 'components/common/CartItemTotal';

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
 * member & guest cart management page
 *
 * steps: 
 *
 *  1. retrieve cart item list from redux state
 *
 *  2. display on this dumb component
 *
 *  3. when the user updates (e.g., select, remove), dispatch following actions:
 *
 *    3.1: select: 
 *      (MEMBER): send api request (/users/{userId}/cart PATCH: partial update) 
 *      (GUEST): just only update redux state
 *
 *    3.2: remove: need to remove the selected item
 *      (MEMBER): send api request (/users/{userId}/cart/{cartId} DELETE: delete) 
 *      (GUEST): just only update redux state
 *
 *    3.3: increment/decrement quantity
 *      (MEMBER): send api request (/users/{userId}/cart PATCH: partial update) 
 *      (GUEST): just only update redux state
 *      
 *  4. received updated state from redux
 *
 *  5. display updated state on this dumb component again
 *      
 *
 **/
const Cart: React.FunctionComponent<{}> = (props) => {


  const classes = useStyles();

  const dispatch = useDispatch()

  // implement later
  //const curCartItemList = useSelector(mSelector.makeCartItemListSelector())
  const testCartItems = generateCartItemList(4)

  // on select change
  const handleSelectCartItemChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    /**
     * dispatch select update action (see above)
     **/
  }

  const calcSubTotalPriceAmount: () => number = () => {
    return testCartItems.reduce((acc: number, cartItem: CartItemType) => {
      const unitPrice = cartItem.variant.variantUnitPrice ? cartItem.variant.variantUnitPrice : cartItem.product.productBaseUnitPrice
      acc +=  (unitPrice * cartItem.quantity)
      return acc
    }, 0)
  }

  const calcSubTotalProductNumbers: () => number = () => {
    return testCartItems.reduce((acc: number, cartItem: CartItemType) => {
      acc +=  cartItem.quantity 
      return acc
    }, 0)
  }

  const renderCartItems: () => React.ReactNode = () => {
    return testCartItems.map((cartItem: CartItemType) => {
      return (
        <CartItem value={cartItem} onChange={handleSelectCartItemChange} key={cartItem.cartId} />
      )
    })
  }

  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Cart"}
      </Typography>
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
               Subtotal (<b>{calcSubTotalProductNumbers()}</b>  items): $<b>{calcSubTotalPriceAmount()}</b>
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

export default Cart

