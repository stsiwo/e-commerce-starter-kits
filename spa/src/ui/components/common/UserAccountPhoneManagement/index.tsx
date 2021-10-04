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
import { findPhone } from "domain/user";
import {
  CustomerPhonesFormDataType,
  CustomerPhonesFormValidationDataType,
  defaultUserAccountValidationPhoneData,
  generateDefaultCustomerPhonesFormData,
  UserPhoneType,
} from "domain/user/types";
import { useValidation } from "hooks/validation";
import { userAccountPhoneSchema } from "hooks/validation/rules";
import { useWaitResponse } from "hooks/waitResponse";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAuthPhoneActionCreator,
  patchAuthPhoneActionCreator,
  postAuthPhoneActionCreator,
  putAuthPhoneActionCreator,
} from "reducers/slices/app";
import {
  deleteAuthPhoneFetchStatusActions,
  postAuthPhoneFetchStatusActions,
  putAuthPhoneFetchStatusActions,
} from "reducers/slices/app/fetchStatus/auth";
import { FetchStatusEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
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

export declare type UserAccountPhoneManagementPropsType = {
  phones: UserPhoneType[];
};

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
const UserAccountPhoneManagement: React.FunctionComponent<UserAccountPhoneManagementPropsType> =
  ({ phones }) => {
    // mui: makeStyles
    const classes = useStyles();

    // max size
    const maxSize = 3;

    // dispatch
    const dispatch = useDispatch();

    // auth
    const auth = useSelector(mSelector.makeAuthSelector());

    // snackbar notification
    // usage: 'enqueueSnackbar("message", { variant: "error" };
    //const { enqueueSnackbar } = useSnackbar();

    // temp user account state
    const [curUserAccountPhoneState, setUserAccountPhoneState] =
      React.useState<CustomerPhonesFormDataType>(
        generateDefaultCustomerPhonesFormData()
      );

    // validation logic (should move to hooks)
    const [
      curUserAccountPhoneValidationState,
      setUserAccountPhoneValidationState,
    ] = React.useState<CustomerPhonesFormValidationDataType>(
      defaultUserAccountValidationPhoneData
    );

    const { updateValidationAt, updateAllValidation, isValidSync } =
      useValidation({
        curDomain: curUserAccountPhoneState,
        curValidationDomain: curUserAccountPhoneValidationState,
        schema: userAccountPhoneSchema,
        setValidationDomain: setUserAccountPhoneValidationState,
        defaultValidationDomain: defaultUserAccountValidationPhoneData,
      });

    // event handlers
    const handlePhoneInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextPhoneNumber = e.target.value;
      updateValidationAt("phoneNumber", e.target.value);
      setUserAccountPhoneState((prev: CustomerPhonesFormDataType) => ({
        ...prev,
        phoneNumber: nextPhoneNumber,
      }));
    };

    const handleCountryCodeInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextCountryCode = e.target.value;
      updateValidationAt("countryCode", e.target.value);
      setUserAccountPhoneState((prev: CustomerPhonesFormDataType) => ({
        ...prev,
        countryCode: nextCountryCode,
      }));
    };

    // event handler to submit
    const handleUserAccountSaveClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = async (e) => {
      const isValid: boolean = isValidSync(curUserAccountPhoneState);

      log(isValid);

      if (isValid) {
        // pass
        log("passed");

        if (isNew) {
          log("this one is to create new one");

          dispatch(
            postAuthPhoneActionCreator({
              phoneNumber: curUserAccountPhoneState.phoneNumber,
              countryCode: curUserAccountPhoneState.countryCode,
              isSelected: curUserAccountPhoneState.isSelected,
              version: curUserAccountPhoneState.version,
            })
          );
        } else {
          log("this one is to update existing one");
          dispatch(
            putAuthPhoneActionCreator({
              phoneId: curUserAccountPhoneState.phoneId,
              phoneNumber: curUserAccountPhoneState.phoneNumber,
              countryCode: curUserAccountPhoneState.countryCode,
              isSelected: curUserAccountPhoneState.isSelected,
              version: curUserAccountPhoneState.version,
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
      setUserAccountPhoneState(generateDefaultCustomerPhonesFormData());
      setUserAccountPhoneValidationState(defaultUserAccountValidationPhoneData);
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
        deleteAuthPhoneActionCreator({
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
      const targetPhone = auth.user.phones.find((phone: UserPhoneType) => {
        return phone.phoneId == targetPhoneId;
      });

      setUserAccountPhoneState(targetPhone);
      setUserAccountPhoneValidationState(defaultUserAccountValidationPhoneData);
      setNew(false);
      setModalOpen(true);
    };

    // cur primary phone id
    const curPrimaryId = useSelector(
      mSelector.makeAuthSelectedPhoneIdSelector()
    );

    const handlePhonePrimaryChange: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextPrimePhoneId = e.currentTarget.value;

      dispatch(
        patchAuthPhoneActionCreator({
          phoneId: nextPrimePhoneId,
          version: findPhone(phones, nextPrimePhoneId).version,
        })
      );
    };

    // close form dialog only when success for post/put/delete
    const curPostFetchStatus = useSelector(
      rsSelector.app.getPostAuthPhoneFetchStatus
    );
    const curPutFetchStatus = useSelector(
      rsSelector.app.getPutAuthPhoneFetchStatus
    );
    const curDeleteSingleFetchStatus = useSelector(
      rsSelector.app.getDeleteAuthPhoneFetchStatus
    );
    React.useEffect(() => {
      if (
        curPostFetchStatus === FetchStatusEnum.SUCCESS ||
        curPutFetchStatus === FetchStatusEnum.SUCCESS ||
        curDeleteSingleFetchStatus === FetchStatusEnum.SUCCESS
      ) {
        setModalOpen(false);

        dispatch(postAuthPhoneFetchStatusActions.clear());
        dispatch(putAuthPhoneFetchStatusActions.clear());
        dispatch(deleteAuthPhoneFetchStatusActions.clear());
      }
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

    /**
     * avoid multiple click submission
     */
    const curDeleteFetchStatus = useSelector(
      rsSelector.app.getDeleteAuthPhoneFetchStatus
    );
    const { curDisableBtnStatus: curDisableDeleteBtnStatus } = useWaitResponse({
      fetchStatus: curDeleteFetchStatus,
    });
    // render functions

    // display current phone number list
    const renderCurPhoneListComponent: () => React.ReactNode = () => {
      return auth.user.phones.map((phone: UserPhoneType) => {
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
                disabled={curDisableDeleteBtnStatus}
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
          {auth.user.phones.length === 0 && (
            <Typography variant="body2" component="p" align="center">
              {"Oops. You Haven't Registered Any Phone Yet."}
            </Typography>
          )}
          {auth.user.phones.length > 0 && (
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
              value={curUserAccountPhoneState.phoneNumber}
              onChange={handlePhoneInputChangeEvent}
              helperText={curUserAccountPhoneValidationState.phoneNumber}
              error={curUserAccountPhoneValidationState.phoneNumber !== ""}
            />
            <TextField
              id="country-code"
              label="Country Code"
              disabled
              className={classes.formControl}
              value={curUserAccountPhoneState.countryCode}
              onChange={handleCountryCodeInputChangeEvent}
              helperText={curUserAccountPhoneValidationState.countryCode}
              error={curUserAccountPhoneValidationState.countryCode !== ""}
            />
            <Box component="div" className={classes.actionBox}>
              <Button onClick={handleModalCancelClickEvent} variant="contained">
                Cancel
              </Button>
              <Button
                onClick={handleUserAccountSaveClickEvent}
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

export default UserAccountPhoneManagement;
