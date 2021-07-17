import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import { useValidation } from "hooks/validation";
import { forgotPasswordSchema } from "hooks/validation/rules";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDispatch } from "react-redux";
import { messageActions } from "reducers/slices/app";
import { getNanoId } from "src/utils";
import { MessageTypeEnum } from "src/app";

export declare type ForgotPasswordDataType = {
  email: string;
};

const defaultForgotPasswordData: ForgotPasswordDataType = {
  email: "",
};

export declare type ForgotPasswordValidationDataType = {
  email?: string;
};

const defaultForgotPasswordValidationData: ForgotPasswordValidationDataType = {
  email: "",
};

declare type ForgotPasswordDialogPropsType = {
  curFormOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    /**
     * parent component is div[display="flex"] to display Nav and Content horizontally.
     **/
    dialog: {
      width: 240,
      flexShrink: 0,
      zIndex: 0,
    },
    dialogPaper: {
      width: 240,
    },
    dialogContentRoot: {
      padding: theme.spacing(1),
    },
    toolbar: theme.mixins.toolbar,
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(1),
      fontWeight: theme.typography.fontWeightBold,
    },
    toggleBtnBox: {
      position: "fixed",
      bottom: "10px",
      right: "10px",
    },
    formInput: {
      width: "100%",
    },
  })
);

const ForgotPasswordDialog: React.FunctionComponent<ForgotPasswordDialogPropsType> =
  (props) => {
    // used to switch 'permanent' or 'temporary' nav menu based on this screen size
    const theme = useTheme();
    const classes = useStyles();

    // dispatch
    const dispatch = useDispatch();

    // forgot password state
    const [curForgotPasswordState, setForgotPasswordState] =
      React.useState<ForgotPasswordDataType>(defaultForgotPasswordData);

    // validation logic (should move to hooks)
    const [curForgotPasswordValidationState, setForgotPasswordValidationState] =
      React.useState<ForgotPasswordValidationDataType>(
        defaultForgotPasswordValidationData
      );

    const { updateValidationAt, updateAllValidation, isValidSync } =
      useValidation({
        curDomain: curForgotPasswordState,
        curValidationDomain: curForgotPasswordValidationState,
        schema: forgotPasswordSchema,
        setValidationDomain: setForgotPasswordValidationState,
        defaultValidationDomain: defaultForgotPasswordValidationData,
      });

    const handleEmailInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextEmail = e.currentTarget.value;
      updateValidationAt("email", e.currentTarget.value);
      setForgotPasswordState((prev: ForgotPasswordDataType) => ({
        ...prev,
        email: nextEmail,
      }));
    };

    const toggleDialog =
      (nextOpen: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        props.setFormOpen(nextOpen);
      };

    const submit = () => {
      const isValid: boolean = isValidSync(curForgotPasswordState);

      if (isValid) {
        // pass
        console.log("passed");
        // request
        api
          .request({
            method: "POST",
            url: API1_URL + `/forgot-password`,
            data: curForgotPasswordState,
          })
          .then((data) => {
            dispatch(
              messageActions.update({
                id: getNanoId(),
                type: MessageTypeEnum.SUCCESS,
                message: "please check your email box.",
              })
            );
          })
          .catch((error: AxiosError) => {
            /**
             * we not gonna display if the email is exist or not to avoid user enumeration attack.
             **/
            dispatch(
              messageActions.update({
                id: getNanoId(),
                type: MessageTypeEnum.SUCCESS,
                message: "please check your email box.",
              })
            );
          });
      } else {
        updateAllValidation();
      }
    };

    const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      submit();
    };

    // key down to submit
    const handleSubmitKeyDown = (e: React.KeyboardEvent) => {
      if (e.key == "Enter") {
        submit();
      }
    };

    // 'enter' global to submit by 'enter'
    React.useEffect(() => {
      if (props.curFormOpen) {
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
    }, [JSON.stringify(curForgotPasswordState), props.curFormOpen]);

    // render nav items
    return (
      <Dialog
        open={props.curFormOpen}
        onClose={toggleDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Forgot Your Password?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your registered email address. We will send an email to
            reset password.
          </DialogContentText>
          <TextField
            id="email"
            label="Email"
            type="email"
            className={classes.formInput}
            value={curForgotPasswordState.email}
            onChange={handleEmailInputChangeEvent}
            helperText={curForgotPasswordValidationState.email}
            error={curForgotPasswordValidationState.email !== ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog(false)} variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmitClick} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default ForgotPasswordDialog;
