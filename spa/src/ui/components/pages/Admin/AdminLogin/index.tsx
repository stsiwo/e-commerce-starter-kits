import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useValidation } from 'hooks/validation';
import { adminLoginSchema } from 'hooks/validation/rules';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Link as RRLink } from "react-router-dom";


export declare type AdminLoginDataType = {
  email: string
  password: string
}

const defaultAdminLoginData: AdminLoginDataType = {
  email: "",
  password: "",
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
      /**
       * TODO:
       * POST /authenticates
       **/

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


