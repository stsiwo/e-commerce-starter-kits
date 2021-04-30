import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import * as React from 'react';
import { Link as RRLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useValidation } from 'hooks/validation';
import { memberLoginSchema } from 'hooks/validation/rules';

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
  }),
);

const Login: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

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

  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curMemberLoginState)

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
            <Link href="/member/forget-password" component={props => <RRLink {...props} to="/" />}>
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

export default Login

