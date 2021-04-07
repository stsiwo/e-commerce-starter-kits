import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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

const GuestHeaderMenuItems: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  return (
    <Grid item>
      <Typography >
        <Link href="/login" color="inherit" className={classes.menuItem} component={props => <RRLink {...props} to="/login" />}>
          Log In
        </Link>
        <Link href="/signup" color="inherit" className={classes.menuItem} component={props => <RRLink {...props} to="/signup" />}>
          Sign Up
        </Link>
      </Typography>
    </Grid>
  )
}

export default GuestHeaderMenuItems



