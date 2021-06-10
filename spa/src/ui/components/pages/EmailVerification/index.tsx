import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { messageActions } from 'reducers/slices/app';
import { MessageTypeEnum } from 'src/app';
import { getNanoId } from 'src/utils';
import { mSelector } from 'src/selectors/selector';

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

const EmailVerification: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const auth = useSelector(mSelector.makeAuthSelector())

  // dispatch
  const dispatch = useDispatch();

  // history
  const history = useHistory();

  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    api.request({
      method: 'POST',
      url: API1_URL + `/users/${auth.user.userId}/reissue-account-verify`,
    }).then((data) => {

      /**
       * update message
       **/
      dispatch(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "we sent the verification email successfuly. please check your email box.",
        })
      )

    }).catch((error: AxiosError) => {
      /**
       * update message
       **/
      dispatch(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.SUCCESS,
          message: "sorry, we failed to send the verification email. please try again.",
        })
      )
    })
  }

  return (
    <Grid
      container
      justify="center"
      direction="column"
      className={classes.box}
    >
      <IconButton edge="start" color="inherit" aria-label="company-logo">
        <SentimentSatisfiedOutlinedIcon />
      </IconButton>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Email Verification"}
      </Typography>
      <Typography variant="body1" component="p" align="left" >
        {"Thank you for signing up:) Please checkout your email box and click the link to verify your email address."}
      </Typography>
      <Box component="div" className={classes.actionBox}>
        <Button onClick={handleUserAccountSaveClickEvent}>
          Send Verification Email Again
        </Button>
      </Box>
    </Grid>
  )
}

export default EmailVerification




