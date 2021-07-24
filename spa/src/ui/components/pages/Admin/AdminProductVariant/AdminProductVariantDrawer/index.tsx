import Drawer from "@material-ui/core/Drawer";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import * as React from "react";
import AdminProductVariantForm from "../AdminProductVariantForm";
import { ProductVariantType } from "domain/product/types";

declare type AdminProductVariantFormDrawerPropsType = {
  curFormOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productVariant: ProductVariantType;
};

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
      position: "fixed",
      bottom: "10px",
      right: "10px",
    },
  })
);

const AdminProductVariantFormDrawer: React.FunctionComponent<AdminProductVariantFormDrawerPropsType> =
  (props) => {
    // used to switch 'permanent' or 'temporary' nav menu based on this screen size
    const theme = useTheme();

    const classes = useStyles();

    const toggleDrawer =
      (nextOpen: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        props.setFormOpen(nextOpen);
      };

    const handleNavToggleClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      props.setFormOpen(!props.curFormOpen);
    };

    // render function

    // render nav items
    return (
      <React.Fragment>
        <Drawer
          className={classes.drawer}
          variant={"temporary"}
          anchor="right"
          open={props.curFormOpen}
          onClose={toggleDrawer(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <AdminProductVariantForm
            productVariant={props.productVariant}
            open={props.curFormOpen}
          />
        </Drawer>
      </React.Fragment>
    );
  };

export default AdminProductVariantFormDrawer;
