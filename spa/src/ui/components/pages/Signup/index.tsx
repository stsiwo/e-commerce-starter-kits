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
import { memberSignupSchema } from 'hooks/validation/rules';
import { api } from 'configs/axiosConfig';
import { useDispatch } from 'react-redux';
import { UserType } from 'domain/user/types';
import { authActions, messageActions } from 'reducers/slices/app';
import { AxiosError } from 'axios';
import omit from 'lodash/omit';
import { useHistory } from 'react-router';
import { getNanoId } from 'src/utils';
import { MessageTypeEnum } from 'src/app';

export declare type MemberSignupDataType = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirm: string
}

const defaultMemberSignupData: MemberSignupDataType = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm: "",
}

export declare type MemberSignupValidationDataType = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirm?: string
}

const defaultMemberSignupValidationData: MemberSignupValidationDataType = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm: "",
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

const Signup: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  // dispatch
  const dispatch = useDispatch();

  // history
  const history = useHistory();

  // temp user account state
  const [curMemberSignupState, setMemberSignupState] = React.useState<MemberSignupDataType>(defaultMemberSignupData);

  // validation logic (should move to hooks)
  const [curMemberSignupValidationState, setMemberSignupValidationState] = React.useState<MemberSignupValidationDataType>(defaultMemberSignupValidationData);

  const { updateValidationAt, updateAllValidation, updateValidationAtMultiple, isValidSync } = useValidation({
    curDomain: curMemberSignupState,
    curValidationDomain: curMemberSignupValidationState,
    schema: memberSignupSchema,
    setValidationDomain: setMemberSignupValidationState,
    defaultValidationDomain: defaultMemberSignupValidationData,
  })

  // event handlers
  const handleFirstNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextFirstName = e.currentTarget.value
    updateValidationAt("firstName", e.currentTarget.value);
    setMemberSignupState((prev: MemberSignupDataType) => ({
      ...prev,
      firstName: nextFirstName
    }));
  }

  const handleLastNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextLastName = e.currentTarget.value
    updateValidationAt("lastName", e.currentTarget.value);
    setMemberSignupState((prev: MemberSignupDataType) => ({
      ...prev,
      lastName: nextLastName
    }));
  }

  const handleEmailInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextEmail = e.currentTarget.value
    updateValidationAt("email", e.currentTarget.value);
    setMemberSignupState((prev: MemberSignupDataType) => ({
      ...prev,
      email: nextEmail
    }));
  }

  const handlePasswordInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPassword = e.currentTarget.value
    setMemberSignupState((prev: MemberSignupDataType) => ({
      ...prev,
      password: nextPassword
    }));
  }

  const handleConfirmInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextConfirm = e.currentTarget.value
    setMemberSignupState((prev: MemberSignupDataType) => ({
      ...prev,
      confirm: nextConfirm
    }));
  }

  /**
   * validation for multiple fields together
   **/
  const isInitial = React.useRef<boolean>(true)
  React.useEffect(() => {

    if (!isInitial.current) {
      updateValidationAtMultiple([
        {
          key: "password",
          value: curMemberSignupState.password
        },
        {
          key: "confirm",
          value: curMemberSignupState.confirm
        },
      ])
    }
      isInitial.current = false;
  }, [
      curMemberSignupState.password,
      curMemberSignupState.confirm
    ])

  const submit = () => {
    const isValid: boolean = isValidSync(curMemberSignupState)

    if (isValid) {
      // pass 
      console.log("passed")
      // request
      api.request({
        method: 'POST',
        url: API1_URL + `/signup`,
        data: omit(curMemberSignupState, "confirm"),
      }).then((data) => {
        console.log("signup success response");
        console.log(data)
        console.log(data.data.user)
        /**
         *  add new phone
         **/
        const loggedInUser: UserType = data.data.user;
        dispatch(authActions.loginWithUser(loggedInUser))

        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.SUCCESS,
            message: "thank you for signing up.",
          })
        )

        // move to email verification page
        history.push("/email-verification")

      }).catch((error: AxiosError) => {
        /**
         * update message
         **/
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

  // 'enter' global to submit by 'enter'
  React.useEffect(() => {

    window.addEventListener('keydown', handleSubmitKeyDown as unknown as EventListener);

    return () => {
      window.removeEventListener('keydown', handleSubmitKeyDown as unknown as EventListener);
    }
  }, [
      JSON.stringify(curMemberSignupState),
    ]);

  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    submit()
  }

  // key down to submit 
  const handleSubmitKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      submit();
    }
  }

  return (
    <Grid
      container
      justify="center"
      direction="column"
      className={classes.box}
    >
      <IconButton edge="start" color="inherit" aria-label="signup-logo">
        <SentimentSatisfiedOutlinedIcon />
      </IconButton>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Signup"}
      </Typography>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          id="first-name"
          label="First Name"
          className={classes.formControl}
          value={curMemberSignupState.firstName}
          onChange={handleFirstNameInputChangeEvent}
          helperText={curMemberSignupValidationState.firstName}
          error={curMemberSignupValidationState.firstName !== ""}

        />
        <TextField
          id="last-name"
          label="Last Name"
          className={classes.formControl}
          value={curMemberSignupState.lastName}
          onChange={handleLastNameInputChangeEvent}
          helperText={curMemberSignupValidationState.lastName}
          error={curMemberSignupValidationState.lastName !== ""}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          className={classes.formControl}
          value={curMemberSignupState.email}
          onChange={handleEmailInputChangeEvent}
          helperText={curMemberSignupValidationState.email}
          error={curMemberSignupValidationState.email !== ""}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          className={classes.formControl}
          value={curMemberSignupState.password}
          onChange={handlePasswordInputChangeEvent}
          helperText={curMemberSignupValidationState.password}
          error={curMemberSignupValidationState.password !== ""}
        />
        <TextField
          id="confirm"
          label="Confirm"
          type="password"
          className={classes.formControl}
          value={curMemberSignupState.confirm}
          onChange={handleConfirmInputChangeEvent}
          helperText={curMemberSignupValidationState.confirm}
          error={curMemberSignupValidationState.confirm !== ""}
        />
        <Box component="div" className={classes.forgetPasswordBox} >
          <Typography variant="body2" component="p">
            <Link component={RRLink} to="/login">
              already have an account?
            </Link>
          </Typography>
        </Box>
        <Box component="div" className={classes.actionBox}>
          <Button onKeyDown={handleSubmitKeyDown} onClick={handleUserAccountSaveClickEvent} variant="contained">
            Signup
          </Button>
        </Box>
      </form>
    </Grid>
  )
}

export default Signup



