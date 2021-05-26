import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import AdminOrderGridView from './AdminOrderGridView';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      flexGrow: 1,
      padding: theme.spacing(0, 1),
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
 *  - TODO: implement grid row click to display its detail.
 *
 *    - currently, (+) button opens the detaul drawer. fix this.
 *
 **/
const AdminOrder: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();


  return (
    <Box component="div" className={classes.box}>
      <AdminOrderGridView />
    </Box>
  )
}

export default AdminOrder


