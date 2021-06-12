import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { defaultUserStatusAccountData, defaultUserStatusAccountValidationData, UserActiveEnum, userActiveLabelList, UserStatusAccountDataType, UserStatusAccountValidationDataType, UserType, UserStatusCriteria } from 'domain/user/types';
import { useValidation } from 'hooks/validation';
import { userActiveStatusAccountSchema } from 'hooks/validation/rules';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from 'reducers/slices/app';
import { userActions } from 'reducers/slices/domain/user';
import { MessageTypeEnum } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import { getNanoId } from 'src/utils';

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

declare type AdminCustomerStatusFormPropsType = {
  user?: UserType
}

const AdminCustomerStatusForm: React.FunctionComponent<AdminCustomerStatusFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch();

  // temp user account state
  const [curAdminCustomerState, setAdminCustomerState] = React.useState<UserStatusAccountDataType>(defaultUserStatusAccountData)

  // use effect to update user state if exists after render jsx
  React.useEffect(() => {

    if (props.user) {
      setAdminCustomerState((prev: UserStatusAccountDataType) => ({
        ...prev,
        active: props.user.active,
        activeNote: props.user.activeNote ? props.user.activeNote : "",
      }))
    }

  }, [])

  // validation logic (should move to hooks)
  const [curAdminCustomerValidationState, setAdminCustomerValidationState] = React.useState<UserStatusAccountValidationDataType>(defaultUserStatusAccountValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curAdminCustomerState,
    curValidationDomain: curAdminCustomerValidationState,
    schema: userActiveStatusAccountSchema,
    setValidationDomain: setAdminCustomerValidationState,
    defaultValidationDomain: defaultUserStatusAccountValidationData,
  })

  // event handlers
  const handleActiveInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    /**
     * dont use 'currentTarget' for select input
     **/
    const nextActive = e.target.value as UserActiveEnum
    updateValidationAt("active", e.target.value);
    setAdminCustomerState((prev: UserStatusAccountDataType) => ({
      ...prev,
      active: nextActive
    }));
  }

  const handleActiveNoteInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextActiveNote = e.currentTarget.value
    updateValidationAt("activeNote", e.currentTarget.value);
    setAdminCustomerState((prev: UserStatusAccountDataType) => ({
      ...prev,
      activeNote: nextActiveNote
    }));
  }

  // event handler to submit
  const handleAdminCustomerSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curAdminCustomerState)
    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")

      // request
      api.request({
        method: 'patch',
        url: API1_URL + `/users/${props.user.userId}/status`,
        data: {
          active: curAdminCustomerState.active,
          activeNote: curAdminCustomerState.activeNote,
          userId: props.user.userId,
        } as UserStatusCriteria
      }).then((data) => {
        // fetch again
        dispatch(userActions.updateUser({
          user: data.data,
          userId: data.data.userId,
        }))

        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.SUCCESS,
            message: "updated successfully.",
          })
        )

      }).catch((error: AxiosError) => {
        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.ERROR,
            message: "failed to update.",
          })
        )
      })
    } else {
      updateAllValidation()
    }
  }

  return (
    <React.Fragment>
      <Typography variant="h6" component="h6" align="center" className={classes.title} >
        {"Status"}
      </Typography>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          id="active-status"
          label="Active Status"
          select
          className={classes.formControl}
          value={curAdminCustomerState.active}
          onChange={handleActiveInputChangeEvent}
          helperText={curAdminCustomerValidationState.active}
          error={curAdminCustomerValidationState.active !== ""}
        >
          {(Object.keys(UserActiveEnum).map((active: UserActiveEnum) => (
            <MenuItem key={active} value={active}>
              {userActiveLabelList[active]}
            </MenuItem>
          )))}
        </TextField>
        <TextField
          id="active-note"
          label="Note"
          placeholder={"Optional"}
          multiline
          rows={5}
          className={classes.formControl}
          value={curAdminCustomerState.activeNote}
          onChange={handleActiveNoteInputChangeEvent}
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

export default AdminCustomerStatusForm



