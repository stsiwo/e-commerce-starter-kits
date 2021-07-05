import Dialog from '@material-ui/core/Dialog';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import * as React from 'react';
import AdminProductForm from '../AdminProductForm';
import { ProductType } from 'domain/product/types';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';

declare type AdminProductFormDialogPropsType = {
  curFormOpen: boolean
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
  curProduct: ProductType
}

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
      position: 'fixed',
      bottom: '10px',
      right: '10px',
    },
  }),
);

const AdminProductFormDialog: React.FunctionComponent<AdminProductFormDialogPropsType> = (props) => {

  // used to switch 'permanent' or 'temporary' nav menu based on this screen size 
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDialog = (nextOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {

    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    props.setFormOpen(nextOpen);
  }

  /**
   * call child function from parent 
   *
   * - ref: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
   *
   **/
  const childRef = React.useRef(null);

  // render nav items
  return (
    <Dialog fullScreen={fullScreen} open={props.curFormOpen} onClose={toggleDialog(false)} aria-labelledby="admin-product-form-dialog">
      <DialogTitle id="admin-product-form-dialog-title">Product Form</DialogTitle>
      <DialogContent classes={{
        root: classes.dialogContentRoot,
      }}>
        <AdminProductForm product={props.curProduct} ref={childRef}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDialog(false)} variant="contained">
          Cancel
        </Button>
        <Button onClick={(e) => childRef.current.handleSaveClickEvent(e)} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AdminProductFormDialog



