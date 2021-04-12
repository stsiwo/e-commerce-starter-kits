import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CartItem from 'components/common/CartItem';
import { CartItemType } from 'domain/cart/types';
import { UserType } from 'domain/user/types';
import * as React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { generateCartItemList } from 'tests/data/cart';
import { calcSubTotalPriceAmount, calcSubTotalProductNumbers } from 'domain/cart';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

declare type CartItemTotalPropsType = {
}

/**
 * display subtotal, tax, shipping cost, and total cost component 
 *
 * process:
 *
 * - get cur state from redux
 *
 * - display these cost
 *
 *
 **/
const CartItemTotal: React.FunctionComponent<CartItemTotalPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // get cur cart items from redux store
  const testCartItems = React.useMemo(() => generateCartItemList(4), [])

  // event handler to validate phone & addresses
  const handleValidateClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

  }

  return (
    <Box component="div">
      <div>
        <Typography variant="subtitle1" component="h3" align="right" >
          Subtotal (<b>{calcSubTotalProductNumbers(testCartItems)}</b>  items): $<b>{calcSubTotalPriceAmount(testCartItems)}</b>
        </Typography>
        <Typography variant="subtitle1" component="h3" align="right" >
          Tax: $<b>{"30.00"}</b>
        </Typography>
        <Typography variant="subtitle1" component="h3" align="right" >
          Shipping Cost: $<b>{"10.00"}</b>
        </Typography>
        <Divider variant="middle"/>
        <Typography variant="h6" component="h3" align="right" >
          Total: $<b>{"500.00"}</b>
        </Typography>
      </div>
    </Box>
  )
}

export default CartItemTotal
