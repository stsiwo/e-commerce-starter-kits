import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';
import { UserAddressType } from 'domain/user/types';
import { useValidation } from 'hooks/validation';
import { userAccountAddressSchema } from 'hooks/validation/rules';
import * as React from 'react';
import { testAddressList } from 'tests/data/user';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

export declare type CustomerAddressesFormDataType = {
  addressId?: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  postalCode: string
}

const defaultCustomerAddressesFormData: CustomerAddressesFormDataType = {
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "",
  postalCode: "",
}

export declare type CustomerAddressesFormValidationDataType = {
  addressId?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  country?: string
  postalCode?: string
}

const defaultUserAccountValidationAddressData: CustomerAddressesFormValidationDataType = {
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "",
  postalCode: "",
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      margin: theme.spacing(1),
      textAlign: "center",
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      display: "flex",
      maxWidth: 400,
      width: "80%",
      margin: "5px auto",

    },
    listBox: {
      maxWidth: 400,
      width: "80%",
      margin: "5px auto",
    },
    modalBox: {

    },
    modalContent: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%)`,
      backgroundColor: "#fff",
      maxWidth: 400,
      width: "80%",
      margin: "5px auto",

    },
    actionBox: {
      textAlign: "center"
    },
  }),
);

export declare type CustomerAddressesFormPropsType = {
  addresses: UserAddressType[]
  curShippingAddress: UserAddressType
  curBillingAddress: UserAddressType
  onShippingAddressChange: React.EventHandler<React.MouseEvent<HTMLLabelElement>>
  onBillingAddressChange: React.EventHandler<React.MouseEvent<HTMLLabelElement>>
}

/**
 * member or admin account management component
 *
 * process:
 *
 *    - 1. recieve the user data prop from parent component
 *
 *    - 2. display the info to this component
 *
 *    - 3. the user modify the input
 *
 *    - 4. every time the user modify the input, validate each of them
 *
 *    - 5. the user click the save button
 *
 *    - 6. display result popup message
 **/
const CustomerAddressesForm: React.FunctionComponent<CustomerAddressesFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // temp user account state
  const [curCustomerAddressesFormState, setCustomerAddressesFormState] = React.useState<CustomerAddressesFormDataType>(defaultCustomerAddressesFormData);

  // validation logic (should move to hooks)
  const [curCustomerAddressesFormValidationState, setCustomerAddressesFormValidationState] = React.useState<CustomerAddressesFormValidationDataType>(defaultUserAccountValidationAddressData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curCustomerAddressesFormState,
    curValidationDomain: curCustomerAddressesFormValidationState,
    schema: userAccountAddressSchema,
    setValidationDomain: setCustomerAddressesFormValidationState
  })

  // event handlers
  const handleAddress1InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress1 = e.currentTarget.value
    updateValidationAt("address1", e.currentTarget.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      address1: nextAddress1
    }));

  }

  const handleAddress2InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress2 = e.currentTarget.value
    updateValidationAt("address2", e.currentTarget.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      address2: nextAddress2
    }));

  }

  const handleCityInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCity = e.currentTarget.value
    updateValidationAt("city", e.currentTarget.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      city: nextCity
    }));
  }

  const handleProvinceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProvince = e.currentTarget.value
    updateValidationAt("province", e.currentTarget.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      province: nextProvince
    }));
  }

  const handleCountryInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCountry = e.currentTarget.value
    updateValidationAt("country", e.currentTarget.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      country: nextCountry
    }));
  }

  const handlePostalCodeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPostalCode = e.currentTarget.value
    updateValidationAt("postalCode", e.currentTarget.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      postalCode: nextPostalCode
    }));
  }

  // update/create logic for address
  //  - true: create
  //  - false: update
  const [isNew, setNew] = React.useState<boolean>(true);

  // modal logic
  const [curModalOpen, setModalOpen] = React.useState<boolean>(false);

  const handleModalOpenClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setModalOpen(true)
  }
  const handleModalCancelClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setModalOpen(false)
  }

  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curCustomerAddressesFormState)

    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")
      if (isNew) {
        console.log("this one is to create new one")
        /**
         * TODO:
         * POST /users/{userId}/addresses to add new one
         **/
      } else {
        console.log("this one is to update existing one")
        /**
         * TODO:
         * PUT /users/{userId}/addresses/{addressId} to update one 
         **/
      }
    } else {
      updateAllValidation()
    }
  }

  // event handler for click 'add new one' button
  const handleAddNewAddressBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setCustomerAddressesFormState(defaultCustomerAddressesFormData)
    setCustomerAddressesFormValidationState(defaultUserAccountValidationAddressData)
    setNew(true);
    setModalOpen(true);
  }

  // delete an existing phone number
  const handleDeleteAddressClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    console.log("delete an existing address event triggered")
    /**
     * TODO: DELETE /users/{userId}/addresses/{phoneId}
     **/
  }

  // event handler to click an address list item to update address
  const handleAddressItemClickEvent: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {

    const targetAddressId: string = e.currentTarget.getAttribute("data-address-id");
    const targetAddress = testAddressList.find((address: UserAddressType) => {
      return address.addressId == targetAddressId
    })

    setCustomerAddressesFormState(targetAddress);
    setCustomerAddressesFormValidationState(defaultUserAccountValidationAddressData)
    setNew(false);
    setModalOpen(true)
  }

  // render functions

  // display current phone number list
  const renderCurAddressListComponent: () => React.ReactNode = () => {
    /**
     * TODO: replace with real one and remove test data
     **/
    //return phones.map((phone: UserAddressType) => {


    return testAddressList.map((address: UserAddressType) => {
      const addressString = Object.values(address).join(" ");
      return (
        <ListItem key={address.addressId} data-address-id={address.addressId} onClick={handleAddressItemClickEvent} >
          <ListItemAvatar>
            <Avatar>
              <HomeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={addressString}
            secondary={""}
          />
          <ListItemSecondaryAction>
            {/**
              * not use usual radio button group because of two different radio group with the same list item
              *
              *   - ref: https://stackoverflow.com/questions/37150254/radiobuttongroup-within-nested-list 
              **/}
            <FormControlLabel 
              value={address.addressId} 
              data-billing-address-id={address.addressId}
              checked={props.curBillingAddress.addressId === address.addressId} 
              control={<Radio />} 
              labelPlacement="bottom"
              label={props.curBillingAddress.addressId === address.addressId ? "shipping" : ""} 
              name="user-billing-address" 
              onClick={props.onBillingAddressChange}
            />
            <FormControlLabel 
              value={address.addressId} 
              data-shipping-address-id={address.addressId}
              checked={props.curShippingAddress.addressId === address.addressId} 
              control={<Radio />} 
              labelPlacement="bottom"
              label={props.curShippingAddress.addressId === address.addressId ? "billing" : ""} 
              name="user-shipping-address" 
              onClick={props.onShippingAddressChange}
            />
          </ListItemSecondaryAction>
        </ListItem>
      )
    })
  }

  // display popup modal to add new phone number

  return (
    <React.Fragment>
      <Box component="div">
        {(props.addresses.length === 0 &&
          <Typography variant="body2" component="p" align="center" >
            {"Oops. You Haven't Added Any Address Yet."}
          </Typography>
        )}
        {(props.addresses.length > 0 &&
              <List className={classes.listBox}>
                {renderCurAddressListComponent()}
              </List>
        )}
        <Box component="div" className={classes.actionBox}>
          <Button onClick={handleAddNewAddressBtnClickEvent}>
            Add New Address
        </Button>
        </Box>
      </Box>
      <Modal
        open={curModalOpen}
        onClose={handleModalOpenClickEvent}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <form className={classes.modalContent} noValidate autoComplete="off">
          <TextField
            id="address1"
            label="Address 1"
            className={classes.formControl}
            value={curCustomerAddressesFormState.address1}
            onChange={handleAddress1InputChangeEvent}
            helperText={curCustomerAddressesFormValidationState.address1}
            error={curCustomerAddressesFormValidationState.address1 !== ""}

          />
          <TextField
            id="address2"
            label="Address 2"
            className={classes.formControl}
            value={curCustomerAddressesFormState.address2}
            onChange={handleAddress2InputChangeEvent}
            helperText={curCustomerAddressesFormValidationState.address2}
            error={curCustomerAddressesFormValidationState.address2 !== ""}

          />
          <TextField
            id="city"
            label="City"
            className={classes.formControl}
            value={curCustomerAddressesFormState.city}
            onChange={handleCityInputChangeEvent}
            helperText={curCustomerAddressesFormValidationState.city}
            error={curCustomerAddressesFormValidationState.city !== ""}
          />
          <TextField
            id="province"
            label="Province"
            className={classes.formControl}
            value={curCustomerAddressesFormState.province}
            onChange={handleProvinceInputChangeEvent}
            helperText={curCustomerAddressesFormValidationState.province}
            error={curCustomerAddressesFormValidationState.province !== ""}
          />
          <TextField
            id="country"
            label="Country"
            className={classes.formControl}
            value={curCustomerAddressesFormState.country}
            onChange={handleCountryInputChangeEvent}
            helperText={curCustomerAddressesFormValidationState.country}
            error={curCustomerAddressesFormValidationState.country !== ""}
          />
          <TextField
            id="postal-code"
            label="Postal Code"
            className={classes.formControl}
            value={curCustomerAddressesFormState.postalCode}
            onChange={handlePostalCodeInputChangeEvent}
            helperText={curCustomerAddressesFormValidationState.postalCode}
            error={curCustomerAddressesFormValidationState.postalCode !== ""}
          />
          <Box component="div" className={classes.actionBox}>
            <Button onClick={handleModalCancelClickEvent}>
              Cancel
            </Button>
            <Button onClick={handleUserAccountSaveClickEvent}>
              Save
            </Button>
          </Box>
        </form>
      </Modal>
    </React.Fragment>
  )
}

export default CustomerAddressesForm


