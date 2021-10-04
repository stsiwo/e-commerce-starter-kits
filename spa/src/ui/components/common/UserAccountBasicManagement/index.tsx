import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { logger } from "configs/logger";
import {
  defaultUserBasicAccountData,
  defaultUserBasicAccountValidationData,
  UserBasicAccountDataType,
  UserBasicAccountValidationDataType,
  UserType,
} from "domain/user/types";
import { useValidation } from "hooks/validation";
import { userAccountSchema } from "hooks/validation/rules";
import { useWaitResponse } from "hooks/waitResponse";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { putAuthActionCreator } from "reducers/slices/app";
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
    actionBox: {
      textAlign: "center",
    },
  })
);

declare type UserAccountBasicManagementPropsType = {
  user?: UserType;
};

/**
 * member or admin account management component
 *
 * process:
 *
 *    - 1. request to grab information about this user
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
const UserAccountBasicManagement: React.FunctionComponent<UserAccountBasicManagementPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    // auth
    const auth = useSelector(mSelector.makeAuthSelector());

    const dispatch = useDispatch();

    // snackbar notification
    // usage: 'enqueueSnackbar("message", { variant: "error" };
    //const { enqueueSnackbar } = useSnackbar();

    // temp user account state
    const [curUserAccountState, setUserAccountState] =
      React.useState<UserBasicAccountDataType>(defaultUserBasicAccountData);

    // use effect to update user state if exists after render jsx
    React.useEffect(() => {
      if (props.user) {
        setUserAccountState((prev: UserBasicAccountDataType) => ({
          ...prev,
          firstName: props.user.firstName,
          lastName: props.user.lastName,
          email: props.user.email,
          version: props.user.version,
        }));
      }
    }, [JSON.stringify(props.user)]);

    // validation logic (should move to hooks)
    const [curUserAccountValidationState, setUserAccountValidationState] =
      React.useState<UserBasicAccountValidationDataType>(
        defaultUserBasicAccountValidationData
      );

    const {
      updateValidationAt,
      updateAllValidation,
      updateValidationAtMultiple,
      isValidSync,
    } = useValidation({
      curDomain: curUserAccountState,
      curValidationDomain: curUserAccountValidationState,
      schema: userAccountSchema,
      setValidationDomain: setUserAccountValidationState,
      defaultValidationDomain: defaultUserBasicAccountValidationData,
    });

    // event handlers
    const handleFirstNameInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextFirstName = e.currentTarget.value;
      updateValidationAt("firstName", e.currentTarget.value);
      setUserAccountState((prev: UserBasicAccountDataType) => ({
        ...prev,
        firstName: nextFirstName,
      }));
    };

    const handleLastNameInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextLastName = e.currentTarget.value;
      updateValidationAt("lastName", e.currentTarget.value);
      setUserAccountState((prev: UserBasicAccountDataType) => ({
        ...prev,
        lastName: nextLastName,
      }));
    };

    const handleEmailInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextEmail = e.currentTarget.value;
      updateValidationAt("email", e.currentTarget.value);
      setUserAccountState((prev: UserBasicAccountDataType) => ({
        ...prev,
        email: nextEmail,
      }));
    };

    const handlePasswordInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextPassword = e.currentTarget.value;
      setUserAccountState((prev: UserBasicAccountDataType) => ({
        ...prev,
        password: nextPassword,
      }));
    };

    const handleConfirmInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextConfirm = e.currentTarget.value;
      setUserAccountState((prev: UserBasicAccountDataType) => ({
        ...prev,
        confirm: nextConfirm,
      }));
    };

    /**
     * validation for multiple fields together
     **/
    const isInitial = React.useRef<boolean>(true);
    React.useEffect(() => {
      if (!isInitial.current) {
        updateValidationAtMultiple([
          {
            key: "password",
            value: curUserAccountState.password,
          },
          {
            key: "confirm",
            value: curUserAccountState.confirm,
          },
        ]);
      }
      isInitial.current = false;
    }, [curUserAccountState.password, curUserAccountState.confirm]);

    // event handler to submit
    const handleUserAccountSaveClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = async (e) => {
      const isValid: boolean = isValidSync(curUserAccountState);
      log(isValid);

      if (isValid) {
        // pass
        log("passed");

        dispatch(
          putAuthActionCreator({
            userId: auth.user.userId,
            firstName: curUserAccountState.firstName,
            lastName: curUserAccountState.lastName,
            email: curUserAccountState.email,
            ...(curUserAccountState.password
              ? { password: curUserAccountState.password }
              : {}),
            version: curUserAccountState.version,
          })
        );

        setUserAccountState((prev: UserBasicAccountDataType) => {
          return {
            ...prev,
            password: "",
            confirm: "",
          };
        });
      } else {
        updateAllValidation();
      }
    };

    /**
     * avoid multiple click submission
     */
    // delete
    const curPutFetchStatus = useSelector(rsSelector.app.getPutAuthFetchStatus);
    const { curDisableBtnStatus: curDisablePutBtnStatus } = useWaitResponse({
      fetchStatus: curPutFetchStatus,
    });

    return (
      <React.Fragment>
        <Typography
          variant="h6"
          component="h6"
          align="center"
          className={classes.title}
        >
          {"Basic"}
        </Typography>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            id="first-name"
            label="First Name"
            className={classes.formControl}
            value={curUserAccountState.firstName}
            onChange={handleFirstNameInputChangeEvent}
            helperText={curUserAccountValidationState.firstName}
            error={curUserAccountValidationState.firstName !== ""}
          />
          <TextField
            id="last-name"
            label="Last Name"
            className={classes.formControl}
            value={curUserAccountState.lastName}
            onChange={handleLastNameInputChangeEvent}
            helperText={curUserAccountValidationState.lastName}
            error={curUserAccountValidationState.lastName !== ""}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            className={classes.formControl}
            value={curUserAccountState.email}
            onChange={handleEmailInputChangeEvent}
            helperText={curUserAccountValidationState.email}
            error={curUserAccountValidationState.email !== ""}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            className={classes.formControl}
            value={curUserAccountState.password}
            onChange={handlePasswordInputChangeEvent}
            helperText={curUserAccountValidationState.password}
            error={curUserAccountValidationState.password !== ""}
          />
          <TextField
            id="confirm"
            label="Confirm"
            type="password"
            className={classes.formControl}
            value={curUserAccountState.confirm}
            onChange={handleConfirmInputChangeEvent}
            helperText={curUserAccountValidationState.confirm}
            error={curUserAccountValidationState.confirm !== ""}
          />
          <Box component="div" className={classes.actionBox}>
            <Button
              onClick={handleUserAccountSaveClickEvent}
              variant="contained"
              disabled={curDisablePutBtnStatus}
            >
              Save
            </Button>
          </Box>
        </form>
      </React.Fragment>
    );
  };

export default UserAccountBasicManagement;
