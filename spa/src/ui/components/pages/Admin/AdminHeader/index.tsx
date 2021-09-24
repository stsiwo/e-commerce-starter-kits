import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import { api } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link as RRLink } from "react-router-dom";
import { authActions } from "reducers/slices/app";
import {
  fetchNotificationActionCreator,
  incrementNotificationCurIndexActionCreator,
} from "reducers/slices/domain/notification";
import { mSelector } from "src/selectors/selector";
const log = logger(__filename);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      boxShadow: "none",
    },
    gridItemRight: {
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "center",
      alignItems: "center",

      "& > *": {},
    },
    pointer: {
      cursor: "pointer",
    },
  })
);

const AdminHeader: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector());

  // avatar image
  const curAvatarImageUrl = useSelector(mSelector.makeAuthAvatarUrlSelector());

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
    api
      .request({
        method: "post",
        url: API1_URL + `/logout`,
        data: null,
      })
      .then((data) => {
        // fetch again
        dispatch(authActions.logout());

        history.push("/admin/login");

        enqueueSnackbar("logged out successfully.", { variant: "success" });
      });

    handleMenuClose();
  };

  const handleSwitchToTestMember = (e: React.MouseEvent<HTMLElement>) => {
    // request
    api
      .request({
        method: "post",
        url: API1_URL + `/logout`,
        data: null,
      })
      .then((data) => {
        // fetch again
        dispatch(authActions.logout());

        history.push("/login");

        enqueueSnackbar(
          "please use this test credential to login as test member.",
          {
            variant: "success",
          }
        );
      });

    handleMenuClose();
  };

  /**
   * notification feature.
   **/
  const curNotificationPagination = useSelector(
    mSelector.makeNotificationPaginationSelector()
  );

  /**
   * counter to decrement from total ntf size
   * since we fetch the rest of notification from api, it is difficult to count without this.
   */
  const [curCounter, setCounter] = React.useState<number>(0);

  // fetch notifcation for this member.
  // - initial fetch (replace)
  // - the next consecutive fetchs (concat)
  const isInitial = React.useRef<boolean>(true);
  React.useEffect(() => {
    log("start fetching notification...");
    if (isInitial.current) {
      log("initial notification fetch with 'update'");
      dispatch(fetchNotificationActionCreator({ type: "update" }));
      isInitial.current = false;
    } else {
      log("initial notification fetch with 'concat'");
      dispatch(fetchNotificationActionCreator({ type: "concat" }));
    }
  }, [curNotificationPagination.page]);

  const handleNotificationClick = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(incrementNotificationCurIndexActionCreator());

    // incremnt count until reaching the total ntf
    if (curCounter < curNotificationPagination.totalElements) {
      setCounter((prev: number) => ++prev);
    }
  };

  return (
    <AppBar position="sticky" className={classes.appBar} color="default">
      <Toolbar>
        <Grid justify="space-between" alignItems="center" container>
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
              <Badge
                badgeContent={
                  curNotificationPagination.totalElements - curCounter
                }
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar
              alt="Satoshi Iwao"
              className={classes.pointer}
              src={curAvatarImageUrl}
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
              <MenuItem onClick={handleSwitchToTestMember}>
                Switch to Test Member
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
