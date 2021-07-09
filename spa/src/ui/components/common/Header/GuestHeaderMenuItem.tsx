import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RRLink } from "react-router-dom";
import { cartModalActions } from 'reducers/slices/ui';
import { mSelector } from 'src/selectors/selector';
import { useLocation } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      margin: theme.spacing(0, 2, 0, 2),
      fontWeight: theme.typography.fontWeightBold
    },
  }),
);

const GuestHeaderMenuItems: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const dispatch = useDispatch();

  // cur cart item #
  const curNumberOfCartItems = useSelector(mSelector.makeNumberOfCartItemSelector());

  const handleCartModalOpenClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    dispatch(cartModalActions.toggle());
  }

  // disable cart icon when /checkout
  const location = useLocation()


  return (
    <Grid item>
      <Link color="inherit" className={classes.menuItem} component={RRLink} to="/login">
        Log In
      </Link>
      <Link color="inherit" className={classes.menuItem} component={RRLink} to="/signup">
        Sign Up
      </Link>
      {(location.pathname != "/checkout" &&
        <IconButton onClick={handleCartModalOpenClick}>
          <Badge badgeContent={curNumberOfCartItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      )}
    </Grid>
  )
}

export default GuestHeaderMenuItems



