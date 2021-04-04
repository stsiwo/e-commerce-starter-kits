import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CategoryIcon from '@material-ui/icons/Category';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RateReviewIcon from '@material-ui/icons/RateReview';
import ShopIcon from '@material-ui/icons/Shop';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import * as React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppsIcon from '@material-ui/icons/Apps';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import AdminProductForm from './AdminProductForm';

declare type AdminProductFormDrawerPropsType = {
  curProductFormOpen: boolean
  setProductFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    /**
     * parent component is div[display="flex"] to display Nav and Content horizontally.
     **/
    drawer: {
      width: 240,
      flexShrink: 0,
      zIndex: 0,
    },
    drawerPaper: {
      width: 240,
    },
    toolbar: theme.mixins.toolbar,
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(1),
      fontWeight: theme.typography.fontWeightBold,
    },
    toggleBtnBox: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
    },
  }),
);

const AdminProductFormDrawer: React.FunctionComponent<AdminProductFormDrawerPropsType> = (props) => {

  // used to switch 'permanent' or 'temporary' nav menu based on this screen size 
  const theme = useTheme();


  const classes = useStyles();

  const toggleDrawer = (nextOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {

    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    props.setProductFormOpen(nextOpen);
  }

  const handleNavToggleClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    props.setProductFormOpen(!props.curProductFormOpen);
  }

  // render function

  // render nav items
  return (
    <React.Fragment>
      <Drawer
        className={classes.drawer}
        variant={'temporary'}
        anchor="right"
        open={props.curProductFormOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <AdminProductForm />
      </Drawer>
    </React.Fragment>
  )
}

export default AdminProductFormDrawer


