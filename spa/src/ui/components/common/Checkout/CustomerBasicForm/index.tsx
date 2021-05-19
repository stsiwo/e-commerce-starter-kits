import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useValidation } from 'hooks/validation';
import { userAccountSchema } from 'hooks/validation/rules';
import * as React from 'react';
import { UserType, UserBasicAccountDataType, defaultUserBasicAccountData, UserBasicAccountValidationDataType, defaultUserBasicAccountValidationData } from 'domain/user/types';
import { CheckoutStepComponentPropsType } from 'components/pages/Checkout/checkoutSteps';
import { api } from 'configs/axiosConfig';
import { useSelector, useDispatch } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { UserTypeEnum } from 'src/app';
import { useSnackbar } from 'notistack';
import { authActions } from 'reducers/slices/app';
import { AxiosError } from 'axios';

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
  }),
);

declare type CustomerBasicFormPropsType = {
  user?: UserType
} & CheckoutStepComponentPropsType

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
const CustomerBasicForm: React.FunctionComponent<CustomerBasicFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector());

  const dispatch = useDispatch();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // temp user account state
  const [curUserAccountState, setUserAccountState] = React.useState<UserBasicAccountDataType>(defaultUserBasicAccountData)

  // use effect to update user state if exists after render jsx
  React.useEffect(() => {

    if (props.user) {
      setUserAccountState((prev: UserBasicAccountDataType) => ({
        ...prev,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        email: props.user.email,
      }))
    }

  }, [])

  // validation logic (should move to hooks)
  const [curUserAccountValidationState, setUserAccountValidationState] = React.useState<UserBasicAccountValidationDataType>(defaultUserBasicAccountValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curUserAccountState,
    curValidationDomain: curUserAccountValidationState,
    schema: userAccountSchema,
    setValidationDomain: setUserAccountValidationState
  })

  // event handlers
  const handleFirstNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextFirstName = e.currentTarget.value
    updateValidationAt("firstName", e.currentTarget.value);
    setUserAccountState((prev: UserBasicAccountDataType) => ({
      ...prev,
      firstName: nextFirstName
    }));
  }

  const handleLastNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextLastName = e.currentTarget.value
    updateValidationAt("lastName", e.currentTarget.value);
    setUserAccountState((prev: UserBasicAccountDataType) => ({
      ...prev,
      lastName: nextLastName
    }));
  }

  const handleEmailInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextEmail = e.currentTarget.value
    updateValidationAt("email", e.currentTarget.value);
    setUserAccountState((prev: UserBasicAccountDataType) => ({
      ...prev,
      email: nextEmail
    }));
  }

  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curUserAccountState)
    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")

      if (auth.userType === UserTypeEnum.MEMBER) {
        // request
        api.request({
          method: 'POST',
          url: API1_URL + `/users/${auth.user.userId}`,
          data: curUserAccountState,
        }).then((data) => {

          /**
           * update auth state 
           **/
          const updatedUser = data.data;
          dispatch(authActions.update({
            ...auth,
            user: updatedUser,
          }));

          enqueueSnackbar("updated successfully.", { variant: "success" })

          props.goToNextStep()

        }).catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" })
        })
      } else if (auth.userType === UserTypeEnum.GUEST) {

        // if guest user, only update redux store for future reference.
        dispatch(authActions.update({
          ...auth,
          user: {
            ...auth.user,
            firstName: curUserAccountState.firstName,
            lastName: curUserAccountState.lastName,
            email: curUserAccountState.email,
          },
        }));

        props.goToNextStep()
      }

    } else {
      updateAllValidation()
    }
  }

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
        className={classes.formControl}
        value={curUserAccountState.email}
        onChange={handleEmailInputChangeEvent}
        helperText={curUserAccountValidationState.email}
        error={curUserAccountValidationState.email !== ""}
      />
      <Box component="div" className={classes.actionBox}>
        <Button onClick={handleUserAccountSaveClickEvent}>
          Confirm
        </Button>
      </Box>
    </form>
  )
}

export default CustomerBasicForm



