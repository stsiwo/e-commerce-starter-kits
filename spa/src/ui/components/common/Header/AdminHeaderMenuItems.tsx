import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { Link as RRLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      margin: theme.spacing(0, 2, 0, 2),
      fontWeight: theme.typography.fontWeightBold
    },
  }),
);

const AdminHeaderMenuItems: React.FunctionComponent<{}> = (props) => {

  // styles
  const classes = useStyles();

  return (
    <Grid item>
      <Link color="inherit" className={classes.menuItem} component={RRLink} to="/admin">
        Back To Dashboard 
      </Link>
    </Grid>
  )
}

export default AdminHeaderMenuItems
