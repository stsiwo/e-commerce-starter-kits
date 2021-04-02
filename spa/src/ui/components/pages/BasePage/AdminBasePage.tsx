import * as React from 'react';
import AdminHeader from '../Admin/AdminHeader';
import AdminNavDrawer from '../Admin/AdminNavDrawer';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bodBox: {
      
    },
  }),
);


const AdminBasePage: React.FunctionComponent<{}> = (props) => {

  /**
   * TODO: add base component for admin pages
   **/

  return (
    <React.Fragment>
      <AdminHeader />
      <Grid
        container
        justify="center"
      >
        <AdminNavDrawer />
        {props.children}
      </Grid>
    </React.Fragment>
  )
}

export default AdminBasePage



