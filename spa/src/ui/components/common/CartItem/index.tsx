import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { CartItemType } from 'domain/cart/types';
import * as React from 'react';
import SampleSelfImage from 'static/self.jpeg';
import ColorCell from '../GridData/ColorCell';
import SizeCell from '../GridData/SizeCell';

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface CartItemPropsType {
  value: CartItemType
  onChange?: React.EventHandler<React.ChangeEvent<HTMLInputElement>>
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1)
    },
    card: {
    },
    cardHeader: {
      width: "100%",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
    },
    details: {
      flexGrow: 1,
    },
    media: {
      width: 200,
    },
    actionBox: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "nowrap",
      alignItems: "center",
    }
  }),
);

/**
 * member or admin account management component
 **/
const CartItem: React.FunctionComponent<CartItemPropsType> = ({ value, onChange }) => {

  // mui: makeStyles
  const classes = useStyles();

  // event handlers
  
  /// qty change
  const handleQtyIncrement: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    
    if (value.quantity < value.variant.variantStock) {
      /**
       * update request to redux and redux-saga
       *
       **/
    }
  }

  const handleQtyDecrement: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    if (value.quantity > 1) {
      /**
       * update request to redux and redux-saga
       *
       **/
    }
  }

  /// selection change
  const handleSelectionChange: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    /**
     * update selection  to redux and redux-saga
     **/
  }
  

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Avatar alt="" src={SampleSelfImage} />}
        title={value.product.productName}
        subheader={`$${value.product.productBaseUnitPrice} NEED TO FIX`}
      >
      </CardHeader>
      <CardActions>
        <Grid
          container
          justify="space-between"
        >
          <Box component="div" className={classes.actionBox}>
            <ColorCell value={value.variant.variantColor} />
            <SizeCell value={value.variant.variantSize.productSizeName} />
          </Box>
          <Box component="div" className={classes.actionBox}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button 
                onClick={handleQtyIncrement}  
                disabled={value.quantity === value.variant.variantStock}
              >
                <AddCircleIcon />
              </Button>
              <Button disabled>{value.quantity}</Button>
              <Button 
                onClick={handleQtyDecrement}
                disabled={value.quantity === 1}
              >
                <RemoveCircleIcon />
              </Button>
            </ButtonGroup>
            <Switch
              edge="end"
              onChange={onChange}
              checked={value.isSelected}
              inputProps={{ 'aria-labelledby': 'switch-list-label-selected-cart-item' }}
            />
            <IconButton>
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        </Grid>
      </CardActions>
    </Card>
  )
}

export default CartItem

