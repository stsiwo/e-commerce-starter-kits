import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CheckoutStepComponentPropsType } from 'components/pages/Checkout/checkoutSteps';
import { UserAddressType, UserPhoneType, UserType } from 'domain/user/types';
import { useSnackbar, VariantType  } from 'notistack';
import * as React from 'react';
import CustomerAddressesForm from './CustomerAddressesForm';
import CustomerPhonesForm from './CustomerPhonesForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  const [isOpenErrorSnackbar, setOpenErrorSnackbar] = React.useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar();


  // selected phone & addresses (shipping & billing)
  const [curPhone, setPhone] = React.useState<UserPhoneType>(
    props.user.phones.length > 0 ? props.user.phones[0] : null 
  );

  const [curShippingAddress, setShippingAddress] = React.useState<UserAddressType>(
    props.user.addresses.length > 0 ? props.user.addresses[0] : null 
  )

  const [curBillingAddress, setBillingAddress] = React.useState<UserAddressType>(
    props.user.addresses.length > 0 ? props.user.addresses[0] : null 
  )

  const handlePhoneChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPhone = props.user.phones.find((phone: UserPhoneType) => phone.phoneId === e.currentTarget.value)
    setPhone(nextPhone)
  }

  const handleShippingAddressChange: React.EventHandler<React.MouseEvent<HTMLLabelElement>> = (e) => {
    const nextAddressId = e.currentTarget.getAttribute("data-shipping-address-id")
    const nextShippingAddress = props.user.addresses.find((address: UserAddressType) =>  address.addressId === nextAddressId)
    setShippingAddress(nextShippingAddress)
  }

  const handleBillingAddressChange: React.EventHandler<React.MouseEvent<HTMLLabelElement>> = (e) => {
    const nextAddressId = e.currentTarget.getAttribute("data-billing-address-id")
    const nextBillingAddress = props.user.addresses.find((address: UserAddressType) =>  address.addressId === nextAddressId)
    setBillingAddress(nextBillingAddress)
  }

  // event handler to validate phone & addresses
  const handleValidateClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    
    // validation failed.
    if (!curPhone ||
      !curShippingAddress ||
      !curBillingAddress) {
        enqueueSnackbar("Please select phone, shipping address, billing address", {
          variant: 'error', 
        })
    // validation passed
    } else {
      props.onNextStepClick(e)
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
          curPhone={curPhone}
          onPhoneChange={handlePhoneChange}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <CustomerAddressesForm 
          addresses={props.user.addresses}
          curShippingAddress={curShippingAddress}
          onShippingAddressChange={handleShippingAddressChange}
          curBillingAddress={curBillingAddress}
          onBillingAddressChange={handleBillingAddressChange}
        />
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Button onClick={handleValidateClick}>
          {"Confirm"}
        </Button>
      </Grid>
    </Grid>
  )
}

export default CustomerContactForm
