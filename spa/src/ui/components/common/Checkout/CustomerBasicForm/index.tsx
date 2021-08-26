import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { CheckoutStepComponentPropsType } from "components/pages/Checkout/checkoutSteps";
import {
  defaultUserBasicAccountData,
  defaultUserBasicAccountValidationData,
  UserBasicAccountDataType,
  UserBasicAccountValidationDataType,
  UserType,
} from "domain/user/types";
import { useValidation } from "hooks/validation";
import { userAccountSchema } from "hooks/validation/rules";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { putAuthActionCreator } from "reducers/slices/app";
import { putAuthFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { FetchStatusEnum, UserTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(__filename);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      margin: theme.spacing(1),
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      display: "inline-block",
      maxWidth: 300,
      marginRight: theme.spacing(2),
    },
    actionBox: {
      textAlign: "right",
      margin: `${theme.spacing(2)}px 0`,
    },
  })
);

declare type CustomerBasicFormPropsType = {
  user?: UserType;
} & CheckoutStepComponentPropsType;

/**
 * checkout: customer information (basic) component
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
const CustomerBasicForm: React.FunctionComponent<CustomerBasicFormPropsType> = (
  props
) => {
  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector());

  const dispatch = useDispatch();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

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
      }));
    }
  }, []);

  // validation logic (should move to hooks)
  const [curUserAccountValidationState, setUserAccountValidationState] =
    React.useState<UserBasicAccountValidationDataType>(
      defaultUserBasicAccountValidationData
    );

  const { updateValidationAt, updateAllValidation, isValidSync } =
    useValidation({
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
        })
      );

      if (auth.userType === UserTypeEnum.GUEST) {
        props.goToNextStep();
      }
    } else {
      updateAllValidation();
    }
  };

  // if member, we need to make sure the request (update) succeeded or not. if yes, they can go next.
  const curPutAuthFetchStatus = useSelector(
    rsSelector.app.getPutAuthFetchStatus
  );
  React.useEffect(() => {
    if (curPutAuthFetchStatus === FetchStatusEnum.SUCCESS) {
      props.goToNextStep();
    }

    return () => {
      // reset fetch status in the case where the other component needs this.
      dispatch(putAuthFetchStatusActions.clear());
    };
  }, [curPutAuthFetchStatus]);

  return (
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
      <Box component="div" className={classes.actionBox}>
        <Button onClick={handleUserAccountSaveClickEvent} variant="contained">
          Confirm
        </Button>
      </Box>
    </form>
  );
};

export default CustomerBasicForm;
