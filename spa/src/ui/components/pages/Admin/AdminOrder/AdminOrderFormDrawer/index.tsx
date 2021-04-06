import Drawer from '@material-ui/core/Drawer';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import * as React from 'react';
import AdminOrderForm from '../AdminOrderForm';

declare type AdminOrderFormDrawerPropsType = {
  curFormOpen: boolean
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    /**
     * parent component is div[display="flex"] to display Nav and Content horizontally.
     **/
    drawer: {
      flexShrink: 0,
      zIndex: 0,
    },
    drawerPaper: {
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

const AdminOrderFormDrawer: React.FunctionComponent<AdminOrderFormDrawerPropsType> = (props) => {

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

    props.setFormOpen(nextOpen);
  }

  const handleNavToggleClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    props.setFormOpen(!props.curFormOpen);
  }

  // render function

  // render nav items
  return (
    <React.Fragment>
      <Drawer
        className={classes.drawer}
        variant={'temporary'}
        anchor="bottom"
        open={props.curFormOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <AdminOrderForm />
      </Drawer>
    </React.Fragment>
  )
}

export default AdminOrderFormDrawer




