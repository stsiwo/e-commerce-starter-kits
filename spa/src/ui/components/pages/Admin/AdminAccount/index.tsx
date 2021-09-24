import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { api } from "configs/axiosConfig";
import { UserType } from "domain/user/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "reducers/slices/app";
import { mSelector } from "src/selectors/selector";
import AdminAccountAvatarManagement from "./AdminAccountAvatarManagement";
import AdminAccountBasicManagement from "./AdminAccountBasicManagement";
import AdminAccountCompanyManagement from "./AdminAccountCompanyManagement";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      flexGrow: 1,
      padding: theme.spacing(0, 1),
      /**
       * this is necessary for scrollable tabs (from Mui) used for filter/sort for each domain.
       **/
      width: "100%",
    },
    card: {
      flexGrow: 1,
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2),
    },
    gridContainer: {
      padding: theme.spacing(1),

      /**[theme.breakpoints.down("md")]: {
        flexDirection: 'column-reverse',
      }**/
    },
    gridItem: {
      // setting margin breaks <Grid xs, md, lg > system
      // so use 'padding' instead
      padding: theme.spacing(1),
    },
  })
);

/**
 * admin account management page
 *
 **/
const AdminAccount: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

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
        dispatch(authActions.updateUser(loggedInUser));
      });
  }, [JSON.stringify(auth.user)]);

  return (
    <Box component="div" className={classes.box}>
      {/** row 1 **/}
      <Box>
        <Card className={classes.card}>
          <CardHeader
            titleTypographyProps={{
              variant: "h6",
            }}
            subheaderTypographyProps={{
              variant: "body1",
            }}
            title="Account"
            subheader="Enter your admin information. These information is used to access all of resources about this website (e.g., customers, orders, products and so on)."
          />
          <CardContent>
            <Grid
              container
              justify="space-around"
              alignItems="center"
              className={classes.gridContainer}
            >
              <Grid item xs={12} md={4} className={classes.gridItem}>
                <AdminAccountAvatarManagement />
              </Grid>
              <Grid item xs={12} md={8} className={classes.gridItem}>
                <AdminAccountBasicManagement />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/** row 2 **/}
        <Box>
          <AdminAccountCompanyManagement />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminAccount;
