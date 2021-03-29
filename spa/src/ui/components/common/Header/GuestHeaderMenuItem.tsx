import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

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
        <Link href="/login" color="inherit" className={classes.menuItem}>
          Log In
        </Link>
        <Link href="/signup" color="inherit" className={classes.menuItem}>
          Sign Up
        </Link>
      </Typography>
    </Grid>
  )
}

export default GuestHeaderMenuItems



