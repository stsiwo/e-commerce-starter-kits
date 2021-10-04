import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BackupIcon from "@material-ui/icons/Backup";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ImageIcon from "@material-ui/icons/Image";
import { logger } from "configs/logger";
import { useWaitResponse } from "hooks/waitResponse";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAuthAvatarImageActionCreator,
  postAuthAvatarImageActionCreator,
} from "reducers/slices/app";
import { mSelector, rsSelector } from "src/selectors/selector";
const log = logger(__filename);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2),
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
    root: {
      maxWidth: 200,
      margin: "0 auto",
    },
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: "100%",
      marginTop: "30",
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
const AdminAccountAvatarManagement: React.FunctionComponent<{}> = (props) => {
  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector());

  // avatar image
  const curAvatarImageUrl = useSelector(mSelector.makeAuthAvatarUrlSelector());

  const dispatch = useDispatch();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  /**
   * file uploading stuff
   **/
  const [curFile, setFile] = React.useState<File>(null);
  const [curFilePath, setFilePath] = React.useState<string>(curAvatarImageUrl);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleTriggerClick: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleFileChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    setFile(e.currentTarget.files[0]);
    const path = URL.createObjectURL(e.currentTarget.files[0]);
    setFilePath(path);
  };

  const handleUploadClick: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    if (!curFile) {
      enqueueSnackbar("Please choose an image before uploading.", {
        variant: "error",
      });
      return false;
    }

    dispatch(
      postAuthAvatarImageActionCreator({
        avatarImage: curFile,
        userId: auth.user.userId,
        version: auth.user.version,
      })
    );
  };

  const handleDeleteClick: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    dispatch(
      deleteAuthAvatarImageActionCreator({
        userId: auth.user.userId,
        version: auth.user.version,
      })
    );

    // issue:same-image-is-not-displayed-second-time
    imageInputRef.current.value = "";
    setFilePath(null);
  };

  /**
   * avoid multiple click submission
   */
  // delete
  const curDeleteFetchStatus = useSelector(
    rsSelector.app.getDeleteAuthAvatarImageFetchStatus
  );
  const { curDisableBtnStatus: curDisableDeleteBtnStatus } = useWaitResponse({
    fetchStatus: curDeleteFetchStatus,
  });

  // post
  const curPostFetchStatus = useSelector(
    rsSelector.app.getPostAuthAvatarImageFetchStatus
  );
  const { curDisableBtnStatus: curDisablePostBtnStatus } = useWaitResponse({
    fetchStatus: curPostFetchStatus,
  });

  return (
    <React.Fragment>
      <Box className={classes.avatarBox}>
        <Avatar
          src={curFilePath}
          classes={{
            root: classes.avatar,
          }}
        />
      </Box>
      <Box className={classes.actionBox}>
        <Typography variant="body1" component="p" align="center">
          recommended image size: <b>125KB</b>
        </Typography>
      </Box>
      <Box className={classes.actionBox}>
        <IconButton
          onClick={handleDeleteClick}
          disabled={curDisableDeleteBtnStatus}
        >
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
        <IconButton
          onClick={handleUploadClick}
          disabled={curDisablePostBtnStatus}
        >
          <BackupIcon />
        </IconButton>
      </Box>
    </React.Fragment>
  );
};

export default AdminAccountAvatarManagement;
