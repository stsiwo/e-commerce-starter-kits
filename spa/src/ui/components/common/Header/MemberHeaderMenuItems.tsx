import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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
        <Link key={menuItem.url} href={menuItem.url} color="inherit" className={classes.menuItem}>
          {menuItem.label}
        </Link>
      )
    })
  }

  const renderMenuItemListForSmallScreen: () => React.ReactNode = () => {
    return menuItemList.map((menuItem: MenuItemType) => {
      return (
        <MenuItem key={menuItem.url} onClick={handleDropDownMenuCloseClickEvent}>
          <Link href={menuItem.url} color="inherit" className={classes.menuItem}>
            {menuItem.label}
          </Link>
        </MenuItem>
      )
    })
  }

  return (
    <Grid item>
      <Typography >
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
      </Typography>
    </Grid>
  )
}

export default MemberHeaderMenuItems




