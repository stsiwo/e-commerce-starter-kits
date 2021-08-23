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
import Box from '@material-ui/core/Box';

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

      padding: `0 ${theme.spacing(1)}px`,
      overflowY: "scroll",
      backgroundColor: theme.palette.third.main, 
      maxWidth: 400,

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
      anchor="right"
      open={curCartOpen}
      onClose={toggleDrawer(false)}
      classes={{
        paper: classes.drawerPaper,
      }}
      ModalProps={{
        keepMounted: false, // make this false. otherwise, every time when page change, this send an api request to fetch current cart items. (keepMouted: true => Better open performance on mobile).
      }}
    >
      {/** need this wrapper to prevent overflow of content inside CartBox **/}
      <Box>
        {/**<div className={classes.toolbar} />**/}
        <Typography variant="h5" component="h5" align="center" className={classes.title} >
          {"Cart"}
        </Typography>
        <CartBox toggleDrawer={toggleDrawer}/>
        <IconButton onClick={toggleDrawer(false)} className={classes.closeBtn}>
          <CancelIcon />
        </IconButton>
      </Box>
    </Drawer>
  )
}

export default CartDrawer





