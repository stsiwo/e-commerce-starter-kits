import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CheckoutStepComponentPropsType } from 'components/pages/Checkout/checkoutSteps';
import { UserAddressType, UserPhoneType, UserType } from 'domain/user/types';
import { useSnackbar, VariantType } from 'notistack';
import * as React from 'react';
import CustomerAddressesForm from './CustomerAddressesForm';
import CustomerPhonesForm from './CustomerPhonesForm';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionBox: {
      textAlign: "right",
      margin: `${theme.spacing(2)}px 0`,
    },
  }),
);

declare type CustomerContactFormPropsType = {
  user: UserType
} & CheckoutStepComponentPropsType

/**
 * checkout: customer information (contact) component
 *
 * process:
 *  
 *   1. keep track of phone and addresses (shipping & billing)
 *
 *   2. display currently registered phones and addresses 
 *
 *   3. provide 'add' & 'remove' option
 *
 *   4. send a update request after update those
 *
 **/
const CustomerContactForm: React.FunctionComponent<CustomerContactFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // snakbar stuff when no phone & addresses are selected
  const { enqueueSnackbar } = useSnackbar();

  const curPrimaryPhone = useSelector(mSelector.makeAuthSelectedPhoneSelector())
  const curBillingAddress = useSelector(mSelector.makeAuthBillingAddressSelector())
  const curShippingAddress = useSelector(mSelector.makeAuthShippingAddressSelector())

  // event handler to validate phone & addresses
  const handleValidateClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    //  - check each phone and addresses whether it sets the isSelected, isBillingAddress, isShippingAddress
    if (curPrimaryPhone && curBillingAddress && curShippingAddress) {
      // validation passed
      props.goToNextStep()
    } else {
      // validation failed.
      enqueueSnackbar("Please select phone, shipping address, and billing address", {
        variant: 'error',
      })
    }
  }

  return (
    <Grid
      container
      justify="center"
    >
      <Grid
        item
        xs={12}
        md={6}
      >
        <CustomerPhonesForm
          phones={props.user.phones}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <CustomerAddressesForm
          addresses={props.user.addresses}
        />
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Button onClick={(e) => props.goToPrevStep()} className={classes.actionBox}>
          {"Previous"}
        </Button>
        <Button onClick={handleValidateClick} className={classes.actionBox}>
          {"Confirm"}
        </Button>
      </Grid>
    </Grid>
  )
}

export default CustomerContactForm
