import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import { UserType } from "domain/user/types";
import { useWaitResponse } from "hooks/waitResponse";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, messageActions } from "reducers/slices/app";
import { patchAuthFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { FetchStatusEnum, MessageTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2),
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
      textAlign: "center",
    },
  })
);

declare type UserAccountRemovalManagementPropsType = {
  user?: UserType;
};

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
const UserAccountRemovalManagement: React.FunctionComponent<UserAccountRemovalManagementPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    // auth
    const auth = useSelector(mSelector.makeAuthSelector());

    const dispatch = useDispatch();

    const [curActiveNote, setActiveNote] = React.useState<string>("");
    const [curRemovalCheck, setRemovalCheck] = React.useState<boolean>(false);

    // event handlers
    const handleActiveNoteInputChangeEvent = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const activeNote = e.currentTarget.value;
      setActiveNote(activeNote);
    };

    const handleRemovalCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.currentTarget.checked;
      setRemovalCheck(checked);
    };

    /**
     * avoid multiple click submission
     */
    const curPatchFetchStatus = useSelector(
      rsSelector.app.getPatchAuthFetchStatus
    );
    const { curDisableBtnStatus: curDisablePatchBtnStatus } = useWaitResponse({
      fetchStatus: curPatchFetchStatus,
    });

    // event handler to submit
    const handleUserAccountSaveClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = async (e) => {
      // request

      dispatch(patchAuthFetchStatusActions.update(FetchStatusEnum.FETCHING));
      api
        .request({
          method: "patch",
          headers: { "If-Match": `"${props.user.version}"` },
          url: API1_URL + `/users/${props.user.userId}`,
          data: {
            activeNote: curActiveNote,
          },
        })
        .then((data) => {
          // logout
          dispatch(authActions.logout());

          dispatch(
            messageActions.update({
              id: getNanoId(),
              type: MessageTypeEnum.SUCCESS,
              message: "your account deleted successfully.",
            })
          );
          dispatch(patchAuthFetchStatusActions.update(FetchStatusEnum.SUCCESS));
        })
        .catch((error: AxiosError) => {
          dispatch(patchAuthFetchStatusActions.update(FetchStatusEnum.FAILED));
        });
    };

    return (
      <React.Fragment>
        <Typography
          variant="h6"
          component="h6"
          align="center"
          className={classes.title}
        >
          {"Delete Account"}
        </Typography>
        <form className={classes.form} noValidate autoComplete="off">
          <FormControlLabel
            control={
              <Checkbox
                checked={curRemovalCheck}
                onChange={handleRemovalCheck}
                name="checkedA"
              />
            }
            label="I want to delete my account."
          />
          <TextField
            id="active-note"
            label="Reason"
            placeholder={"Optional"}
            multiline
            rows={5}
            className={classes.formControl}
            value={curActiveNote}
            onChange={handleActiveNoteInputChangeEvent}
            disabled={!curRemovalCheck}
          />
          <Box component="div" className={classes.actionBox}>
            <Button
              onClick={handleUserAccountSaveClickEvent}
              disabled={!curRemovalCheck || curDisablePatchBtnStatus}
              variant="contained"
            >
              Delete My Account
            </Button>
          </Box>
        </form>
      </React.Fragment>
    );
  };

export default UserAccountRemovalManagement;
