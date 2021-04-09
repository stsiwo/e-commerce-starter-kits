import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import SampleSelfImage from 'static/self.jpeg';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Link as RRLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      background: "rgba(255, 255, 255, 1)",
      color: theme.palette.text.primary,
    },
    gridItemRight: {
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "center",
      alignItems: "center",

      '& > *': {
      }
    },
  }),
);

const AdminHeader: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar >
        <Grid
          justify="space-between"
          alignItems="center"
          container
        >
          <Grid item>
            <Link color="inherit" component={props => <RRLink {...props} to="/" />}>
              <IconButton edge="start"  color="inherit" aria-label="admin-logo">
                <SentimentSatisfiedOutlinedIcon />
              </IconButton>
            </Link>
          </Grid>
          <Grid item className={classes.gridItemRight}>
            <Link color="inherit" component={props => <RRLink {...props} to="/" />}>
              <IconButton edge="start"  color="inherit" aria-label="admin-menu-search">
                <NotificationsIcon />
              </IconButton>
            </Link>
            <Link color="inherit" component={props => <RRLink {...props} to="/" />}>
              <IconButton edge="start"  color="inherit" aria-label="admin-menu-search">
                <SearchOutlinedIcon />
              </IconButton>
            </Link>
            <Link color="inherit" component={props => <RRLink {...props} to="/admin/account" />}>
              <Avatar alt="Satoshi Iwao" src={SampleSelfImage}/>
            </Link>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader


