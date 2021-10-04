import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";
import Radio from "@material-ui/core/Radio";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import HomeIcon from "@material-ui/icons/Home";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import PaymentIcon from "@material-ui/icons/Payment";
import { logger } from "configs/logger";
import {
  findAddress,
  getBillingAddressId,
  getShippingAddressId,
  toAddressString,
} from "domain/user";
import {
  CustomerAddressesFormDataType,
  CustomerAddressesFormValidationDataType,
  defaultUserAccountValidationAddressData,
  generateDefaultCustomerAddressesFormData,
  UserAddressType,
} from "domain/user/types";
import { useValidation } from "hooks/validation";
import { userAccountAddressSchema } from "hooks/validation/rules";
import { useWaitResponse } from "hooks/waitResponse";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserAddressFetchStatusActions,
  postUserAddressFetchStatusActions,
  putUserAddressFetchStatusActions,
} from "reducers/slices/app/fetchStatus/user";
import {
  deleteUserAddressActionCreator,
  patchUserAddressActionCreator,
  postUserAddressActionCreator,
  putUserAddressActionCreator,
} from "reducers/slices/domain/user";
import { FetchStatusEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
import { getCountryList, getProvinceList } from "src/utils";
const log = logger(__filename);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2),
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
    modalBox: {},
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
      textAlign: "center",
    },
    root: {
      margin: `${theme.spacing(1)}px auto`,
      maxWidth: 700,
    },
    cardActions: {
      display: "flex",
      justifyContent: "flex-end",
    },
    card: {},
    cardHeader: {},
    noMarginRight: {
      marginRight: 0,
    },
  })
);

export declare type AdminCustomerAddressFormPropsType = {
  addresses: UserAddressType[];
  userId: string;
};

/**
 * member or admin account form component
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
const AdminCustomerAddressForm: React.FunctionComponent<AdminCustomerAddressFormPropsType> =
  ({ addresses, userId }) => {
    // mui: makeStyles
    const classes = useStyles();

    // max size
    const maxSize = 3;

    // dispatch
    const dispatch = useDispatch();

    // temp user account state
    const [curAdminCustomerAddressState, setAdminCustomerAddressState] =
      React.useState<CustomerAddressesFormDataType>(
        generateDefaultCustomerAddressesFormData()
      );

    // validation logic (should move to hooks)
    const [
      curAdminCustomerAddressValidationState,
      setAdminCustomerAddressValidationState,
    ] = React.useState<CustomerAddressesFormValidationDataType>(
      defaultUserAccountValidationAddressData
    );

    const { updateValidationAt, updateAllValidation, isValidSync } =
      useValidation({
        curDomain: curAdminCustomerAddressState,
        curValidationDomain: curAdminCustomerAddressValidationState,
        schema: userAccountAddressSchema,
        setValidationDomain: setAdminCustomerAddressValidationState,
        defaultValidationDomain: defaultUserAccountValidationAddressData,
      });

    // event handlers
    const handleAddress1InputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextAddress1 = e.target.value;
      updateValidationAt("address1", e.target.value);
      setAdminCustomerAddressState((prev: CustomerAddressesFormDataType) => ({
        ...prev,
        address1: nextAddress1,
      }));
    };

    const handleAddress2InputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextAddress2 = e.target.value;
      updateValidationAt("address2", e.target.value);
      setAdminCustomerAddressState((prev: CustomerAddressesFormDataType) => ({
        ...prev,
        address2: nextAddress2,
      }));
    };

    const handleCityInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextCity = e.target.value;
      updateValidationAt("city", e.target.value);
      setAdminCustomerAddressState((prev: CustomerAddressesFormDataType) => ({
        ...prev,
        city: nextCity,
      }));
    };

    const handleProvinceInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextProvince = e.target.value;
      updateValidationAt("province", e.target.value);
      setAdminCustomerAddressState((prev: CustomerAddressesFormDataType) => ({
        ...prev,
        province: nextProvince,
      }));
    };

    const handleCountryInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextCountry = e.target.value;
      updateValidationAt("country", e.target.value);
      setAdminCustomerAddressState((prev: CustomerAddressesFormDataType) => ({
        ...prev,
        country: nextCountry,
      }));
    };

    const handlePostalCodeInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextPostalCode = e.target.value;
      updateValidationAt("postalCode", e.target.value);
      setAdminCustomerAddressState((prev: CustomerAddressesFormDataType) => ({
        ...prev,
        postalCode: nextPostalCode,
      }));
    };

    // update/create logic for address
    //  - true: create
    //  - false: update
    const [isNew, setNew] = React.useState<boolean>(true);

    // modal logic
    const [curModalOpen, setModalOpen] = React.useState<boolean>(false);

    const handleModalOpenClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      setModalOpen(true);
    };
    const handleModalCancelClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      setModalOpen(false);
    };

    // event handler to submit
    const handleAdminCustomerSaveClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = async (e) => {
      const isValid: boolean = isValidSync(curAdminCustomerAddressState);

      log(isValid);

      if (isValid) {
        // pass

        log("passed");
        if (isNew) {
          log("this one is to create new one");
          dispatch(
            postUserAddressActionCreator({
              userId: userId,
              address1: curAdminCustomerAddressState.address1,
              address2: curAdminCustomerAddressState.address2,
              city: curAdminCustomerAddressState.city,
              province: curAdminCustomerAddressState.province,
              country: curAdminCustomerAddressState.country,
              postalCode: curAdminCustomerAddressState.postalCode,
              isBillingAddress: false,
              isShippingAddress: false,
              version: null,
            })
          );
        } else {
          log("this one is to update existing one");
          dispatch(
            putUserAddressActionCreator({
              userId: userId,
              addressId: curAdminCustomerAddressState.addressId,
              address1: curAdminCustomerAddressState.address1,
              address2: curAdminCustomerAddressState.address2,
              city: curAdminCustomerAddressState.city,
              province: curAdminCustomerAddressState.province,
              country: curAdminCustomerAddressState.country,
              postalCode: curAdminCustomerAddressState.postalCode,
              isBillingAddress: curAdminCustomerAddressState.isBillingAddress,
              isShippingAddress: curAdminCustomerAddressState.isShippingAddress,
              version: curAdminCustomerAddressState.version,
            })
          );
        }
      } else {
        updateAllValidation();
      }
    };

    // event handler for click 'add new one' button
    const handleAddNewAddressBtnClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      setAdminCustomerAddressState(generateDefaultCustomerAddressesFormData());
      setAdminCustomerAddressValidationState(
        defaultUserAccountValidationAddressData
      );
      setNew(true);
      setModalOpen(true);
    };

    // delete an existing address number
    const handleDeleteAddressClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      log("delete an existing address event triggered");

      const addressId = e.currentTarget.getAttribute("data-address-id");

      log("target address id to be remvoed: " + addressId);

      dispatch(
        deleteUserAddressActionCreator({
          userId: userId,
          addressId: addressId,
          version: findAddress(addresses, addressId).version,
        })
      );
      // request
    };

    // event handler to click an address list item to update address
    const handleAddressItemClickEvent: React.EventHandler<
      React.MouseEvent<HTMLElement>
    > = (e) => {
      const targetAddressId: string =
        e.currentTarget.getAttribute("data-address-id");
      const targetAddress = addresses.find((address: UserAddressType) => {
        return address.addressId == targetAddressId;
      });

      setAdminCustomerAddressState(targetAddress);
      setAdminCustomerAddressValidationState(
        defaultUserAccountValidationAddressData
      );
      setNew(false);
      setModalOpen(true);
    };

    // shipping & billing address selection stuff
    const [curShippingId, setShippingId] = React.useState<string>(
      getShippingAddressId(addresses)
    );
    const [curBillingId, setBillingId] = React.useState<string>(
      getBillingAddressId(addresses)
    );

    const handleBillingAddressChange = (
      e: React.MouseEvent<HTMLLabelElement>,
      addressId: string
    ) => {
      setBillingId(addressId);

      dispatch(
        patchUserAddressActionCreator({
          userId: userId,
          addressId: addressId,
          type: "billing",
          version: findAddress(addresses, addressId).version,
        })
      );
    };

    const handleShippingAddressChange = (
      e: React.MouseEvent<HTMLLabelElement>,
      addressId: string
    ) => {
      setShippingId(addressId);

      dispatch(
        patchUserAddressActionCreator({
          userId: userId,
          addressId: addressId,
          type: "shipping",
          version: findAddress(addresses, addressId).version,
        })
      );
    };

    // close form dialog only when success for post/put/delete
    const curPostFetchStatus = useSelector(
      rsSelector.app.getPostUserAddressFetchStatus
    );
    const curPutFetchStatus = useSelector(
      rsSelector.app.getPutUserAddressFetchStatus
    );
    const curDeleteSingleFetchStatus = useSelector(
      rsSelector.app.getDeleteUserAddressFetchStatus
    );
    React.useEffect(() => {
      if (
        curPostFetchStatus === FetchStatusEnum.SUCCESS ||
        curPutFetchStatus === FetchStatusEnum.SUCCESS ||
        curDeleteSingleFetchStatus === FetchStatusEnum.SUCCESS
      ) {
        setModalOpen(false);

        dispatch(postUserAddressFetchStatusActions.clear());
        dispatch(putUserAddressFetchStatusActions.clear());
        dispatch(deleteUserAddressFetchStatusActions.clear());
      }
    });

    /**
     * avoid multiple click submission
     */
    const curDeleteFetchStatus = useSelector(
      rsSelector.app.getDeleteUserAddressFetchStatus
    );
    const { curDisableBtnStatus: curDisableDeleteBtnStatus } = useWaitResponse({
      fetchStatus: curDeleteFetchStatus,
    });

    const curPatchFetchStatus = useSelector(
      rsSelector.app.getPatchUserAddressFetchStatus
    );
    const { curDisableBtnStatus: curDisablePatchBtnStatus } = useWaitResponse({
      fetchStatus: curPatchFetchStatus,
    });
    /**
     * avoid multiple click submission
     */
    const { curDisableBtnStatus: curDisablePostBtnStatus } = useWaitResponse({
      fetchStatus: curPostFetchStatus,
    });
    const { curDisableBtnStatus: curDisablePutBtnStatus } = useWaitResponse({
      fetchStatus: curPutFetchStatus,
    });

    // render functions

    // display current address number list
    const renderCurAddressListComponent: () => React.ReactNode = () => {
      return addresses.map((address: UserAddressType) => {
        log("render address compoennt: " + address.addressId);

        return (
          <Card
            key={address.addressId}
            className={`${classes.card} ${classes.root}`}
          >
            <CardHeader
              className={classes.cardHeader}
              avatar={
                <Avatar>
                  <HomeIcon />
                </Avatar>
              }
              title={toAddressString(address)}
            ></CardHeader>
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
                    control={
                      <Radio
                        icon={<LocalShippingIcon color="disabled" />}
                        checkedIcon={
                          <LocalShippingIcon style={{ fill: "#000000" }} />
                        }
                      />
                    }
                    label={""}
                    labelPlacement="bottom"
                    disabled={curDisablePatchBtnStatus}
                    name="user-billing-address"
                    onClick={(e) =>
                      handleShippingAddressChange(e, address.addressId)
                    }
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
                    disabled={curDisablePatchBtnStatus}
                    control={
                      <Radio
                        icon={<PaymentIcon color="disabled" />}
                        checkedIcon={
                          <PaymentIcon style={{ fill: "#000000" }} />
                        }
                      />
                    }
                    label={""}
                    labelPlacement="bottom"
                    name="user-shipping-address"
                    onClick={(e) =>
                      handleBillingAddressChange(e, address.addressId)
                    }
                    classes={{
                      root: classes.noMarginRight,
                    }}
                  />
                </Tooltip>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  data-address-id={address.addressId}
                  onClick={handleDeleteAddressClickEvent}
                  disabled={curDisableDeleteBtnStatus}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  data-address-id={address.addressId}
                  onClick={handleAddressItemClickEvent}
                >
                  <EditIcon />
                </IconButton>
              </React.Fragment>
            </CardActions>
          </Card>
        );
      });
    };

    // display popup modal to add new address number

    return (
      <React.Fragment>
        <Typography
          variant="h6"
          component="h6"
          align="center"
          className={classes.title}
        >
          {"Addresses"}
        </Typography>
        <Box component="div">
          {addresses.length === 0 && (
            <Typography variant="body2" component="p" align="center">
              {"Oops. You Haven't Registered Any Address Yet."}
            </Typography>
          )}
          {addresses.length > 0 && (
            <List className={classes.listBox}>
              {renderCurAddressListComponent()}
            </List>
          )}
          <Box component="div" className={classes.actionBox}>
            <Button
              onClick={handleAddNewAddressBtnClickEvent}
              disabled={addresses.length === maxSize}
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
              value={curAdminCustomerAddressState.address1}
              onChange={handleAddress1InputChangeEvent}
              helperText={curAdminCustomerAddressValidationState.address1}
              error={curAdminCustomerAddressValidationState.address1 !== ""}
            />
            <TextField
              id="address2"
              label="Address 2"
              className={classes.formControl}
              value={curAdminCustomerAddressState.address2}
              onChange={handleAddress2InputChangeEvent}
              helperText={curAdminCustomerAddressValidationState.address2}
              error={curAdminCustomerAddressValidationState.address2 !== ""}
            />
            <TextField
              id="city"
              label="City"
              className={classes.formControl}
              value={curAdminCustomerAddressState.city}
              onChange={handleCityInputChangeEvent}
              helperText={curAdminCustomerAddressValidationState.city}
              error={curAdminCustomerAddressValidationState.city !== ""}
            />
            <TextField
              id="province"
              label="Province"
              select
              className={classes.formControl}
              value={curAdminCustomerAddressState.province}
              onChange={handleProvinceInputChangeEvent}
              helperText={curAdminCustomerAddressValidationState.province}
              error={curAdminCustomerAddressValidationState.province !== ""}
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
              value={curAdminCustomerAddressState.country}
              onChange={handleCountryInputChangeEvent}
              helperText={curAdminCustomerAddressValidationState.country}
              error={curAdminCustomerAddressValidationState.country !== ""}
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
              value={curAdminCustomerAddressState.postalCode}
              onChange={handlePostalCodeInputChangeEvent}
              helperText={curAdminCustomerAddressValidationState.postalCode}
              error={curAdminCustomerAddressValidationState.postalCode !== ""}
            />
            <Box component="div" className={classes.actionBox}>
              <Button onClick={handleModalCancelClickEvent} variant="contained">
                Cancel
              </Button>
              <Button
                onClick={handleAdminCustomerSaveClickEvent}
                variant="contained"
                disabled={curDisablePostBtnStatus || curDisablePutBtnStatus}
              >
                Save
              </Button>
            </Box>
          </form>
        </Modal>
      </React.Fragment>
    );
  };

export default AdminCustomerAddressForm;
