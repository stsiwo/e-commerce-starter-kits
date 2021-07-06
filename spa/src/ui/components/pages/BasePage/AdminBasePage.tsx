import * as React from 'react';
import AdminHeader from '../Admin/AdminHeader';
import AdminNavDrawer from '../Admin/AdminNavDrawer';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridContainer: {
      flexWrap: "nowrap", 

      /**
       * make 'navDrawer' toggleable
       **/
      [theme.breakpoints.down("sm")]: {
      },

      /**
       * make toggle button easy to click when small screen.
       **/
      marginBottom: theme.spacing(10),
    },
  }),
);


const AdminBasePage: React.FunctionComponent<{}> = (props) => {

  /**
   * TODO: add base component for admin pages
   **/
  const classes = useStyles();

  return (
    <React.Fragment>
      <AdminHeader />
      <Grid
        container
        justify="center"
        className={classes.gridContainer}
      >
        <AdminNavDrawer />
        {props.children}
      </Grid>
    </React.Fragment>
  )
}

export default AdminBasePage



