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
import ForgotPasswordDialog from 'components/common/ForgotPasswordDialog';
import { api } from 'configs/axiosConfig';
import { UserType } from 'domain/user/types';
import { useValidation } from 'hooks/validation';
import { memberLoginSchema } from 'hooks/validation/rules';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from 'reducers/slices/app';
import { generateObjectFormData } from 'src/utils';

export declare type MemberLoginDataType = {
  email: string
  password: string
}

const defaultMemberLoginData: MemberLoginDataType = {
  email: "",
  password: "",
}

export declare type MemberLoginValidationDataType = {
  email?: string
  password?: string
}

const defaultMemberLoginValidationData: MemberLoginValidationDataType = {
  email: "",
  password: "",
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

const Login: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();
  
  // dispatch
  const dispatch = useDispatch();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // forgot password dialog
  const [curForgotPasswordDialogOpen, setForgotPasswordDialogOpen] = React.useState<boolean>(false);

  // redirect to original url after user login stuff.
  
  //const location = useLocation()
  // this might not need to implement since you can use history.back() after sucess login
  //const [curPrevUrl, setPrevUrl] = React.useState<string>("");


  // temp user account state
  const [curMemberLoginState, setMemberLoginState] = React.useState<MemberLoginDataType>(defaultMemberLoginData);

  // validation logic (should move to hooks)
  const [curMemberLoginValidationState, setMemberLoginValidationState] = React.useState<MemberLoginValidationDataType>(defaultMemberLoginValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curMemberLoginState,
    curValidationDomain: curMemberLoginValidationState,
    schema: memberLoginSchema,
    setValidationDomain: setMemberLoginValidationState
  })

  // redirect to original url after user login stuff.
  // - store if previous path exist
  // this might not need to implement since you can use history.back() after sucess login
  //React.useEffect(() => {
  //  if (location.state && (location.state as { from: { pathname: string }}).from.pathname) {
  //    console.log("previous path exist")
  //    const prevUrl = (location.state as { from: { pathname: string }}).from.pathname
  //    console.log(prevUrl)
  //    setPrevUrl(prevUrl);
  //  }
  //}, [])

  // event handlers
  const handleEmailInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextEmail = e.currentTarget.value
    updateValidationAt("email", e.currentTarget.value);
    setMemberLoginState((prev: MemberLoginDataType) => ({
      ...prev,
      email: nextEmail
    }));
  }

  const handlePasswordInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPassword = e.currentTarget.value
    updateValidationAt("password", e.currentTarget.value);
    setMemberLoginState((prev: MemberLoginDataType) => ({
      ...prev,
      password: nextPassword
    }));
  }

  // event handler for forgot password link click
  const handleForgotPasswordClick: React.EventHandler<React.MouseEvent<HTMLAnchorElement>> = (e) => {
    setForgotPasswordDialogOpen(true);
  }

  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curMemberLoginState)

    if (isValid) {
      // pass 
      console.log("passed")
      // request
      api.request({
        method: 'POST',
        url: API1_URL + `/authenticate`,
        data: curMemberLoginState,
        headers: {"Content-Type": "application/json"}
      }).then((data) => {
        /**
         * login success
         **/
        const loggedInUser: UserType = data.data;
        dispatch(authActions.loginWithUser(loggedInUser))

        // make sure this work.
        // this does not work esp when there is no previous url.
        //
        // solution: to use redux state to store the previous url.
        history.back(); 

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
        {"Login"}
      </Typography>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          id="email"
          label="Email"
          className={classes.formControl}
          value={curMemberLoginState.email}
          onChange={handleEmailInputChangeEvent}
          helperText={curMemberLoginValidationState.email}
          error={curMemberLoginValidationState.email !== ""}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          className={classes.formControl}
          value={curMemberLoginState.password}
          onChange={handlePasswordInputChangeEvent}
          helperText={curMemberLoginValidationState.password}
          error={curMemberLoginValidationState.password !== ""}
        />
        <Box component="div" className={classes.forgetPasswordBox} >
          <Typography variant="body2" component="p">
            <Link onClick={handleForgotPasswordClick} className={classes.cursorLink}>
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
      <ForgotPasswordDialog 
        curFormOpen={curForgotPasswordDialogOpen}  
        setFormOpen={setForgotPasswordDialogOpen}
      />
    </Grid>
  )
}

export default Login


