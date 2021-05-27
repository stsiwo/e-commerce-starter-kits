import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { defaultUserBasicAccountData, defaultUserBasicAccountValidationData, UserBasicAccountDataType, UserBasicAccountValidationDataType, UserType } from 'domain/user/types';
import { useValidation } from 'hooks/validation';
import { userAccountSchema } from 'hooks/validation/rules';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { putUserActionCreator } from 'reducers/slices/domain/user';
import { mSelector } from 'src/selectors/selector';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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
    actionBox: {
      textAlign: "center"
    },
  }),
);

declare type AdminCustomerBasicFormPropsType = {
  user?: UserType
}

/**
 * member or admin account form component
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
const AdminCustomerBasicForm: React.FunctionComponent<AdminCustomerBasicFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch();

  // temp user account state
  const [curAdminCustomerState, setAdminCustomerState] = React.useState<UserBasicAccountDataType>(defaultUserBasicAccountData)

  // use effect to update user state if exists after render jsx
  React.useEffect(() => {

    if (props.user) {
      setAdminCustomerState((prev: UserBasicAccountDataType) => ({
        ...prev,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        email: props.user.email,
      }))
    }

  }, [])

  // validation logic (should move to hooks)
  const [curAdminCustomerValidationState, setAdminCustomerValidationState] = React.useState<UserBasicAccountValidationDataType>(defaultUserBasicAccountValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curAdminCustomerState,
    curValidationDomain: curAdminCustomerValidationState,
    schema: userAccountSchema,
    setValidationDomain: setAdminCustomerValidationState,
    defaultValidationDomain: defaultUserBasicAccountValidationData,
  })

  // event handlers
  const handleFirstNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextFirstName = e.currentTarget.value
    updateValidationAt("firstName", e.currentTarget.value);
    setAdminCustomerState((prev: UserBasicAccountDataType) => ({
      ...prev,
      firstName: nextFirstName
    }));
  }

  const handleLastNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextLastName = e.currentTarget.value
    updateValidationAt("lastName", e.currentTarget.value);
    setAdminCustomerState((prev: UserBasicAccountDataType) => ({
      ...prev,
      lastName: nextLastName
    }));
  }

  const handleEmailInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextEmail = e.currentTarget.value
    updateValidationAt("email", e.currentTarget.value);
    setAdminCustomerState((prev: UserBasicAccountDataType) => ({
      ...prev,
      email: nextEmail
    }));
  }

  const handlePasswordInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPassword = e.currentTarget.value
    updateValidationAt("password", e.currentTarget.value);
    setAdminCustomerState((prev: UserBasicAccountDataType) => ({
      ...prev,
      password: nextPassword
    }));
  }

  const handleConfirmInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextConfirm = e.currentTarget.value
    updateValidationAt("confirm", e.currentTarget.value);
    setAdminCustomerState((prev: UserBasicAccountDataType) => ({
      ...prev,
      confirm: nextConfirm
    }));
  }


  // event handler to submit
  const handleAdminCustomerSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curAdminCustomerState)
    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")

      dispatch(
        putUserActionCreator({
          userId: props.user.userId,
          firstName: curAdminCustomerState.firstName,
          lastName: curAdminCustomerState.lastName,
          email: curAdminCustomerState.email,
          ...(curAdminCustomerState.password ? { password: curAdminCustomerState.password } : {}),
        })
      );

    } else {
      updateAllValidation()
    }
  }

  // handle password show stuff
  const [isPasswordShow, setPasswordShow] = React.useState<boolean>(false);
  const handleClickShowPassword = (e: React.MouseEvent<HTMLElement>) => {
    setPasswordShow((prev: boolean) => !prev);
  }
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLElement>) => {
    setPasswordShow((prev: boolean) => !prev);
  }

  const [isConfirmShow, setConfirmShow] = React.useState<boolean>(false);
  const handleClickShowConfirm = (e: React.MouseEvent<HTMLElement>) => {
    setConfirmShow((prev: boolean) => !prev);
  }
  const handleMouseDownConfirm = (e: React.MouseEvent<HTMLElement>) => {
    setConfirmShow((prev: boolean) => !prev);
  }

  return (
    <React.Fragment>
      <Typography variant="h6" component="h6" align="center" className={classes.title} >
        {"Basic"}
      </Typography>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          id="first-name"
          label="First Name"
          className={classes.formControl}
          value={curAdminCustomerState.firstName}
          onChange={handleFirstNameInputChangeEvent}
          helperText={curAdminCustomerValidationState.firstName}
          error={curAdminCustomerValidationState.firstName !== ""}

        />
        <TextField
          id="last-name"
          label="Last Name"
          className={classes.formControl}
          value={curAdminCustomerState.lastName}
          onChange={handleLastNameInputChangeEvent}
          helperText={curAdminCustomerValidationState.lastName}
          error={curAdminCustomerValidationState.lastName !== ""}
        />
        <TextField
          id="email"
          label="Email"
          className={classes.formControl}
          value={curAdminCustomerState.email}
          onChange={handleEmailInputChangeEvent}
          helperText={curAdminCustomerValidationState.email}
          error={curAdminCustomerValidationState.email !== ""}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          className={classes.formControl}
          value={curAdminCustomerState.password}
          onChange={handlePasswordInputChangeEvent}
          helperText={curAdminCustomerValidationState.password}
          error={curAdminCustomerValidationState.password !== ""}
          // not working. endAdorment TODO: fix this
          inputProps={{
            endadornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {isPasswordShow ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          id="confirm"
          label="Confirm"
          type="password"
          className={classes.formControl}
          value={curAdminCustomerState.confirm}
          onChange={handleConfirmInputChangeEvent}
          helperText={curAdminCustomerValidationState.confirm}
          error={curAdminCustomerValidationState.confirm !== ""}
          // not working. endAdorment TODO: fix this
          inputProps={{
            endadornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm visibility"
                  onClick={handleClickShowConfirm}
                  onMouseDown={handleMouseDownConfirm}
                >
                  {isConfirmShow ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Box component="div" className={classes.actionBox}>
          <Button onClick={handleAdminCustomerSaveClickEvent}>
            Save
        </Button>
        </Box>
      </form>
    </React.Fragment>
  )
}

export default AdminCustomerBasicForm



