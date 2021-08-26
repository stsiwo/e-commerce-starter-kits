import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import { AxiosError } from "axios";
import ForgotPasswordDialog from "components/common/ForgotPasswordDialog";
import { api } from "configs/axiosConfig";
import { UserType } from "domain/user/types";
import { useValidation } from "hooks/validation";
import { memberLoginSchema } from "hooks/validation/rules";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authActions, messageActions } from "reducers/slices/app";
import { MessageTypeEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import { logger } from "configs/logger";
const log = logger(__filename);

export declare type MemberLoginDataType = {
  email: string;
  password: string;
};

const defaultMemberLoginData: MemberLoginDataType = {
  email: "",
  password: "",
};

if (NODE_ENV !== "production") {
  defaultMemberLoginData.email = "test_member1@test.com";
  defaultMemberLoginData.password = "test_PASSWORD";
}

export declare type MemberLoginValidationDataType = {
  email?: string;
  password?: string;
};

const defaultMemberLoginValidationData: MemberLoginValidationDataType = {
  email: "",
  password: "",
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      maxWidth: 500,
      width: "80%",
      margin: "20px auto",
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(3),
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
    },
  })
);

const Login: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  // dispatch
  const dispatch = useDispatch();

  // history
  const history = useHistory();

  // redirect to previous url if exist
  const curPreviousUrl = useSelector(mSelector.makePreviousUrlSelector());

  // forgot password dialog
  const [curForgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    React.useState<boolean>(false);

  // temp user account state
  const [curMemberLoginState, setMemberLoginState] =
    React.useState<MemberLoginDataType>(defaultMemberLoginData);

  // validation logic (should move to hooks)
  const [curMemberLoginValidationState, setMemberLoginValidationState] =
    React.useState<MemberLoginValidationDataType>(
      defaultMemberLoginValidationData
    );

  const { updateValidationAt, updateAllValidation, isValidSync } =
    useValidation({
      curDomain: curMemberLoginState,
      curValidationDomain: curMemberLoginValidationState,
      schema: memberLoginSchema,
      setValidationDomain: setMemberLoginValidationState,
      defaultValidationDomain: defaultMemberLoginValidationData,
    });

  // event handlers
  const handleEmailInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextEmail = e.currentTarget.value;
    updateValidationAt("email", e.currentTarget.value);
    setMemberLoginState((prev: MemberLoginDataType) => ({
      ...prev,
      email: nextEmail,
    }));
  };

  const handlePasswordInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextPassword = e.currentTarget.value;
    updateValidationAt("password", e.currentTarget.value);
    setMemberLoginState((prev: MemberLoginDataType) => ({
      ...prev,
      password: nextPassword,
    }));
  };

  // event handler for forgot password link click
  const handleForgotPasswordClick: React.EventHandler<
    React.MouseEvent<HTMLAnchorElement>
  > = (e) => {
    setForgotPasswordDialogOpen(true);
  };

  const submit = () => {
    const isValid: boolean = isValidSync(curMemberLoginState);

    if (isValid) {
      // pass
      log("passed");
      // request
      api
        .request({
          method: "POST",
          url: API1_URL + `/authenticate`,
          data: curMemberLoginState,
          headers: { "Content-Type": "application/json" },
        })
        .then((data) => {
          /**
           * login success
           **/
          const loggedInUser: UserType = data.data.user;
          dispatch(authActions.loginWithUser(loggedInUser));

          // make sure this work.
          // this does not work esp when there is no previous url.
          //
          // solution: to use redux state to store the previous url.
          //history.back();

          let nextDest = "/";

          if (curPreviousUrl) {
            nextDest = curPreviousUrl;
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

          dispatch(
            messageActions.update({
              id: getNanoId(),
              type: MessageTypeEnum.SUCCESS,
              message: "logged in successfully.",
            })
          );
        })
        .catch((error: AxiosError) => {
          dispatch(
            messageActions.update({
              id: getNanoId(),
              type: MessageTypeEnum.ERROR,
              message: error.response.data.message,
            })
          );
        });
    } else {
      updateAllValidation();
    }
  };

  // 'enter' global to submit by 'enter'
  React.useEffect(() => {
    if (!curForgotPasswordDialogOpen) {
      window.addEventListener(
        "keydown",
        handleSubmitKeyDown as unknown as EventListener
      );
    } else {
      window.removeEventListener(
        "keydown",
        handleSubmitKeyDown as unknown as EventListener
      );
    }
    return () => {
      window.removeEventListener(
        "keydown",
        handleSubmitKeyDown as unknown as EventListener
      );
    };
  }, [
    JSON.stringify(curMemberLoginState),
    curPreviousUrl,
    curForgotPasswordDialogOpen,
  ]);
  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = async (e) => {
    submit();
  };

  // key down to submit
  const handleSubmitKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      submit();
    }
  };

  return (
    <Grid container justify="center" direction="column" className={classes.box}>
      <IconButton edge="start" color="inherit" aria-label="login-logo">
        <SentimentSatisfiedOutlinedIcon />
      </IconButton>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {"Login"}
      </Typography>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          id="email"
          label="Email"
          type="email"
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
        <Box component="div" className={classes.forgetPasswordBox}>
          <Typography variant="body2" component="p">
            <Link
              onClick={handleForgotPasswordClick}
              className={classes.cursorLink}
            >
              forget your password?
            </Link>
          </Typography>
        </Box>
        <Box component="div" className={classes.actionBox}>
          <Button
            onKeyDown={handleSubmitKeyDown}
            onClick={handleUserAccountSaveClickEvent}
            variant="contained"
          >
            Login
          </Button>
        </Box>
      </form>
      <ForgotPasswordDialog
        curFormOpen={curForgotPasswordDialogOpen}
        setFormOpen={setForgotPasswordDialogOpen}
      />
    </Grid>
  );
};

export default Login;
