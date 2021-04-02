import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CategoryIcon from '@material-ui/icons/Category';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RateReviewIcon from '@material-ui/icons/RateReview';
import ShopIcon from '@material-ui/icons/Shop';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import * as React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';

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
  }),
);

const AdminNavDrawer: React.FunctionComponent<{}> = (props) => {


  const navList = [
    {
      title: "General",
      items: [
        {
          label: "Dashboard",
          Icon: DashboardIcon,
          link: "/admin/",
        },
        {
          label: "Account",
          Icon: AccountCircleIcon,
          link: "/admin/account",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          label: "Products",
          Icon: FavoriteIcon,
          link: "/admin/products",
        },
        {
          label: "Categories",
          Icon: CategoryIcon,
          link: "/admin/categories",
        },
        {
          label: "Orders",
          Icon: ShopIcon,
          link: "/admin/orders",
        },
        {
          label: "Reviews",
          Icon: RateReviewIcon,
          link: "/admin/reviews",
        },
        {
          label: "Customers",
          Icon: SupervisedUserCircleIcon,
          link: "/admin/customers",
        },
      ],
    },
  ]

  const [curAdminNavOpen, setAdminNavOpen] = React.useState<boolean>(false);

  const classes = useStyles();

  const toggleDrawer: () => void = () => {
    setAdminNavOpen(!curAdminNavOpen);
  }

  // render function

  // render nav items
  const renderNavItems: () => React.ReactNode = () => {
    return navList.map((navSection) => {
      return (
        <React.Fragment>
          <Typography variant="body1" component="p" align="left" className={classes.title} >
            {navSection.title}
          </Typography>
          <List>
            {navSection.items.map((navItem, index) => {
              const NavIcon = navItem.Icon;
              return (
                <ListItem button key={navItem.link}>
                  <ListItemIcon><NavIcon /></ListItemIcon>
                  <ListItemText primary={navItem.label} />
                </ListItem>
              )
            })}
          </List>
        </React.Fragment>
      )
    })
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      anchor="left"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      {renderNavItems()}
    </Drawer>
  )
}

export default AdminNavDrawer

