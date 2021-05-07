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
import { calcSubTotalPriceAmount, calcSubTotalProductNumbers, calcTotalWeight } from 'domain/cart';
import Divider from '@material-ui/core/Divider';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { api } from 'configs/axiosConfig';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { cadCurrencyFormat, generateQueryString } from 'src/utils';

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
  
  // snakbar stuff when no phone & addresses are selected
  const { enqueueSnackbar } = useSnackbar();

  // selected cart Items
  const selectedCartItems = useSelector(mSelector.makeSelectedCartItemSelector())

  // shipping cost state
  const [curShippingCost, setShippingCost] = React.useState<number>(0);

  // request to get appropriate shipping cost
  React.useEffect(() => {

    api.request({
      method: 'GET',
      url: API1_URL + `/shipping/rating?weight=${calcTotalWeight(selectedCartItems)}`,
    }).then((data) => {

      setShippingCost(data.data.shippingCost);

      enqueueSnackbar("updated successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })
  }, [
  
  ])

  return (
    <Box component="div">
      <div>
        <Typography variant="subtitle1" component="h3" align="right" gutterBottom>
          Subtotal (<b>{calcSubTotalProductNumbers(selectedCartItems)}</b>  items): $<b>{cadCurrencyFormat(calcSubTotalPriceAmount(selectedCartItems))}</b>
        </Typography>
        <Typography variant="subtitle1" component="h3" align="right" gutterBottom>
          Tax: $<b>{cadCurrencyFormat(0)}</b>
        </Typography>
        <Typography variant="subtitle1" component="h3" align="right" gutterBottom>
          Shipping Cost: $<b>{cadCurrencyFormat(curShippingCost)}</b>
        </Typography>
        <Divider />
        <Typography variant="h6" component="h3" align="right" gutterBottom>
          Total: $<b>{cadCurrencyFormat(calcSubTotalPriceAmount(selectedCartItems) + 0 + curShippingCost)}</b>
        </Typography>
      </div>
    </Box>
  )
}

export default CartItemTotal
