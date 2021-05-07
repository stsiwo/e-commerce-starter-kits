import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CartItemTotal from 'components/common/CartItemTotal';
import { CheckoutStepComponentPropsType } from 'components/pages/Checkout/checkoutSteps';
import { CartItemType } from 'domain/cart/types';
import { UserType } from 'domain/user/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import CartItemConfirmCard from './CartItemConfirmCard';
import CustomerBasicConfirm from './CustomerBasicConfirm';
import CustomerContactConfirm from './CustomerContactConfirm';
import { useSelector, useDispatch } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Link as RRLink } from "react-router-dom";
import { CheckoutStepEnum } from 'components/pages/Checkout';
import { requestStripeClientSecretActionCreator } from 'reducers/slices/app/private/stripeClientSecret';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    totalCost: {
      alignSelf: "end",
    }
  }),
);

declare type FinalConfirmFormPropsType = {
  user: UserType
} & CheckoutStepComponentPropsType

/**
 * checkout: finalconfirmform page 
 *
 * process:
 *
 *  - display all information (customer information, selected products, and cost) 
 *
 *  - integrate with Stripe Elements for the finalconfirmform
 *
 **/
const FinalConfirmForm: React.FunctionComponent<FinalConfirmFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // snakbar stuff when no phone & addresses are selected
  const { enqueueSnackbar } = useSnackbar();

  // dispatch
  const dispatch = useDispatch()

  // selected cart item
  const selectedCartItems = useSelector(mSelector.makeSelectedCartItemSelector());

  // validation: basic info
  const isValidCustomerBasicInfo = useSelector(mSelector.makeAuthValidateCustomerBasicInfoSelector())
  const isValidCustomerShippingAddress = useSelector(mSelector.makeAuthValidateCustomerShippingAddressSelector())
  const isValidCustomerBillingAddress = useSelector(mSelector.makeAuthValidateCustomerBillingAddressSelector())

  // event handler to validate phone & addresses
  const handleValidateClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    // validate basic info
    if (!isValidCustomerBasicInfo) {
      enqueueSnackbar("You are missing some of customer basic information.", {
        variant: 'error',
      })
      return false
    }

    // validate phone/shipping/billing address
    if (!isValidCustomerBillingAddress || !isValidCustomerShippingAddress) {
      enqueueSnackbar("You are missing some of customer contact information.", {
        variant: 'error',
      })
      return false
    }

    // validate cart items
    if (selectedCartItems.length === 0) {
      enqueueSnackbar("Please select product items to buy.", {
        variant: 'error',
      })
      return false
    }

    // request client secret (Stripe) 
    dispatch(requestStripeClientSecretActionCreator())

    props.goToNextStep()
  }

  // render current cart item
  const renderCartItemConfirmCards: () => React.ReactNode = () => {
    return selectedCartItems
      .map((cartItem: CartItemType) => {
        return (
          <CartItemConfirmCard
            value={cartItem}
            key={cartItem.cartId}
          />
        )
      })
  }

  return (
    <Grid
      container
      justify="center"
    >
      <Grid
        item
        xs={12}
      >
          <Typography variant="h6" component="h6" align="left" >
            {"Basic Information"}
          </Typography>
        <CustomerBasicConfirm goToStep={props.goToStep} />
      </Grid>
      <Grid
        item
        xs={12}
      >
          <Typography variant="h6" component="h6" align="left" >
            {"Contact Information"}
          </Typography>
        <CustomerContactConfirm goToStep={props.goToStep} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <React.Fragment>
          <Typography variant="h6" component="h6" align="left" >
            {"Order Items"}
          </Typography>
          {(selectedCartItems.length == 0 &&
            <React.Fragment>
              <Typography variant="body2" component="p" align="center" >
                {"Oops. You haven't selected any item in your cart."}
              </Typography>
              <Box>
                <Button onClick={(e) => props.goToStep(CheckoutStepEnum.ORDER_ITEMS)}>
                  {"Go Back To Order Items Step"}
                </Button>
              </Box>
            </React.Fragment>
          )}
          {renderCartItemConfirmCards()}
        </React.Fragment>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        className={classes.totalCost}
      >
        <CartItemTotal />
      </Grid>
      <Box>
        <Button onClick={handleValidateClick}>
          {"Final Confirm"}
        </Button>
      </Box>
    </Grid>
  )
}

export default FinalConfirmForm

