import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RRLink } from "react-router-dom";
import { authActions } from 'reducers/slices/app';
import { cartModalActions } from 'reducers/slices/ui';
import { mSelector } from 'src/selectors/selector';

declare interface MenuItemType {
  url: string
  label: string
  isLogout: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      margin: theme.spacing(0, 2, 0, 2),
      fontWeight: theme.typography.fontWeightBold
    },
  }),
);

const MemberHeaderMenuItems: React.FunctionComponent<{}> = (props) => {

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // data
  const menuItemList: MenuItemType[] = React.useMemo(() => [
    {
      url: "/account",
      label: "Accounts",
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
  ], []);

  // styles
  const classes = useStyles();

  // cur cart item #
  const curNumberOfCartItems = useSelector(mSelector.makeNumberOfCartItemSelector());

  // responsive
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // cart icon click
  const dispatch = useDispatch();

  const handleCartModalOpenClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    dispatch(cartModalActions.toggle());
  }

  // drop menu stuff
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDropDownMenuOpenClickEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropDownMenuCloseClickEvent = () => {
    setAnchorEl(null);
  };

  // logout event handler
  const handleLogout: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    e.preventDefault()

    // request
    api.request({
      method: 'post',
      url: API1_URL + `/logout`,
      data: null 
    }).then((data) => {

      // fetch again
      dispatch(authActions.logout())

      enqueueSnackbar("logged out successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })
  }

  // rendering stuff
  const renderMenuItemListForLargeScreen: () => React.ReactNode = () => {
    return menuItemList.map((menuItem: MenuItemType) => {

      const linkProps = {
        className: classes.menuItem,
        component: RRLink,
        to: menuItem.url,
      }

      return (
        <Link key={menuItem.url}
          color="inherit"
          {...linkProps}
        >
          {menuItem.label}
        </Link>
      )
    })
  }

  const renderMenuItemListForSmallScreen: () => React.ReactNode = () => {
    return menuItemList.map((menuItem: MenuItemType) => {
      return (
        <MenuItem key={menuItem.url} onClick={handleDropDownMenuCloseClickEvent}>
          <Link
            color="inherit"
            className={classes.menuItem}
            component={RRLink}
            to={menuItem.url}
          >
            {menuItem.label}
          </Link>
        </MenuItem>
      )
    })
  }

  return (
    <Grid item>
      <IconButton onClick={handleCartModalOpenClick}>
        <Badge badgeContent={curNumberOfCartItems} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      {(isMdUp &&
        <React.Fragment>
          {renderMenuItemListForLargeScreen()}
          <Button onClick={handleLogout}>
            Logout
          </Button>
        </React.Fragment>
      )}
      {(!isMdUp &&
        <React.Fragment>
          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleDropDownMenuOpenClickEvent}>
            Open Menu
            </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleDropDownMenuCloseClickEvent}
          >
            {renderMenuItemListForSmallScreen()}
            <Button onClick={handleLogout}>
              Logout
            </Button>
          </Menu>
        </React.Fragment>
      )}
    </Grid>
  )
}

export default MemberHeaderMenuItems
