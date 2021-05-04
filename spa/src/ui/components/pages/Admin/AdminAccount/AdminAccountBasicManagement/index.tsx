import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { useValidation } from 'hooks/validation';
import { userAccountSchema } from 'hooks/validation/rules';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from 'reducers/slices/app';
import { mSelector } from 'src/selectors/selector';

export declare type UserAccountDataType = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirm: string
}

export declare type UserAccountValidationDataType = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirm?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
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
      textAlign: "center"
    },
  }),
);

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
const AdminAccountBasicManagement: React.FunctionComponent<{}> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch()

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // temp user account state
  const [curUserAccountState, setUserAccountState] = React.useState<UserAccountDataType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  // validation logic (should move to hooks)
  const [curUserAccountValidationState, setUserAccountValidationState] = React.useState<UserAccountValidationDataType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

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
    setUserAccountState((prev: UserAccountDataType) => ({
      ...prev,
      firstName: nextFirstName
    }));

  }

  const handleLastNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextLastName = e.currentTarget.value
    updateValidationAt("lastName", e.currentTarget.value);
    setUserAccountState((prev: UserAccountDataType) => ({
      ...prev,
      lastName: nextLastName
    }));
  }

  const handleEmailInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextEmail = e.currentTarget.value
    updateValidationAt("email", e.currentTarget.value);
    setUserAccountState((prev: UserAccountDataType) => ({
      ...prev,
      email: nextEmail
    }));
  }

  const handlePasswordInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPassword = e.currentTarget.value
    updateValidationAt("password", e.currentTarget.value);
    setUserAccountState((prev: UserAccountDataType) => ({
      ...prev,
      password: nextPassword
    }));
  }

  const handleConfirmInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextConfirm = e.currentTarget.value
    updateValidationAt("confirm", e.currentTarget.value);
    setUserAccountState((prev: UserAccountDataType) => ({
      ...prev,
      confirm: nextConfirm
    }));
  }


  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curUserAccountState)

    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")
      
      // request
      api.request({
        method: 'POST',
        url: API1_URL + `/users/${auth.user.userId}`,
        data: JSON.stringify(curUserAccountState),
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
      }).catch((error: AxiosError) => {
        enqueueSnackbar(error.message, { variant: "error" })
      })
    } else {
      updateAllValidation()
    }
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        titleTypographyProps={{
          variant: 'h6', 
        }}
        subheaderTypographyProps={{
          variant: 'body1' 
        }}
        title="Basic Info"
      />
      <CardContent>
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
      </form>
      </CardContent>
      <CardActions disableSpacing>
        <Button onClick={handleUserAccountSaveClickEvent}>
          Save
        </Button>
      </CardActions>
    </Card>
  )
}

export default AdminAccountBasicManagement



