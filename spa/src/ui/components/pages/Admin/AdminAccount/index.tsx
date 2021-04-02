import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AdminAccountBasicManagement from './AdminAccountBasicManagement';
import Grid from '@material-ui/core/Grid';
import AdminAccountAvatarManagement from './AdminAccountAvatarManagement';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      flexGrow: 1,
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2)
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
      padding: theme.spacing(1) 
    }
  }),
);

/**
 * admin account management page
 *
 **/
const AdminAccount: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  return (
    <Box component="div" className={classes.box}>
      <Typography variant="body2" component="p" align="left" className={classes.title} >
        {"Account"}
      </Typography>
      <Grid 
        container
        justify="space-around"
        className={classes.gridContainer}
      >
        <Grid
          item
          xs={12}
          md={4}
          className={classes.gridItem}
        >
          <AdminAccountAvatarManagement />
        </Grid>
        <Grid
          item 
          xs={12}
          md={8}
          className={classes.gridItem}
        >
          <AdminAccountBasicManagement />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminAccount


