import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ProductVariantType } from "domain/product/types";
import { useWaitResponse } from "hooks/waitResponse";
import * as React from "react";
import { useSelector } from "react-redux";
import { rsSelector } from "src/selectors/selector";
import AdminProductVariantForm from "../AdminProductVariantForm";

declare type AdminProductVariantFormDialogPropsType = {
  curFormOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  curProductVariant: ProductVariantType;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    /**
     * parent component is div[display="flex"] to display Nav and Content horizontally.
     **/
    dialog: {
      width: 240,
      flexShrink: 0,
      zIndex: 0,
    },
    dialogPaper: {
      width: 240,
    },
    dialogContentRoot: {
      padding: theme.spacing(1),
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

const AdminProductVariantFormDialog: React.FunctionComponent<AdminProductVariantFormDialogPropsType> =
  (props) => {
    // used to switch 'permanent' or 'temporary' nav menu based on this screen size
    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleDialog =
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

    /**
     * call child function from parent
     *
     * - ref: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
     *
     **/
    const childRef = React.useRef(null);

    /**
     * avoid multiple click submission
     */
    const curPostFetchStatus = useSelector(
      rsSelector.app.getPostProductVariantFetchStatus
    );
    const curPutFetchStatus = useSelector(
      rsSelector.app.getPutProductVariantFetchStatus
    );
    const { curDisableBtnStatus: curDisablePostBtnStatus } = useWaitResponse({
      fetchStatus: curPostFetchStatus,
    });
    const { curDisableBtnStatus: curDisablePutBtnStatus } = useWaitResponse({
      fetchStatus: curPutFetchStatus,
    });

    // render nav items
    return (
      <Dialog
        fullScreen={fullScreen}
        open={props.curFormOpen}
        onClose={toggleDialog(false)}
        aria-labelledby="admin-productVariant-form-dialog"
      >
        <DialogTitle id="admin-productVariant-form-dialog-title">
          Product Variant Form
        </DialogTitle>
        <DialogContent
          classes={{
            root: classes.dialogContentRoot,
          }}
        >
          <AdminProductVariantForm
            productVariant={props.curProductVariant}
            ref={childRef}
            open={props.curFormOpen}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog(false)} variant="contained">
            Cancel
          </Button>
          <Button
            onClick={(e) => childRef.current.handleSaveClickEvent(e)}
            variant="contained"
            disabled={curDisablePostBtnStatus || curDisablePutBtnStatus}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default AdminProductVariantFormDialog;
