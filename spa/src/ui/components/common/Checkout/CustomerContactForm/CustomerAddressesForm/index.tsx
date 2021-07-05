import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Modal from '@material-ui/core/Modal';
import Radio from '@material-ui/core/Radio';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import Tooltip from '@material-ui/core/Tooltip';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PaymentIcon from '@material-ui/icons/Payment';
import { toAddressString, getShippingAddressId, getBillingAddressId } from 'domain/user';
import { CustomerAddressesFormDataType, CustomerAddressesFormValidationDataType, defaultUserAccountValidationAddressData, generateDefaultCustomerAddressesFormData, UserAddressType } from 'domain/user/types';
import { useValidation } from 'hooks/validation';
import { userAccountAddressSchema } from 'hooks/validation/rules';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAuthAddressActionCreator, patchAuthAddressActionCreator, postAuthAddressActionCreator, putAuthAddressActionCreator } from 'reducers/slices/app';
import { mSelector } from 'src/selectors/selector';
import { getCountryList, getProvinceList } from 'src/utils';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';


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
    root: {
      margin: `${theme.spacing(1)}px auto`,
      maxWidth: 700,
    },
    cardActions: {
      display: "flex",
      justifyContent: "flex-end",
    },
    card: {
    },
    cardHeader: {
    },
    noMarginRight: {
      marginRight: 0,
    }
  }),
);

export declare type CustomerAddressesFormPropsType = {
  addresses: UserAddressType[]
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

  // max size
  const maxSize = 3;

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  // shipping & billing address selection stuff
  const [curShippingId, setShippingId] = React.useState<string>(getShippingAddressId(auth.user.addresses));
  const [curBillingId, setBillingId] = React.useState<string>(getBillingAddressId(auth.user.addresses));

  // dispatch
  const dispatch = useDispatch();

  // temp user account state
  const [curCustomerAddressesFormState, setCustomerAddressesFormState] = React.useState<CustomerAddressesFormDataType>(generateDefaultCustomerAddressesFormData());

  // validation logic (should move to hooks)
  const [curCustomerAddressesFormValidationState, setCustomerAddressesFormValidationState] = React.useState<CustomerAddressesFormValidationDataType>(defaultUserAccountValidationAddressData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curCustomerAddressesFormState,
    curValidationDomain: curCustomerAddressesFormValidationState,
    schema: userAccountAddressSchema,
    setValidationDomain: setCustomerAddressesFormValidationState,
    defaultValidationDomain: defaultUserAccountValidationAddressData,
  })

  // event handlers
  const handleAddress1InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress1 = e.target.value
    updateValidationAt("address1", e.target.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      address1: nextAddress1
    }));

  }

  const handleAddress2InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress2 = e.target.value
    updateValidationAt("address2", e.target.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      address2: nextAddress2
    }));

  }

  const handleCityInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCity = e.target.value
    updateValidationAt("city", e.target.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      city: nextCity
    }));
  }

  const handleProvinceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProvince = e.target.value
    updateValidationAt("province", e.target.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      province: nextProvince
    }));
  }

  const handleCountryInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCountry = e.target.value
    updateValidationAt("country", e.target.value);
    setCustomerAddressesFormState((prev: CustomerAddressesFormDataType) => ({
      ...prev,
      country: nextCountry
    }));
  }

  const handlePostalCodeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPostalCode = e.target.value
    updateValidationAt("postalCode", e.target.value);
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

        dispatch(
          postAuthAddressActionCreator(curCustomerAddressesFormState)
        )

        setModalOpen(false);

      } else {
        console.log("this one is to update existing one")

        dispatch(
          putAuthAddressActionCreator(curCustomerAddressesFormState)
        )

        setModalOpen(false);
      }
    } else {
      updateAllValidation()
    }
  }

  // event handler for click 'add new one' button
  const handleAddNewAddressBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setCustomerAddressesFormState(generateDefaultCustomerAddressesFormData)
    setCustomerAddressesFormValidationState(defaultUserAccountValidationAddressData)
    setNew(true);
    setModalOpen(true);
  }

  // delete an existing phone number
  const handleDeleteAddressClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    console.log("delete an existing address event triggered")

    const addressId = e.currentTarget.getAttribute("data-address-id")

    console.log("target address id to be remvoed: " + addressId);

    dispatch(
      deleteAuthAddressActionCreator({
        addressId: addressId,
      })
    )
  }

  // event handler to click an address list item to update address
  const handleAddressItemClickEvent: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {

    const targetAddressId: string = e.currentTarget.getAttribute("data-address-id");
    const targetAddress = props.addresses.find((address: UserAddressType) => {
      return address.addressId == targetAddressId
    })

    setCustomerAddressesFormState(targetAddress);
    setCustomerAddressesFormValidationState(defaultUserAccountValidationAddressData)
    setNew(false);
    setModalOpen(true)
  }

  const handleBillingAddressChange = (e: React.MouseEvent<HTMLLabelElement>, addressId: string) => {

    setBillingId(addressId)

    dispatch(
      patchAuthAddressActionCreator({ addressId: addressId, type: "billing" })
    );
  }

  const handleShippingAddressChange = (e: React.MouseEvent<HTMLLabelElement>, addressId: string) => {

    setShippingId(addressId)

    dispatch(
      patchAuthAddressActionCreator({ addressId: addressId, type: "shipping" })
    );
  }
  // render functions

  // display current phone number list
  const renderCurAddressListComponent: () => React.ReactNode = () => {
    return props.addresses.map((address: UserAddressType) => {
      return (
        <Card key={address.addressId} className={`${classes.card} ${classes.root}`}>
          <CardHeader
            className={classes.cardHeader}
            avatar={
              <Avatar>
                <HomeIcon />
              </Avatar>
            }
            title={toAddressString(address)}
          >
          </CardHeader>
          <CardActions className={classes.cardActions}>
            <React.Fragment>
              {/**
                * not use usual radio button group because of two different radio group with the same list item
                *
                *   - ref: https://stackoverflow.com/questions/37150254/radiobuttongroup-within-nested-list 
                **/}
              <Tooltip title="Shipping Address">
                <FormControlLabel
                  value={address.addressId}
                  data-billing-address-id={address.addressId}
                  checked={curShippingId === address.addressId}
                  control={<Radio icon={<LocalShippingIcon color="disabled" />} checkedIcon={<LocalShippingIcon style={{ fill: "#000000" }} />} />}
                  label={""}
                  labelPlacement="bottom"
                  name="user-billing-address"
                  onClick={(e) => handleShippingAddressChange(e, address.addressId)}
                  classes={{
                    root: classes.noMarginRight,
                  }}
                />
              </Tooltip>
              <Tooltip title="Billing Address">
                <FormControlLabel
                  value={address.addressId}
                  data-shipping-address-id={address.addressId}
                  checked={curBillingId === address.addressId}
                  control={<Radio icon={<PaymentIcon color="disabled" />} checkedIcon={<PaymentIcon style={{ fill: "#000000" }} />} />}
                  label={""}
                  labelPlacement="bottom"
                  name="user-shipping-address"
                  onClick={(e) => handleBillingAddressChange(e, address.addressId)}
                  classes={{
                    root: classes.noMarginRight,
                  }}
                />
              </Tooltip>
              <IconButton edge="end" aria-label="delete" data-address-id={address.addressId} onClick={handleDeleteAddressClickEvent}>
                <DeleteIcon />
              </IconButton>
              <IconButton edge="end" aria-label="edit" data-address-id={address.addressId} onClick={handleAddressItemClickEvent}>
                <EditIcon />
              </IconButton>
            </React.Fragment>
          </CardActions>
        </Card>
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
          <Button 
            onClick={handleAddNewAddressBtnClickEvent}
            disabled={props.addresses.length === maxSize}
            variant="contained"
          >
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
            select
            className={classes.formControl}
            value={curCustomerAddressesFormState.province}
            onChange={handleProvinceInputChangeEvent}
            helperText={curCustomerAddressesFormValidationState.province}
            error={curCustomerAddressesFormValidationState.province !== ""}
          >
            {getProvinceList().map((province) => (
              <MenuItem key={province} value={province}>
                {province}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="country"
            label="Country"
            select
            disabled
            className={classes.formControl}
            value={curCustomerAddressesFormState.country}
            onChange={handleCountryInputChangeEvent}
            helperText={curCustomerAddressesFormValidationState.country}
            error={curCustomerAddressesFormValidationState.country !== ""}
          >
            {Object.keys(getCountryList()).map((country2Alpha: string) => (
              <MenuItem key={country2Alpha} value={country2Alpha}>
                {getCountryList()[country2Alpha]}
              </MenuItem>
            ))}
          </TextField>
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
            <Button onClick={handleModalCancelClickEvent} variant="contained">
              Cancel
            </Button>
            <Button onClick={handleUserAccountSaveClickEvent} variant="contained">
              Save
            </Button>
          </Box>
        </form>
      </Modal>
    </React.Fragment>
  )
}

export default CustomerAddressesForm


