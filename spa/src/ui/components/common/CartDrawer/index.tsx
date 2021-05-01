import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import Drawer from '@material-ui/core/Drawer';
import CartBox from '../CartBox';
import { useDispatch, useSelector } from 'react-redux';
import { cartModalActions } from 'reducers/slices/ui';
import { mSelector } from 'src/selectors/selector';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import { IconButton } from '@material-ui/core';

/**
 * TODO: enable scrollbar (vertical) on this drawer.
 *
 * i thought it is default, but not showing.
 *
 **/

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(3)
    },
    drawer: {
      flexShrink: 0,
      zIndex: 0,

      [theme.breakpoints.down('xs')]: {
        width: "100%",
      }
    },
    drawerPaper: {
      [theme.breakpoints.down('xs')]: {
        width: "100%",
      }
    },
    toolbar: theme.mixins.toolbar,
    closeBtn: {
      position: "absolute",
      top: 0,
      right: 0,
    }
  }),
);

const CartDrawer: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const dispatch = useDispatch();

  const curCartOpen = useSelector(mSelector.makeCartModalSelector())

  const toggleDrawer = (nextOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    dispatch(cartModalActions.update(nextOpen));
  }

  return (
    <Drawer
      className={classes.drawer}
      variant={'temporary'}
      anchor="right"
      open={curCartOpen}
      onClose={toggleDrawer(false)}
      classes={{
        paper: classes.drawerPaper,
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {/**<div className={classes.toolbar} />**/}
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Cart"}
      </Typography>
      <CartBox />
      <IconButton onClick={toggleDrawer(false)} className={classes.closeBtn}>
        <CancelIcon />
      </IconButton>
    </Drawer>
  )
}

export default CartDrawer





