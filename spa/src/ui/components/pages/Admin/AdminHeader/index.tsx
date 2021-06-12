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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { api } from 'configs/axiosConfig';
import { authActions } from 'reducers/slices/app';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { mSelector } from 'src/selectors/selector';
import { fetchNotificationActionCreator, incrementNotificationCurIndexActionCreator } from 'reducers/slices/domain/notification';
import Badge from '@material-ui/core/Badge';

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
    pointer: {
      cursor: "pointer",
    }
  }),
);

const AdminHeader: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector());

  // cart icon click
  const dispatch = useDispatch();

  // history 
  const history = useHistory();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  /**
   * account menu stuff
   **/
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpenClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // handle logout menu item click
  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {

    // request
    api.request({
      method: 'post',
      url: API1_URL + `/logout`,
      data: null
    }).then((data) => {

      // fetch again
      dispatch(authActions.logout())

      history.push("/admin/login");


      enqueueSnackbar("logged out successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })

    handleMenuClose()
  }

  /**
   * notification feature.
   **/
  const curNotificationPagination = useSelector(mSelector.makeNotificationPaginationSelector())

  // fetch notifcation for this member.
  // - initial fetch (replace)
  // - the next consecutive fetchs (concat)
  const isInitial = React.useRef<boolean>(true);
  React.useEffect(() => {
    console.log("start fetching notification...")
    if (isInitial.current) {
      console.log("initial notification fetch with 'update'")
      dispatch(
        fetchNotificationActionCreator({ type: "update" })
      )
      isInitial.current = false
    } else {
      console.log("initial notification fetch with 'concat'")
      dispatch(
        fetchNotificationActionCreator({ type: "concat" })
      )
    }
  }, [
      curNotificationPagination.page
    ])

  const handleNotificationClick = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(
      incrementNotificationCurIndexActionCreator()
    )
  }


  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar >
        <Grid
          justify="space-between"
          alignItems="center"
          container
        >
          <Grid item>
            <Link color="inherit" component={RRLink} to="/">
              <IconButton edge="start" color="inherit" aria-label="admin-logo">
                <SentimentSatisfiedOutlinedIcon />
              </IconButton>
            </Link>
          </Grid>
          <Grid item className={classes.gridItemRight}>
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="admin-menu-search"
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={curNotificationPagination.totalElements} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar
              alt="Satoshi Iwao"
              className={classes.pointer}
              src={auth.user.avatarImagePath ? API1_URL + auth.user.avatarImagePath : null}
              onClick={handleMenuOpenClick}
            />
            <Menu
              id="admin-account-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader


