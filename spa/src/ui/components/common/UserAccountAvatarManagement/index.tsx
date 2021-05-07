import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BackupIcon from '@material-ui/icons/Backup';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ImageIcon from '@material-ui/icons/Image';
import { AxiosError } from 'axios';
import { UserType } from 'domain/user/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import merge from 'lodash/merge';
import { authActions } from 'reducers/slices/app';
import { api } from 'configs/axiosConfig';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2)
    },
    avatarBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: `${theme.spacing(1)}px 0`,
    },
    avatar: {
      width: 100,
      height: 100,
      boxShadow: theme.shadows[5],
    },
    btnBox: {
      display: "flex",
      justifyContent: "right",
      alignItems: "center",
    }
  }),
);

declare type UserAccountAvatarManagementPropsType = {
  user?: UserType
}

/**
 * member avatar management component 
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
const UserAccountAvatarManagement: React.FunctionComponent<UserAccountAvatarManagementPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch()
  /**
   * file uploading stuff
   **/
  const [curFile, setFile] = React.useState<File>(null);
  const [curFilePath, setFilePath] = React.useState<string>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleTriggerClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  }

  const handleFileChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    setFile(e.currentTarget.files[0])
    const path = URL.createObjectURL(e.currentTarget.files[0])
    setFilePath(path);
  }


  const handleUploadClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    if (!curFile) {
      enqueueSnackbar("Please choose an image before uploading.", { variant: "error" });
      return false;
    }

    // request body prep
    const bodyFormData = new FormData();
    bodyFormData.append("avatarImage", curFile);

    // request
    api.request({
      method: 'POST',
      url: API1_URL + `/users/${auth.user.userId}/avatar-image`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((data) => {
      /**
       * update state
       **/
      dispatch(authActions.update(merge({}, auth, {
        user: {
          avatarImagePath: data.data.avatarImagePath,
        }
      })));
      enqueueSnackbar("uploaded successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })
  }


  const handleDeleteClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    // request
    api.request({
      method: 'DELETE',
      url: API1_URL + `/users/${auth.user.userId}/avatar-image`
    }).then((data) => {
      /**
       * remove it from state
       **/
      dispatch(authActions.update(merge({}, auth, {
        user: {
          avatarImagePath: "",
        }
      })));
      enqueueSnackbar("deleted successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })

  }

  return (
    <React.Fragment>
      <Typography variant="h6" component="h6" align="center" className={classes.title} >
        {"Avatar"}
      </Typography>
      <Box className={classes.avatarBox}>
        <Avatar
          src={curFilePath}
          classes={{
            root: classes.avatar,
          }}
        />
      </Box>
      <Box className={classes.btnBox}>
        <IconButton onClick={handleDeleteClick}>
          <DeleteForeverIcon />
        </IconButton>
        <input
          accept="image/*"
          className={null}
          id="contained-button-file"
          multiple
          hidden
          type="file"
          ref={imageInputRef}
          onChange={handleFileChange}
        />
        <label htmlFor="contained-button-file">
          <IconButton onClick={handleTriggerClick}>
            <ImageIcon />
          </IconButton>
        </label>
        <IconButton onClick={handleUploadClick}>
          <BackupIcon />
        </IconButton>
      </Box>
    </React.Fragment>
  )
}

export default UserAccountAvatarManagement


