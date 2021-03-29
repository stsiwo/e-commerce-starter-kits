import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { AuthType, UserTypeEnum } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import GuestHeaderMenuItems from './GuestHeaderMenuItem';
import MemberHeaderMenuItems from './MemberHeaderMenuItems';

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

  const auth: AuthType = useSelector(mSelector.makeAuthSelector())

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
          {(auth.userType === UserTypeEnum.GUEST &&
            <GuestHeaderMenuItems />
          )}
          {(auth.userType === UserTypeEnum.MEMBER &&
            <MemberHeaderMenuItems />
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default Header


