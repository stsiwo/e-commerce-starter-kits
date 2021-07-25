import Badge from "@material-ui/core/Badge";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link as RRLink } from "react-router-dom";
import { authActions } from "reducers/slices/app";
import {
  fetchNotificationActionCreator,
  incrementNotificationCurIndexActionCreator,
} from "reducers/slices/domain/notification";
import { cartModalActions } from "reducers/slices/ui";
import { mSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

declare interface MenuItemType {
  url: string;
  label: string;
  isLogout: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      margin: theme.spacing(0, 2, 0, 2),
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);

const MemberHeaderMenuItems: React.FunctionComponent<{}> = (props) => {
  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // data
  const menuItemList: MenuItemType[] = React.useMemo(
    () => [
      {
        url: "/account",
        label: "Accounts",
        isLogout: false,
      },
      {
        url: "/search",
        label: "Search",
        isLogout: false,
      },
      {
        url: "/wishlist",
        label: "Wish List",
        isLogout: false,
      },
      {
        url: "/orders",
        label: "Orders",
        isLogout: false,
      },
      {
        url: "/",
        label: "Log Out",
        isLogout: true,
      },
    ],
    []
  );

  // styles
  const classes = useStyles();

  // cur cart item #
  const curNumberOfCartItems = useSelector(
    mSelector.makeNumberOfCartItemSelector()
  );

  // responsive
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // cart icon click
  const dispatch = useDispatch();

  const handleCartModalOpenClick: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    dispatch(cartModalActions.toggle());
  };

  // drop menu stuff
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDropDownMenuOpenClickEvent = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropDownMenuCloseClickEvent = () => {
    setAnchorEl(null);
  };

  // logout event handler
  const handleLogout: React.EventHandler<React.MouseEvent<HTMLAnchorElement>> =
    (e) => {
      e.preventDefault();

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

          enqueueSnackbar("logged out successfully.", { variant: "success" });
        })
        .catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" });
        });
    };

  /**
   * notification feature.
   **/
  const curNotificationPagination = useSelector(
    mSelector.makeNotificationPaginationSelector()
  );

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
  };

  // rendering stuff
  const renderMenuItemListForLargeScreen: () => React.ReactNode = () => {
    return menuItemList.map((menuItem: MenuItemType) => {
      const linkProps = {
        className: classes.menuItem,
        component: RRLink,
        to: menuItem.url,
      };

      return (
        <Link
          key={menuItem.url}
          color="inherit"
          {...linkProps}
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
            menuItem.isLogout ? handleLogout(e) : null
          }
        >
          {menuItem.label}
        </Link>
      );
    });
  };

  const renderMenuItemListForSmallScreen: () => React.ReactNode = () => {
    return menuItemList.map((menuItem: MenuItemType) => {
      return (
        <MenuItem
          key={menuItem.url}
          onClick={handleDropDownMenuCloseClickEvent}
        >
          <Link
            color="inherit"
            className={classes.menuItem}
            component={RRLink}
            to={menuItem.url}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
              menuItem.isLogout ? handleLogout(e) : null
            }
          >
            {menuItem.label}
          </Link>
        </MenuItem>
      );
    });
  };

  // disable cart icon when /checkout
  const location = useLocation();

  return (
    <Grid item>
      {location.pathname != "/checkout" && (
        <IconButton onClick={handleCartModalOpenClick}>
          <Badge badgeContent={curNumberOfCartItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      )}
      <IconButton onClick={handleNotificationClick}>
        {/** use totalElements to display total number of notifications **/}
        <Badge
          badgeContent={curNotificationPagination.totalElements}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      {isMdUp && (
        <React.Fragment>{renderMenuItemListForLargeScreen()}</React.Fragment>
      )}
      {!isMdUp && (
        <React.Fragment>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleDropDownMenuOpenClickEvent}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleDropDownMenuCloseClickEvent}
          >
            {renderMenuItemListForSmallScreen()}
          </Menu>
        </React.Fragment>
      )}
    </Grid>
  );
};

export default MemberHeaderMenuItems;
