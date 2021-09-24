import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import UserAccountAddressManagement from "components/common/UserAccountAddressManagement";
import UserAccountAvatarManagement from "components/common/UserAccountAvatarManagement";
import UserAccountBasicManagement from "components/common/UserAccountBasicManagement";
import UserAccountPhoneManagement from "components/common/UserAccountPhoneManagement";
import UserAccountRemovalManagement from "components/common/UserAccountRemovalManagement";
import { api } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { UserActiveEnum, UserType } from "domain/user/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, messageActions } from "reducers/slices/app";
import { MessageTypeEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
const log = logger(__filename);

/**
 * TODO: if you have maxWidth at any parent element, Grid xs,md,..  does not work!!
 **/

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    gridBox: {},
    gridItem: {},
  })
);

/**
 * member account management page
 *
 **/
const Account: React.FunctionComponent<{}> = (props) => {
  const dispatch = useDispatch();

  const classes = useStyles();

  const auth = useSelector(mSelector.makeAuthSelector());

  // fetch auth from api
  React.useEffect(() => {
    api
      .request({
        method: "GET",
        url: API1_URL + `/users/${auth.user.userId}`,
      })
      .then((data) => {
        /**
         *  add new phone
         **/
        const loggedInUser: UserType = data.data;
        log("user data: ");
        log(loggedInUser);
        dispatch(authActions.updateUser(loggedInUser));
      });
  }, [JSON.stringify(auth.user)]);

  // reissue verification token event handler
  const handleReissueToken = (e: React.MouseEvent<HTMLButtonElement>) => {
    api
      .request({
        method: "POST",
        url: API1_URL + `/users/${auth.user.userId}/reissue-account-verify`,
      })
      .then((data) => {
        const loggedInUser: UserType = data.data;
        log("user data: ");
        log(loggedInUser);
        dispatch(authActions.updateUser(loggedInUser));
        /**
         * update message
         **/
        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.SUCCESS,
            message:
              "we sent the verification email successfuly. please check your email box.",
          })
        );
      });
  };

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {"Account"}
      </Typography>
      {auth.user.active === UserActiveEnum.TEMP && (
        <Alert
          severity="warning"
          variant="outlined"
          action={
            <Button
              variant="contained"
              size="small"
              onClick={handleReissueToken}
            >
              Verify Now
            </Button>
          }
        >
          <AlertTitle>Warning</AlertTitle>
          Your email has't been verified yet.{" "}
          <strong>Please verify your email.</strong>
        </Alert>
      )}
      <Grid
        container
        justify="space-around"
        alignItems="flex-start"
        className={classes.gridBox}
      >
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <UserAccountAvatarManagement />
        </Grid>
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <UserAccountBasicManagement user={auth.user} />
        </Grid>
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <UserAccountPhoneManagement phones={auth.user.phones} />
        </Grid>
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <UserAccountAddressManagement addresses={auth.user.addresses} />
        </Grid>
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <UserAccountRemovalManagement user={auth.user} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Account;
