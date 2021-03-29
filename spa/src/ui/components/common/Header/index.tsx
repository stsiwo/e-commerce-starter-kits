import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    menuItem: {
      margin: theme.spacing(0, 2, 0, 2),
      fontWeight: theme.typography.fontWeightBold
    },
  }),
);

const Header: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Grid
          justify="space-between"
          alignItems="center"
          container
        >
          <Grid item>
            <Link href="/" color="inherit">
              <IconButton edge="start"  color="inherit" aria-label="menu">
                <SentimentSatisfiedOutlinedIcon />
              </IconButton>
            </Link>
          </Grid>
          <Grid item>
            <Typography >
              <Link href="/login" color="inherit" className={classes.menuItem}>
                Login
              </Link>
              <Link href="/signup" color="inherit" className={classes.menuItem}>
                Signup
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default Header


