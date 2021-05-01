import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Link as RRLink } from "react-router-dom";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { useDispatch } from 'react-redux';
import { cartModalActions } from 'reducers/slices/ui';
import { constructLinkWrapper } from 'src/componentUtils';

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

  /**
   * TODO: create cart state in redux to keep track of products for guest users
   *
   *    - need to be persist in local storage/session storage otherwise, the data is vanished after refresh
   *
   **/

  const dispatch = useDispatch();

  const handleCartModalOpenClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    dispatch(cartModalActions.toggle());
  }

  return (
    <Grid item>
      <Link color="inherit" className={classes.menuItem} component={RRLink} to="/login">
        Log In
      </Link>
      <Link color="inherit" className={classes.menuItem} component={RRLink} to="/signup">
        Sign Up
      </Link>
      <IconButton onClick={handleCartModalOpenClick}>
        <Badge badgeContent={4} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Grid>
  )
}

export default GuestHeaderMenuItems



