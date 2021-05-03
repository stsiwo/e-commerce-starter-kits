import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link as RRLink } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { useDispatch } from 'react-redux';
import { cartModalActions } from 'reducers/slices/ui';

declare interface MenuItemType {
  url: string
  label: string
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

  // data
  const menuItemList: MenuItemType[] = React.useMemo(() => [
    {
      url: "/account",
      label: "Accounts",
    },
    {
      url: "/wishlist",
      label: "Wish List",
    },
    {
      url: "/orders",
      label: "Orders",
    },
    {
      url: "/logout",
      label: "Log Out",
    },
  ], []);

  // styles
  const classes = useStyles();

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

  // rendering stuff
  const renderMenuItemListForLargeScreen: () => React.ReactNode = () => {
    return menuItemList.map((menuItem: MenuItemType) => {
      return (
        <Link key={menuItem.url}
          color="inherit"
          className={classes.menuItem}
          component={RRLink}
          to={menuItem.url}
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
        <Badge badgeContent={4} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      {(isMdUp &&
        renderMenuItemListForLargeScreen()
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
          </Menu>
        </React.Fragment>
      )}
    </Grid>
  )
}

export default MemberHeaderMenuItems
