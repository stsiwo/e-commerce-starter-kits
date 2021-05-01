import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CartBox from 'components/common/CartBox';
import * as React from 'react';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center"
    }
  }),
);

/**
 * member & guest cart management page
 *
 * steps: 
 *
 *  1. retrieve cart item list from redux state
 *
 *  2. display on this dumb component
 *
 *  3. when the user updates (e.g., select, remove), dispatch following actions:
 *
 *    3.1: select: 
 *      (MEMBER): send api request (/users/{userId}/cart PATCH: partial update) 
 *      (GUEST): just only update redux state
 *
 *    3.2: remove: need to remove the selected item
 *      (MEMBER): send api request (/users/{userId}/cart/{cartId} DELETE: delete) 
 *      (GUEST): just only update redux state
 *
 *    3.3: increment/decrement quantity
 *      (MEMBER): send api request (/users/{userId}/cart PATCH: partial update) 
 *      (GUEST): just only update redux state
 *      
 *  4. received updated state from redux
 *
 *  5. display updated state on this dumb component again
 *      
 *
 **/
const Cart: React.FunctionComponent<{}> = (props) => {


  const classes = useStyles();

  const dispatch = useDispatch()

  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Cart"}
      </Typography>
      <CartBox />
    </React.Fragment>
  )
}

export default Cart

