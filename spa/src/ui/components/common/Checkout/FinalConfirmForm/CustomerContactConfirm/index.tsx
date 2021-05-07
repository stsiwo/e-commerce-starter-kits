import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import Grid from '@material-ui/core/Grid';
import PhoneConfirmCard from '../PhoneConfirmCard';
import { testMemberUser } from 'tests/data/user';
import AddressConfirmCard from '../AddressConfirmCard';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { CheckoutStepEnum } from 'components/pages/Checkout';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      margin: theme.spacing(1),
      textAlign: "center",
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      maxWidth: 300,
      margin: "5px 5px",

    },
    actionBox: {
      textAlign: "center"
    },
  }),
);

declare type CustomerContactConfirmPropsType = {
  goToStep?: (step: CheckoutStepEnum) => void
}

/**
 * checkout: payment - customer basic info conform form  
 *
 * process:
 *
 *  1. display all user basic info
 *
 *  2. disabled all input 
 *
 *  3. if the user want to edit, change stepper id to go back to 'customer basic informaiton' step.
 *
 **/
const CustomerContactConfirm: React.FunctionComponent<CustomerContactConfirmPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  const selectedPhone = useSelector(mSelector.makeAuthSelectedPhoneSelector())
  const shippingAddress = useSelector(mSelector.makeAuthShippingAddressSelector())
  const billingAddress = useSelector(mSelector.makeAuthBillingAddressSelector())

  return (
    <Box component="div">
      <Grid
        container
        justify="center"
      >
        <Grid
          item
          xs={12}
          md={4}

        >
          <PhoneConfirmCard phone={selectedPhone} goToStep={props.goToStep} />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
        >
          <AddressConfirmCard
            address={shippingAddress}
            headerIcon={<LocalShippingIcon />}
            title={"Shipping Address"}
            goToStep={props.goToStep}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
        >
          <AddressConfirmCard
            address={billingAddress}
            headerIcon={<ReceiptIcon />}
            title={"Billing Address"}
            goToStep={props.goToStep}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default CustomerContactConfirm





