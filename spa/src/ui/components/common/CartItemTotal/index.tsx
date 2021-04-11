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
      </div>
    </Box>
  )
}

export default CartItemTotal
