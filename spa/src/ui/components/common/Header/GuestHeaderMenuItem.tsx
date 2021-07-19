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
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link as RRLink } from "react-router-dom";
import { cartModalActions } from "reducers/slices/ui";
import { mSelector } from "src/selectors/selector";

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

const GuestHeaderMenuItems: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  // responsive
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  // data
  const menuItemList: MenuItemType[] = React.useMemo(
    () => [
      {
        url: "/search",
        label: "Search",
        isLogout: false,
      },
      {
        url: "/login",
        label: "Log In",
        isLogout: false,
      },
      {
        url: "/signup",
        label: "Sign Up",
        isLogout: false,
      },
    ],
    []
  );
  // cur cart item #
  const curNumberOfCartItems = useSelector(
    mSelector.makeNumberOfCartItemSelector()
  );

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

  // rendering stuff
  const renderMenuItemListForLargeScreen: () => React.ReactNode = () => {
    return menuItemList.map((menuItem: MenuItemType) => {
      const linkProps = {
        className: classes.menuItem,
        component: RRLink,
        to: menuItem.url,
      };

      return (
        <Link key={menuItem.url} color="inherit" {...linkProps}>
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

export default GuestHeaderMenuItems;
