import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { UserType } from 'domain/user/types';
import { useValidation } from 'hooks/validation';
import { adminLoginSchema } from 'hooks/validation/rules';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RRLink } from "react-router-dom";
import { authActions } from 'reducers/slices/app';
import { mSelector } from 'src/selectors/selector';
import { useHistory } from 'react-router';


export declare type AdminLoginDataType = {
  email: string
  password: string
}

const defaultAdminLoginData: AdminLoginDataType = {
  email: "",
  password: "",
}

if (NODE_ENV !== "production") {
  defaultAdminLoginData.email = "test_admin@test.com"
  defaultAdminLoginData.password = "test_password"
}

export declare type AdminLoginValidationDataType = {
  email?: string
  password?: string
}

const defaultAdminLoginValidationData: AdminLoginValidationDataType = {
  email: "",
  password: "",
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      maxWidth: 300,
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
    },
    forgetPasswordBox: {
      margin: theme.spacing(1),
    },
    actionBox: {
      textAlign: "center",
      margin: theme.spacing(2, 0, 2, 0),
    },
  }),
);

/**
 * admin login page 
 *
 **/
const AdminLogin: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();
  
  // dispatch
  const dispatch = useDispatch();
  
  // redirect to previous url if exist
  const curPreviousUrl = useSelector(mSelector.makePreviousUrlSelector());

  // history 
  const history = useHistory();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // temp user account state
  const [curAdminLoginState, setAdminLoginState] = React.useState<AdminLoginDataType>(defaultAdminLoginData);

  // validation logic (should move to hooks)
  const [curAdminLoginValidationState, setAdminLoginValidationState] = React.useState<AdminLoginValidationDataType>(defaultAdminLoginValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curAdminLoginState,
    curValidationDomain: curAdminLoginValidationState,
    schema: adminLoginSchema,
    setValidationDomain: setAdminLoginValidationState
  })

  // event handlers
  const handleEmailInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextEmail = e.currentTarget.value
    updateValidationAt("email", e.currentTarget.value);
    setAdminLoginState((prev: AdminLoginDataType) => ({
      ...prev,
      email: nextEmail
    }));
  }

  const handlePasswordInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPassword = e.currentTarget.value
    updateValidationAt("password", e.currentTarget.value);
    setAdminLoginState((prev: AdminLoginDataType) => ({
      ...prev,
      password: nextPassword
    }));
  }

  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curAdminLoginState)

    if (isValid) {
      // pass 
      console.log("passed")
      // request
      api.request({
        method: 'POST',
        url: API1_URL + `/authenticate`,
        data: curAdminLoginState,
      }).then((data) => {
        /**
         *  add new phone
         **/
        const loggedInUser: UserType = data.data.user;
        dispatch(authActions.loginWithUser(loggedInUser))
        
        // make sure this work.
        // this does not work esp when there is no previous url.
        //
        // solution: to use redux state to store the previous url.
        //history.back(); 
        
        let nextDest = "/admin"
        
        if (curPreviousUrl) {
          nextDest = curPreviousUrl
        }

        /**
         * don't confused with 'history' (window) and 'history' (react-router-dom)
         *
         * window: history.pushState()
         *
         * react-router-dom: history.push() <- use this one.
         *
         **/
        history.push(nextDest);

        enqueueSnackbar("added successfully.", { variant: "success" })
      }).catch((error: AxiosError) => {
        enqueueSnackbar(error.message, { variant: "error" })
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
        {"Admin Login"}
      </Typography>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          id="email"
          label="Email"
          className={classes.formControl}
          value={curAdminLoginState.email}
          onChange={handleEmailInputChangeEvent}
          helperText={curAdminLoginValidationState.email}
          error={curAdminLoginValidationState.email !== ""}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          className={classes.formControl}
          value={curAdminLoginState.password}
          onChange={handlePasswordInputChangeEvent}
          helperText={curAdminLoginValidationState.password}
          error={curAdminLoginValidationState.password !== ""}
        />
        <Box component="div" className={classes.forgetPasswordBox} >
          <Typography variant="body2" component="p">
            <Link component={RRLink} to="/admin/forget-password">
              forget your password?
            </Link>
          </Typography>
        </Box>
        <Box component="div" className={classes.actionBox}>
          <Button onClick={handleUserAccountSaveClickEvent}>
            Login
            </Button>
        </Box>
      </form>
    </Grid>
  )
}

export default AdminLogin


