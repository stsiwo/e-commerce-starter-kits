import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Modal from "@material-ui/core/Modal";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import { logger } from "configs/logger";
import { findPhone, getPrimaryPhoneId } from "domain/user";
import {
  CustomerPhonesFormDataType,
  CustomerPhonesFormValidationDataType,
  defaultUserAccountValidationPhoneData,
  generateDefaultCustomerPhonesFormData,
  UserPhoneType,
} from "domain/user/types";
import { useValidation } from "hooks/validation";
import { userAccountPhoneSchema } from "hooks/validation/rules";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserPhoneFetchStatusActions,
  postUserPhoneFetchStatusActions,
  putUserPhoneFetchStatusActions,
} from "reducers/slices/app/fetchStatus/user";
import {
  deleteUserPhoneActionCreator,
  patchUserPhoneActionCreator,
  postUserPhoneActionCreator,
  putUserPhoneActionCreator,
} from "reducers/slices/domain/user";
import { FetchStatusEnum } from "src/app";
import { rsSelector } from "src/selectors/selector";
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

export declare type AdminCustomerPhoneFormPropsType = {
  phones: UserPhoneType[];
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
const AdminCustomerPhoneForm: React.FunctionComponent<AdminCustomerPhoneFormPropsType> =
  ({ phones, userId }) => {
    // mui: makeStyles
    const classes = useStyles();

    // dispatch
    const dispatch = useDispatch();

    // max size
    const maxSize = 3;

    // temp user account state
    const [curAdminCustomerPhoneState, setAdminCustomerPhoneState] =
      React.useState<CustomerPhonesFormDataType>(
        generateDefaultCustomerPhonesFormData()
      );

    // validation logic (should move to hooks)
    const [
      curAdminCustomerPhoneValidationState,
      setAdminCustomerPhoneValidationState,
    ] = React.useState<CustomerPhonesFormValidationDataType>(
      defaultUserAccountValidationPhoneData
    );

    const { updateValidationAt, updateAllValidation, isValidSync } =
      useValidation({
        curDomain: curAdminCustomerPhoneState,
        curValidationDomain: curAdminCustomerPhoneValidationState,
        schema: userAccountPhoneSchema,
        setValidationDomain: setAdminCustomerPhoneValidationState,
        defaultValidationDomain: defaultUserAccountValidationPhoneData,
      });

    // event handlers
    const handlePhoneInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextPhoneNumber = e.target.value;
      updateValidationAt("phoneNumber", e.target.value);
      setAdminCustomerPhoneState((prev: CustomerPhonesFormDataType) => ({
        ...prev,
        phoneNumber: nextPhoneNumber,
      }));
    };

    const handleCountryCodeInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextCountryCode = e.target.value;
      updateValidationAt("countryCode", e.target.value);
      setAdminCustomerPhoneState((prev: CustomerPhonesFormDataType) => ({
        ...prev,
        countryCode: nextCountryCode,
      }));
    };

    // event handler to submit
    const handleAdminCustomerSaveClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = async (e) => {
      const isValid: boolean = isValidSync(curAdminCustomerPhoneState);

      log(isValid);

      if (isValid) {
        // pass
        log("passed");

        if (isNew) {
          log("this one is to create new one");

          dispatch(
            postUserPhoneActionCreator({
              userId: userId,
              phoneNumber: curAdminCustomerPhoneState.phoneNumber,
              countryCode: curAdminCustomerPhoneState.countryCode,
              isSelected: curAdminCustomerPhoneState.isSelected,
              version: curAdminCustomerPhoneState.version,
            })
          );
        } else {
          log("this one is to update existing one");
          dispatch(
            putUserPhoneActionCreator({
              userId: userId,
              phoneId: curAdminCustomerPhoneState.phoneId,
              phoneNumber: curAdminCustomerPhoneState.phoneNumber,
              countryCode: curAdminCustomerPhoneState.countryCode,
              isSelected: curAdminCustomerPhoneState.isSelected,
              version: curAdminCustomerPhoneState.version,
            })
          );
        }

        setModalOpen(false);
      } else {
        updateAllValidation();
      }
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

    // event handler for click 'add new one' button
    const handleAddNewPhoneBtnClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      setAdminCustomerPhoneState(generateDefaultCustomerPhonesFormData());
      setAdminCustomerPhoneValidationState(
        defaultUserAccountValidationPhoneData
      );
      setNew(true);
      setModalOpen(true);
    };

    // delete an existing phone number
    const handleDeletePhoneClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      log("delete an existing phone number event triggered");

      const phoneId = e.currentTarget.getAttribute("data-phone-id");

      log("going to delete phone whose id is : " + phoneId);

      dispatch(
        deleteUserPhoneActionCreator({
          userId: userId,
          phoneId: phoneId,
          version: findPhone(phones, phoneId).version,
        })
      );
    };

    // event handler to click an phone list item to update phone
    const handlePhoneItemClickEvent: React.EventHandler<
      React.MouseEvent<HTMLElement>
    > = (e) => {
      const targetPhoneId: string =
        e.currentTarget.getAttribute("data-phone-id");
      const targetPhone = phones.find((phone: UserPhoneType) => {
        return phone.phoneId == targetPhoneId;
      });

      setAdminCustomerPhoneState(targetPhone);
      setAdminCustomerPhoneValidationState(
        defaultUserAccountValidationPhoneData
      );
      setNew(false);
      setModalOpen(true);
    };

    // cur primary phone id
    const curPrimaryId = getPrimaryPhoneId(phones);

    log("cur primary phone id: " + curPrimaryId);

    const handlePhonePrimaryChange: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextPrimePhoneId = e.currentTarget.value;

      dispatch(
        patchUserPhoneActionCreator({
          phoneId: nextPrimePhoneId,
          userId: userId,
          version: findPhone(phones, nextPrimePhoneId).version,
        })
      );
    };

    // close form dialog only when success for post/put/delete
    const curPostFetchStatus = useSelector(
      rsSelector.app.getPostUserPhoneFetchStatus
    );
    const curPutFetchStatus = useSelector(
      rsSelector.app.getPutUserPhoneFetchStatus
    );
    const curDeleteSingleFetchStatus = useSelector(
      rsSelector.app.getDeleteUserPhoneFetchStatus
    );
    React.useEffect(() => {
      if (
        curPostFetchStatus === FetchStatusEnum.SUCCESS ||
        curPutFetchStatus === FetchStatusEnum.SUCCESS ||
        curDeleteSingleFetchStatus === FetchStatusEnum.SUCCESS
      ) {
        setModalOpen(false);

        dispatch(postUserPhoneFetchStatusActions.clear());
        dispatch(putUserPhoneFetchStatusActions.clear());
        dispatch(deleteUserPhoneFetchStatusActions.clear());
      }
    });

    // render functions

    // display current phone number list
    const renderCurPhoneListComponent: () => React.ReactNode = () => {
      return phones.map((phone: UserPhoneType) => {
        return (
          <Card
            key={phone.phoneId}
            className={`${classes.card} ${classes.root}`}
          >
            <CardHeader
              className={classes.cardHeader}
              avatar={
                <Avatar>
                  <PhoneIphoneIcon />
                </Avatar>
              }
              title={phone.phoneNumber}
              subheader={phone.countryCode}
            ></CardHeader>
            <CardActions className={classes.cardActions}>
              <Tooltip title="Primary">
                <FormControlLabel
                  value={phone.phoneId}
                  control={
                    <Radio
                      icon={<FavoriteBorderIcon />}
                      checkedIcon={<FavoriteIcon style={{ fill: "#000000" }} />}
                    />
                  }
                  label={""}
                  classes={{
                    root: classes.noMarginRight,
                  }}
                />
              </Tooltip>
              <IconButton
                edge="end"
                aria-label="delete"
                data-phone-id={phone.phoneId}
                onClick={handleDeletePhoneClickEvent}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="edit"
                data-phone-id={phone.phoneId}
                onClick={handlePhoneItemClickEvent}
              >
                <EditIcon />
              </IconButton>
            </CardActions>
          </Card>
        );
      });
    };

    // display popup modal to add new phone number

    return (
      <React.Fragment>
        <Typography
          variant="h6"
          component="h6"
          align="center"
          className={classes.title}
        >
          {"Phones"}
        </Typography>
        <Box component="div">
          {phones.length === 0 && (
            <Typography variant="body2" component="p" align="center">
              {"Oops. You Haven't Registered Any Phone Yet."}
            </Typography>
          )}
          {phones.length > 0 && (
            <RadioGroup
              value={curPrimaryId}
              aria-label="phone"
              name="user-phone-radio"
              onChange={handlePhonePrimaryChange}
            >
              <List className={classes.listBox}>
                {renderCurPhoneListComponent()}
              </List>
            </RadioGroup>
          )}
          <Box component="div" className={classes.actionBox}>
            <Button
              onClick={handleAddNewPhoneBtnClickEvent}
              disabled={phones.length === maxSize}
              variant="contained"
            >
              Add New Phone
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
              id="phoneNumber"
              label="Phone"
              className={classes.formControl}
              value={curAdminCustomerPhoneState.phoneNumber}
              onChange={handlePhoneInputChangeEvent}
              helperText={curAdminCustomerPhoneValidationState.phoneNumber}
              error={curAdminCustomerPhoneValidationState.phoneNumber !== ""}
            />
            <TextField
              id="country-code"
              label="Country Code"
              disabled
              className={classes.formControl}
              value={curAdminCustomerPhoneState.countryCode}
              onChange={handleCountryCodeInputChangeEvent}
              helperText={curAdminCustomerPhoneValidationState.countryCode}
              error={curAdminCustomerPhoneValidationState.countryCode !== ""}
            />
            <Box component="div" className={classes.actionBox}>
              <Button onClick={handleModalCancelClickEvent} variant="contained">
                Cancel
              </Button>
              <Button
                onClick={handleAdminCustomerSaveClickEvent}
                variant="contained"
              >
                Save
              </Button>
            </Box>
          </form>
        </Modal>
      </React.Fragment>
    );
  };

export default AdminCustomerPhoneForm;
