import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link as RRLink } from "react-router-dom";
import { AuthType, UserTypeEnum } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import AdminHeaderMenuItems from './AdminHeaderMenuItems';
import GuestHeaderMenuItems from './GuestHeaderMenuItem';
import MemberHeaderMenuItems from './MemberHeaderMenuItems';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      //background: "rgba(255, 255, 255, 1)",
      background: "transparent",
      boxShadow: "none",

      color: theme.palette.text.primary,
    },
    menuItem: {
      margin: theme.spacing(0, 2, 0, 2),
      fontWeight: theme.typography.fontWeightBold
    },
  }),
);

const Header: React.FunctionComponent<{}> = (props) => {

  const auth: AuthType = useSelector(mSelector.makeAuthSelector())

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
            <IconButton edge="start" color="inherit" aria-label="menu" component={RRLink} to="/">
              <SentimentSatisfiedOutlinedIcon />
            </IconButton>
          </Grid>
          {(auth.userType === UserTypeEnum.GUEST &&
            <GuestHeaderMenuItems />
          )}
          {(auth.userType === UserTypeEnum.MEMBER &&
            <MemberHeaderMenuItems />
          )}
          {(auth.userType === UserTypeEnum.ADMIN &&
            <AdminHeaderMenuItems />
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default Header


