import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Tooltip from "@material-ui/core/Tooltip";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Modal from "@material-ui/core/Modal";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import {
  CustomerPhonesFormDataType,
  CustomerPhonesFormValidationDataType,
  defaultUserAccountValidationPhoneData,
  generateDefaultCustomerPhonesFormData,
  UserPhoneType,
} from "domain/user/types";
import { useValidation } from "hooks/validation";
import { userAccountPhoneSchema } from "hooks/validation/rules";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAuthPhoneActionCreator,
  patchAuthPhoneActionCreator,
  postAuthPhoneActionCreator,
  putAuthPhoneActionCreator,
} from "reducers/slices/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import IconButton from "@material-ui/core/IconButton";
import { FetchStatusEnum } from "src/app";
import {
  postAuthPhoneFetchStatusActions,
  putAuthPhoneFetchStatusActions,
  deleteAuthPhoneFetchStatusActions,
} from "reducers/slices/app/fetchStatus/auth";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

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

export declare type CustomerPhonesFormPropsType = {
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
const CustomerPhonesForm: React.FunctionComponent<CustomerPhonesFormPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    // max size
    const maxSize = 3;

    // auth
    const auth = useSelector(mSelector.makeAuthSelector());

    // cur selected phone
    const curPrimaryPhone = useSelector(
      mSelector.makeAuthSelectedPhoneSelector()
    );

    // dispatch
    const dispatch = useDispatch();

    // temp user account state
    const [curCustomerPhonesFormState, setCustomerPhonesFormState] =
      React.useState<CustomerPhonesFormDataType>(
        generateDefaultCustomerPhonesFormData()
      );

    // update/create logic for address
    //  - true: create
    //  - false: update
    const [isNew, setNew] = React.useState<boolean>(true);

    // validation logic (should move to hooks)
    const [
      curCustomerPhonesFormValidationState,
      setCustomerPhonesFormValidationState,
    ] = React.useState<CustomerPhonesFormValidationDataType>(
      defaultUserAccountValidationPhoneData
    );

    const { updateValidationAt, updateAllValidation, isValidSync } =
      useValidation({
        curDomain: curCustomerPhonesFormState,
        curValidationDomain: curCustomerPhonesFormValidationState,
        schema: userAccountPhoneSchema,
        setValidationDomain: setCustomerPhonesFormValidationState,
        defaultValidationDomain: defaultUserAccountValidationPhoneData,
      });

    // event handlers
    const handlePhoneNumberInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextPhoneNumber = e.target.value;
      updateValidationAt("phoneNumber", e.target.value);
      setCustomerPhonesFormState((prev: CustomerPhonesFormDataType) => ({
        ...prev,
        phoneNumber: nextPhoneNumber,
      }));
    };

    const handleCountryCodeInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextCountryCode = e.target.value;
      updateValidationAt("countryCode", e.target.value);
      setCustomerPhonesFormState((prev: CustomerPhonesFormDataType) => ({
        ...prev,
        countryCode: nextCountryCode,
      }));
    };

    // event handler to submit
    const handleUserAccountSaveClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = async (e) => {
      const isValid: boolean = isValidSync(curCustomerPhonesFormState);
      log(isValid);
      if (isValid) {
        // pass
        log("passed");
        if (isNew) {
          log("this one is to create new one");
          dispatch(postAuthPhoneActionCreator(curCustomerPhonesFormState));
          setModalOpen(false);
        } else {
          log("this one is to update one");
          dispatch(putAuthPhoneActionCreator(curCustomerPhonesFormState));
          setModalOpen(false);
        }
      } else {
        updateAllValidation();
      }
    };

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
      setCustomerPhonesFormState(generateDefaultCustomerPhonesFormData());
      setCustomerPhonesFormValidationState(
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
        deleteAuthPhoneActionCreator({
          phoneId: phoneId,
        })
      );
    };

    // event handler to click an phone list item to update phone
    const handlePhoneItemClickEvent: React.EventHandler<
      React.MouseEvent<HTMLElement>
    > = (e) => {
      const targetPhoneId: string =
        e.currentTarget.getAttribute("data-phone-id");
      const targetPhone = props.phones.find((phone: UserPhoneType) => {
        return phone.phoneId == targetPhoneId;
      });

      setCustomerPhonesFormState(targetPhone);
      setCustomerPhonesFormValidationState(
        defaultUserAccountValidationPhoneData
      );
      setNew(false);
      setModalOpen(true);
    };

    // primary phone change event handler (radio)
    const onPrimaryPhoneChange: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const targetPhoneId: string = e.currentTarget.value;

      dispatch(
        patchAuthPhoneActionCreator({
          phoneId: targetPhoneId,
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
    // render functions

    // display current phone number list
    const renderCurPrimaryPhoneListComponent: () => React.ReactNode = () => {
      return props.phones.map((phone: UserPhoneType) => {
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
        <Box component="div">
          {props.phones.length === 0 && (
            <Typography variant="body2" component="p" align="center">
              {"Oops. You Haven't Added Any Phone Yet."}
            </Typography>
          )}
          {props.phones.length > 0 && (
            <RadioGroup
              value={curPrimaryPhone ? curPrimaryPhone.phoneId : null}
              aria-label="phone"
              name="user-phone-radio"
              onChange={onPrimaryPhoneChange}
            >
              <List className={classes.listBox}>
                {renderCurPrimaryPhoneListComponent()}
              </List>
            </RadioGroup>
          )}
          <Box component="div" className={classes.actionBox}>
            <Button
              onClick={handleAddNewPhoneBtnClickEvent}
              disabled={props.phones.length === maxSize}
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
              id="phone"
              label="Phone"
              className={classes.formControl}
              value={curCustomerPhonesFormState.phoneNumber}
              onChange={handlePhoneNumberInputChangeEvent}
              helperText={curCustomerPhonesFormValidationState.phoneNumber}
              error={curCustomerPhonesFormValidationState.phoneNumber !== ""}
            />
            <TextField
              id="country-code"
              label="Country Code"
              disabled
              className={classes.formControl}
              value={curCustomerPhonesFormState.countryCode}
              onChange={handleCountryCodeInputChangeEvent}
              helperText={curCustomerPhonesFormValidationState.countryCode}
              error={curCustomerPhonesFormValidationState.countryCode !== ""}
            />
            <Box component="div" className={classes.actionBox}>
              <Button onClick={handleModalCancelClickEvent} variant="contained">
                Cancel
              </Button>
              <Button
                onClick={handleUserAccountSaveClickEvent}
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

export default CustomerPhonesForm;
