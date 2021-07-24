import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import HelpIcon from "@material-ui/icons/Help";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CategoryIcon from "@material-ui/icons/Category";
import FavoriteIcon from "@material-ui/icons/Favorite";
import RateReviewIcon from "@material-ui/icons/RateReview";
import ShopIcon from "@material-ui/icons/Shop";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import * as React from "react";
import DashboardIcon from "@material-ui/icons/Dashboard";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppsIcon from "@material-ui/icons/Apps";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import { Link as RRLink } from "react-router-dom";

export declare type NavDataItemType = {
  label: string;
  Icon: React.FunctionComponent;
  link: string;
  desc?: string;
};

export declare type NavDataType = {
  title: string;
  items: NavDataItemType[];
};

export const adminNavData: NavDataType[] = [
  {
    title: "General",
    items: [
      {
        label: "Dashboard",
        Icon: DashboardIcon,
        link: "/admin",
      },
      {
        label: "Account",
        Icon: AccountCircleIcon,
        link: "/admin/account",
        desc: "Manage your account information including your personal contact and your company information. Your company information is published so that visitors can communicate with you.",
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
        desc: "Manage your products including adding a new product, updating an exiting product, and delete an unecessary one. Each product must have at least one variant (e.g., different color and size) to be published.",
      },
      {
        label: "Categories",
        Icon: CategoryIcon,
        link: "/admin/categories",
        desc: "Manage your categories such as adding a new category, updating an existing category, and delete an unecessary category. Use this category to logically group your product for better organization.",
      },
      {
        label: "Orders",
        Icon: ShopIcon,
        link: "/admin/orders",
        desc: "Manage your orders. We will notifiy if a new order is arrived via email and notification in this app. You can update the order status of any order and any update will also notify the customer via email and the notification.",
      },
      {
        label: "Reviews",
        Icon: RateReviewIcon,
        link: "/admin/reviews",
        desc: "Manage your reviews. We will notify if a new review is submitted or existing review is modified by the customer. Your responsibility is to verify the review so that it helps increase conversion rate for the other customer.",
      },
      {
        label: "Customers",
        Icon: SupervisedUserCircleIcon,
        link: "/admin/customers",
        desc: "Manage your customers. You can update any information of any customer. Also, you can change the active satus of those user so if a customer did suspcious behavior using his account, you can disable this account as you like.",
      },
    ],
  },
  {
    title: "Documentation",
    items: [
      {
        label: "User Guide",
        Icon: HelpIcon,
        link: "/admin/user-guide",
        desc: "Need help? If you don't know how to use some of the features, Please visit here and check the usage.",
      },
    ],
  },
];

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

      [theme.breakpoints.up("md")]: {
        backgroundColor: "transparent",
        borderRight: 0,
      },
    },
    toolbar: theme.mixins.toolbar,
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(1),
      fontWeight: theme.typography.fontWeightBold,
    },
    toggleBtnBox: {
      position: "fixed",
      bottom: "10px",
      left: "10px",
      zIndex: 1200,
    },
  })
);

const AdminNavDrawer: React.FunctionComponent<{}> = (props) => {
  // used to switch 'permanent' or 'temporary' nav menu based on this screen size
  const theme = useTheme();
  const isDownSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [curAdminNavOpen, setAdminNavOpen] = React.useState<boolean>(false);

  const classes = useStyles();

  const toggleDrawer =
    (nextOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setAdminNavOpen(nextOpen);
    };

  const handleNavToggleClickEvent: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    setAdminNavOpen(!curAdminNavOpen);
  };

  // render function

  // render nav items
  const renderNavItems: () => React.ReactNode = () => {
    return adminNavData.map((navSection) => {
      return (
        <React.Fragment key={navSection.title}>
          <Typography
            variant="body1"
            component="p"
            align="left"
            className={classes.title}
          >
            {navSection.title}
          </Typography>
          <List>
            {navSection.items.map((navItem, index) => {
              const NavIcon = navItem.Icon;
              return (
                <ListItem
                  button
                  key={navItem.link}
                  component={RRLink}
                  to={navItem.link}
                >
                  <ListItemIcon>
                    <NavIcon />
                  </ListItemIcon>
                  <ListItemText primary={navItem.label} />
                </ListItem>
              );
            })}
          </List>
        </React.Fragment>
      );
    });
  };

  return (
    <React.Fragment>
      <Drawer
        className={classes.drawer}
        variant={isDownSm ? "temporary" : "permanent"}
        anchor="left"
        open={curAdminNavOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {!isDownSm && <div className={classes.toolbar} />}
        {renderNavItems()}
      </Drawer>
      {isDownSm && (
        <Box component="div" className={classes.toggleBtnBox}>
          <IconButton onClick={handleNavToggleClickEvent}>
            <AppsIcon />
          </IconButton>
        </Box>
      )}
    </React.Fragment>
  );
};

export default AdminNavDrawer;
