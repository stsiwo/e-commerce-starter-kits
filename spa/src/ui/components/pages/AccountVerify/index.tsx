import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { useLocation } from 'react-router';
import { api } from 'configs/axiosConfig';
import { UserPhoneType } from 'domain/user/types';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
    contentBox: {
      textAlign: "center"
    }
  }),
);

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

enum AccountVerifyStatusEnum {
  PROCESSING,
  SUCCEEDED,
  FAILED_SINCE_NO_LOGIN,
  FAILED_SINCE_INVALID_TOKEN,
  FAILED_SINCE_OTHER_REASON
}


/**
 * member account verify page
 *
 * - a temp user visit this page when they click the link of a verification email.
 *
 * - make this available to member/guest user.
 *
 * - use cases:
 *
 *  - verified successfully.
 *
 *    - show success message
 *
 *    - redirect to home
 *
 *  - could not verified since the temp user does not log in.
 *
 *    - show error message 
 *
 *    - display 'login' button.
 *
 *  - could not verified since the token is expired or invalid.
 *
 *    - show error message.
 *
 *    - display 're-issue' button
 *
 **/
const AccountVerify: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const query = useQuery()

  // dispatch
  const dispatch = useDispatch();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  const verificationToken = query.get("account-verify-token")

  const [curStatus, setStatus] = React.useState<AccountVerifyStatusEnum>(AccountVerifyStatusEnum.PROCESSING)

  /**
   * verify with token.
   *
   * - only send once.
   *
   * - /account-verify (GET) 
   *
   *
   **/
  React.useEffect(() => {

    // make sure it is sent only once
    if (curStatus === AccountVerifyStatusEnum.PROCESSING) {

      console.log("make sure this only called once!")

      // request
      api.request({
        method: 'GET',
        url: API1_URL + `/account-verify?account-verify-token=${verificationToken}`,
      }).then((data) => {
        /**
         *  verification sueceeded.
         **/
        setStatus(AccountVerifyStatusEnum.SUCCEEDED)
        enqueueSnackbar("verified successfully.", { variant: "success" })
      }).catch((error: AxiosError) => {

        /**
         * if this can communicate with the backend, it will include response so don't worry about 'error.response is undefined' error at dev.
         **/
        if (error.response.status === 401) {
          // authorization failed since not log in or try to verify other temp user.
          setStatus(AccountVerifyStatusEnum.FAILED_SINCE_NO_LOGIN)
        } else if (error.response.status === 400) {
          // authorization failed since invalid token 
          setStatus(AccountVerifyStatusEnum.FAILED_SINCE_INVALID_TOKEN)
        } else {
          setStatus(AccountVerifyStatusEnum.FAILED_SINCE_OTHER_REASON)
        }

        enqueueSnackbar(error.message, { variant: "error" })
      })

    }
  }, [])

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
        {"Verify Your Account"}
      </Typography>
      {(curStatus === AccountVerifyStatusEnum.PROCESSING &&
        <Box className={classes.contentBox}>
          <CircularProgress />
          <Typography variant="subtitle1" component="p" align="center" className={classes.title} >
            {"activating your account..."}
          </Typography>
        </Box>
      )}
      {(curStatus === AccountVerifyStatusEnum.SUCCEEDED &&
        <Box className={classes.contentBox}>
          <Typography variant="subtitle1" component="p" align="center" className={classes.title} >
            {"verified your account successfully."}
          </Typography>
          <Button>
            {"visit Home"}
          </Button>
        </Box>
      )}
      {(curStatus === AccountVerifyStatusEnum.FAILED_SINCE_NO_LOGIN &&
        <Box className={classes.contentBox}>
          <Typography variant="subtitle1" component="p" align="center" className={classes.title} >
            {"seems like you are not logged in. please login first and click the link again."}
          </Typography>
          <Button>
            {"Go to Login Page"}
          </Button>
        </Box>
      )}
      {(curStatus === AccountVerifyStatusEnum.FAILED_SINCE_INVALID_TOKEN &&
        <Box className={classes.contentBox}>
          <Typography variant="subtitle1" component="p" align="center" className={classes.title} >
            {"your verification token is invalid (e.g., expired or wrong value). please re-issue the token again. we will send the verification email again."}
          </Typography>
          <Button>
            {"Issue the Token Again"}
          </Button>
        </Box>
      )}
      {(curStatus === AccountVerifyStatusEnum.FAILED_SINCE_OTHER_REASON &&
        <Box className={classes.contentBox}>
          <Typography variant="subtitle1" component="p" align="center" className={classes.title} >
            {"we failed to process your request. please contact to our customer service."}
          </Typography>
          <Button>
            {"Go to Contact Form"}
          </Button>
        </Box>
      )}
    </Grid>
  )
}

export default AccountVerify


