import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { useValidation } from 'hooks/validation';
import { resetPasswordSchema } from 'hooks/validation/rules';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router';
import { messageActions } from 'reducers/slices/app';
import { getNanoId } from 'src/utils';
import { MessageTypeEnum } from 'src/app';
import { Link as RRLink } from "react-router-dom";

export declare type ResetPasswordDataType = {
  confirm: string
  password: string
}

const defaultResetPasswordData: ResetPasswordDataType = {
  confirm: "",
  password: "",
}

export declare type ResetPasswordValidationDataType = {
  confirm?: string
  password?: string
}

const defaultResetPasswordValidationData: ResetPasswordValidationDataType = {
  confirm: "",
  password: "",
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      maxWidth: 500,
      width: "80%",
      margin: "20px auto",
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(3)
    },
    form: {
      margin: theme.spacing(1),
      textAlign: "center",
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      width: "80%",
      margin: theme.spacing(2),
    },
    forgetPasswordBox: {
      margin: theme.spacing(1),
    },
    actionBox: {
      textAlign: "center",
      margin: theme.spacing(2, 0, 2, 0),
    },
    cursorLink: {
      cursor: "pointer",
    }
  }),
);

const ResetPassword: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const query = useQuery()

  const history = useHistory()

  // reset password token (get from forgotten password link
  const forgotPasswordToken = query.get("forgot-password-token")

  // dispatch
  const dispatch = useDispatch();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // temp user account state
  const [curResetPasswordState, setResetPasswordState] = React.useState<ResetPasswordDataType>(defaultResetPasswordData);

  // validation logic (should move to hooks)
  const [curResetPasswordValidationState, setResetPasswordValidationState] = React.useState<ResetPasswordValidationDataType>(defaultResetPasswordValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curResetPasswordState,
    curValidationDomain: curResetPasswordValidationState,
    schema: resetPasswordSchema,
    setValidationDomain: setResetPasswordValidationState,
    defaultValidationDomain: defaultResetPasswordValidationData,
  })

  // event handlers
  const handleConfirmInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextConfirm = e.currentTarget.value
    updateValidationAt("confirm", e.currentTarget.value);
    setResetPasswordState((prev: ResetPasswordDataType) => ({
      ...prev,
      confirm: nextConfirm
    }));
  }

  const handlePasswordInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPassword = e.currentTarget.value
    updateValidationAt("password", e.currentTarget.value);
    setResetPasswordState((prev: ResetPasswordDataType) => ({
      ...prev,
      password: nextPassword
    }));
  }

  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curResetPasswordState)

    if (isValid) {
      // pass 
      console.log("passed")
      // request
      api.request({
        method: 'POST',
        url: API1_URL + `/reset-password`,
        data: {
          password: curResetPasswordState.password,
          token: forgotPasswordToken,
        },
      }).then((data) => {

        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.SUCCESS,
            message: "password was successfully reset.",
          })
        )

        history.push("/")


      }).catch((error: AxiosError) => {
        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.ERROR,
            message: error.response.data.message, 
          })
        )
      })
    } else {
      updateAllValidation()
    }
  }

  return (
    <Grid
      container
      justify="center"
      direction="column"
      className={classes.box}
    >
      <IconButton edge="start" color="inherit" aria-label="login-logo">
        <SentimentSatisfiedOutlinedIcon />
      </IconButton>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Reset Password"}
      </Typography>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          id="password"
          label="Password"
          type="password"
          className={classes.formControl}
          value={curResetPasswordState.password}
          onChange={handlePasswordInputChangeEvent}
          helperText={curResetPasswordValidationState.password}
          error={curResetPasswordValidationState.password !== ""}
        />
        <TextField
          id="confirm"
          label="Confirm"
          type="password"
          className={classes.formControl}
          value={curResetPasswordState.confirm}
          onChange={handleConfirmInputChangeEvent}
          helperText={curResetPasswordValidationState.confirm}
          error={curResetPasswordValidationState.confirm !== ""}
        />
        <Box component="div" className={classes.actionBox}>
          <Button onClick={handleUserAccountSaveClickEvent} variant="contained">
            Reset Password
          </Button>
          <Button component={RRLink} to="/login" variant="contained">
            Send Reset Password Email Again
          </Button>
        </Box>
      </form>
    </Grid>
  )
}

export default ResetPassword



