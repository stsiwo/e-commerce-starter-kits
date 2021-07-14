import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { calcSubTotalPriceAmount, calcSubTotalProductNumbers, calcTotalWeight } from 'domain/cart';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { cadCurrencyFormat, getNanoId, toDateString } from 'src/utils';
import { messageActions } from 'reducers/slices/app';
import { MessageTypeEnum } from 'src/app';
import { checkoutIsRatingSuccessActions } from 'reducers/slices/domain/checkout';
import { RatingCriteria } from 'domain/order/types';

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
  const dispatch = useDispatch();

  // selected cart Items
  const selectedCartItems = useSelector(mSelector.makeSelectedCartItemSelector())
  const curShippingAddress = useSelector(mSelector.makeAuthShippingAddressSelector())

  // shipping cost state
  const [curShippingCost, setShippingCost] = React.useState<number>(0);
  const [curDeliveryDate, setDeliveryDate] = React.useState<Date>(null);

  // request to get appropriate shipping cost
  React.useEffect(() => {

    console.log("total weight: " + calcTotalWeight(selectedCartItems))
    console.log("postal code: " + curShippingAddress.postalCode)

    api.request({
      method: 'POST',
      url: API1_URL + `/shipping/rating`,
      data: {
        parcelWeight: calcTotalWeight(selectedCartItems), 
        destinationPostalCode: curShippingAddress.postalCode,
      } as RatingCriteria
    }).then((data) => {
      setShippingCost(data.data.estimatedShippingCost);
      setDeliveryDate(data.data.expectedDeliveryDate);

      dispatch(
        checkoutIsRatingSuccessActions.update(true) 
      )

    }).catch((error: AxiosError) => {
      // use error.response.data.message from api
      dispatch(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: "failed to get estimated shipping cost and delivery date. please try again later.",
        })
      )
    })
  }, [

    ])

  return (
    <Box component="div">
      <div>
        <Typography variant="subtitle1" component="h3" align="right" gutterBottom>
          Estimated Delivery Date: <b>{toDateString(curDeliveryDate)}</b>
        </Typography>
        <Divider />
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
