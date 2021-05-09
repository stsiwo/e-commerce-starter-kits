import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import Radio from '@material-ui/core/Radio';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { getBillingAddressId, getShippingAddressId } from 'domain/user';
import { UserAddressType } from 'domain/user/types';
import { useValidation } from 'hooks/validation';
import { userAccountAddressSchema } from 'hooks/validation/rules';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from 'reducers/slices/app';
import { mSelector } from 'src/selectors/selector';

export declare type UserAccountAddressDataType = {
  addressId?: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  postalCode: string
}

const defaultUserAccountAddressData: UserAccountAddressDataType = {
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "",
  postalCode: "",
}

export declare type UserAccountAddressValidationDataType = {
  addressId?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  country?: string
  postalCode?: string
}

const defaultUserAccountValidationAddressData: UserAccountAddressValidationDataType = {
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "",
  postalCode: "",
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2)
    },
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

export declare type UserAccountAddressManagementPropsType = {
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
const UserAccountAddressManagement: React.FunctionComponent<UserAccountAddressManagementPropsType> = ({ addresses }) => {

  // mui: makeStyles
  const classes = useStyles();

  // dispatch
  const dispatch = useDispatch();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // temp user account state
  const [curUserAccountAddressState, setUserAccountAddressState] = React.useState<UserAccountAddressDataType>(defaultUserAccountAddressData);

  // validation logic (should move to hooks)
  const [curUserAccountAddressValidationState, setUserAccountAddressValidationState] = React.useState<UserAccountAddressValidationDataType>(defaultUserAccountValidationAddressData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curUserAccountAddressState,
    curValidationDomain: curUserAccountAddressValidationState,
    schema: userAccountAddressSchema,
    setValidationDomain: setUserAccountAddressValidationState
  })

  // event handlers
  const handleAddress1InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress1 = e.currentTarget.value
    updateValidationAt("address1", e.currentTarget.value);
    setUserAccountAddressState((prev: UserAccountAddressDataType) => ({
      ...prev,
      address1: nextAddress1
    }));

  }

  const handleAddress2InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress2 = e.currentTarget.value
    updateValidationAt("address2", e.currentTarget.value);
    setUserAccountAddressState((prev: UserAccountAddressDataType) => ({
      ...prev,
      address2: nextAddress2
    }));

  }

  const handleCityInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCity = e.currentTarget.value
    updateValidationAt("city", e.currentTarget.value);
    setUserAccountAddressState((prev: UserAccountAddressDataType) => ({
      ...prev,
      city: nextCity
    }));
  }

  const handleProvinceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProvince = e.currentTarget.value
    updateValidationAt("province", e.currentTarget.value);
    setUserAccountAddressState((prev: UserAccountAddressDataType) => ({
      ...prev,
      province: nextProvince
    }));
  }

  const handleCountryInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCountry = e.currentTarget.value
    updateValidationAt("country", e.currentTarget.value);
    setUserAccountAddressState((prev: UserAccountAddressDataType) => ({
      ...prev,
      country: nextCountry
    }));
  }

  const handlePostalCodeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPostalCode = e.currentTarget.value
    updateValidationAt("postalCode", e.currentTarget.value);
    setUserAccountAddressState((prev: UserAccountAddressDataType) => ({
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

    const isValid: boolean = isValidSync(curUserAccountAddressState)

    console.log(isValid);

    if (isValid) {
      // pass 


      console.log("passed")
      if (isNew) {
        console.log("this one is to create new one")
        // request
        api.request({
          method: 'POST',
          url: API1_URL + `/users/${auth.user.userId}/addresses`,
          data: JSON.stringify(curUserAccountAddressState),
        }).then((data) => {
          /**
           * update auth
           **/
          const updatedUser = data.data;
          dispatch(authActions.update({
            ...auth,
            user: updatedUser,
          }))
          enqueueSnackbar("added successfully.", { variant: "success" })
        }).catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" })
        })
      } else {
        console.log("this one is to update existing one")
        // request
        api.request({
          method: 'PUT',
          url: API1_URL + `/users/${auth.user.userId}/addresses/${curUserAccountAddressState.addressId}`,
          data: JSON.stringify(curUserAccountAddressState),
        }).then((data) => {
          /**
           * update auth
           **/
          const updatedUser = data.data;
          dispatch(authActions.update({
            ...auth,
            user: updatedUser,
          }))
          enqueueSnackbar("updated successfully.", { variant: "success" })
        }).catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" })
        })
      }
    } else {
      updateAllValidation()
    }
  }

  // event handler for click 'add new one' button
  const handleAddNewAddressBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setUserAccountAddressState(defaultUserAccountAddressData)
    setUserAccountAddressValidationState(defaultUserAccountValidationAddressData)
    setNew(true);
    setModalOpen(true);
  }

  // delete an existing phone number
  const handleDeleteAddressClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    console.log("delete an existing address event triggered")

    const addressId = e.currentTarget.getAttribute("data-address-id")
    // request
    api.request({
      method: 'DELETE',
      url: API1_URL + `/users/${auth.user.userId}/addresses/${addressId}`
    }).then((data) => {

      /**
       * update auth
       **/
      const updatedUser = data.data;
      dispatch(authActions.update({
        ...auth,
        user: updatedUser,
      }))

      enqueueSnackbar("deleted successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })
  }

  // event handler to click an address list item to update address
  const handleAddressItemClickEvent: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {

    const targetAddressId: string = e.currentTarget.getAttribute("data-address-id");
    const targetAddress = auth.user.addresses.find((address: UserAddressType) => {
      return address.addressId == targetAddressId
    })

    setUserAccountAddressState(targetAddress);
    setUserAccountAddressValidationState(defaultUserAccountValidationAddressData)
    setNew(false);
    setModalOpen(true)
  }

  // shipping & billing address selection stuff
  const [curShippingId, setShippingId] = React.useState<string>(getShippingAddressId(auth.user.addresses));
  const [curBillingId, setBillingId] = React.useState<string>(getBillingAddressId(auth.user.addresses));

  const handleBillingAddressChange: React.EventHandler<React.MouseEvent<HTMLLabelElement>> = (e) => {

    const nextBillingAddress = e.currentTarget.getAttribute("data-billing-address-id")

    setBillingId(nextBillingAddress)

    // request
    api.request({
      method: 'PATCH',
      url: API1_URL + `/users/${auth.user.userId}/addresses/${nextBillingAddress}`,
      data: JSON.stringify({ type: "billing" })
    }).then((data) => {

      /**
       * update auth
       **/
      const updatedUser = data.data;
      dispatch(authActions.update({
        ...auth,
        user: updatedUser,
      }))

      enqueueSnackbar("updated successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })

  }

  const handleShippingAddressChange: React.EventHandler<React.MouseEvent<HTMLLabelElement>> = (e) => {

    const nextShippingAddress = e.currentTarget.getAttribute("data-shipping-address-id")

    setShippingId(nextShippingAddress)

    // request
    api.request({
      method: 'PATCH',
      url: API1_URL + `/users/${auth.user.userId}/addresses/${nextShippingAddress}`,
      data: JSON.stringify({ type: "shipping" })
    }).then((data) => {

      /**
       * update auth
       **/
      const updatedUser = data.data;
      dispatch(authActions.update({
        ...auth,
        user: updatedUser,
      }))

      enqueueSnackbar("updated successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })

  }
  // render functions

  // display current phone number list
  const renderCurAddressListComponent: () => React.ReactNode = () => {

    return auth.user.addresses.map((address: UserAddressType) => {
      const addressString = Object.values(address).join(" ");
      return (
        <ListItem key={address.addressId} >
          <ListItemAvatar>
            <Avatar>
              <HomeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={addressString}
            secondary={
              <React.Fragment>
                {/**
                * not use usual radio button group because of two different radio group with the same list item
                *
                *   - ref: https://stackoverflow.com/questions/37150254/radiobuttongroup-within-nested-list 
                **/}
                <FormControlLabel
                  value={address.addressId}
                  data-billing-address-id={address.addressId}
                  checked={curShippingId === address.addressId}
                  control={<Radio />}
                  labelPlacement="bottom"
                  label={curShippingId === address.addressId ? "shipping" : ""}
                  name="user-billing-address"
                  onClick={handleShippingAddressChange}
                />
                <FormControlLabel
                  value={address.addressId}
                  data-shipping-address-id={address.addressId}
                  checked={curBillingId === address.addressId}
                  control={<Radio />}
                  labelPlacement="bottom"
                  label={curBillingId === address.addressId ? "billing" : ""}
                  name="user-shipping-address"
                  onClick={handleBillingAddressChange}
                />
                <IconButton edge="end" aria-label="delete" data-address-id={address.addressId} onClick={handleDeleteAddressClickEvent}>
                  <DeleteIcon />
                </IconButton>
                <IconButton edge="end" aria-label="edit" data-address-id={address.addressId} onClick={handleAddressItemClickEvent}>
                  <EditIcon />
                </IconButton>
              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
          </ListItemSecondaryAction>
        </ListItem>
      )
    })
  }

  // display popup modal to add new phone number

  return (
    <React.Fragment>
      <Typography variant="h6" component="h6" align="center" className={classes.title} >
        {"Addresses"}
      </Typography>
      <Box component="div">
        {(auth.user.addresses.length === 0 &&
          <Typography variant="body2" component="p" align="center" >
            {"Oops. You Haven't Registered Any Address Yet."}
          </Typography>
        )}
        {(auth.user.addresses.length > 0 &&
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
            value={curUserAccountAddressState.address1}
            onChange={handleAddress1InputChangeEvent}
            helperText={curUserAccountAddressValidationState.address1}
            error={curUserAccountAddressValidationState.address1 !== ""}

          />
          <TextField
            id="address2"
            label="Address 2"
            className={classes.formControl}
            value={curUserAccountAddressState.address2}
            onChange={handleAddress2InputChangeEvent}
            helperText={curUserAccountAddressValidationState.address2}
            error={curUserAccountAddressValidationState.address2 !== ""}

          />
          <TextField
            id="city"
            label="City"
            className={classes.formControl}
            value={curUserAccountAddressState.city}
            onChange={handleCityInputChangeEvent}
            helperText={curUserAccountAddressValidationState.city}
            error={curUserAccountAddressValidationState.city !== ""}
          />
          <TextField
            id="province"
            label="Province"
            className={classes.formControl}
            value={curUserAccountAddressState.province}
            onChange={handleProvinceInputChangeEvent}
            helperText={curUserAccountAddressValidationState.province}
            error={curUserAccountAddressValidationState.province !== ""}
          />
          <TextField
            id="country"
            label="Country"
            className={classes.formControl}
            value={curUserAccountAddressState.country}
            onChange={handleCountryInputChangeEvent}
            helperText={curUserAccountAddressValidationState.country}
            error={curUserAccountAddressValidationState.country !== ""}
          />
          <TextField
            id="postal-code"
            label="Postal Code"
            className={classes.formControl}
            value={curUserAccountAddressState.postalCode}
            onChange={handlePostalCodeInputChangeEvent}
            helperText={curUserAccountAddressValidationState.postalCode}
            error={curUserAccountAddressValidationState.postalCode !== ""}
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

export default UserAccountAddressManagement

