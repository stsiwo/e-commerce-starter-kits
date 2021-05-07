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
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { CartItemType } from 'domain/cart/types';
import merge from 'lodash/merge';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartItemActions } from 'reducers/slices/domain/cartItem';
import { UserTypeEnum } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import SampleSelfImage from 'static/self.jpeg';
import ColorCell from '../GridData/ColorCell';
import SizeCell from '../GridData/SizeCell';

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface CartItemPropsType {
  value: CartItemType
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
 *  cart item component
 *
 *  - value (cart item) should contain a single variant of a specific product.
 **/
const CartItem: React.FunctionComponent<CartItemPropsType> = ({ value }) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch()
  // event handlers

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  /// qty change
  const handleQtyIncrement: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    if (value.quantity < value.product.variants[0].variantStock) {

      const nextCartItem = merge({}, value, { quantity: value.quantity + 1 })

      if (auth.userType === UserTypeEnum.MEMBER) {
        // put to replace the whole cart item 
        api.request({
          method: 'PUT',
          url: API1_URL + `/users/${auth.user.userId}/cartItems/${value.cartId}`,
          data: JSON.stringify(nextCartItem)
        }).then((data) => {

          const updatedCartItem = data.data;

          // update cart item in redux store 
          dispatch(cartItemActions.merge([updatedCartItem]))

          enqueueSnackbar("updated successfully.", { variant: "success" })
        }).catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" })
        })
      } else {
        // update cart item in redux store 
        dispatch(cartItemActions.merge([nextCartItem]))
      }

    }
  }

  const handleQtyDecrement: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    if (value.quantity > 1) {

      const nextCartItem = merge({}, value, { quantity: value.quantity - 1 })

      if (auth.userType === UserTypeEnum.MEMBER) {
        // put to replace the whole cart item 
        api.request({
          method: 'PUT',
          url: API1_URL + `/users/${auth.user.userId}/cartItems/${value.cartId}`,
          data: JSON.stringify(nextCartItem)
        }).then((data) => {

          const updatedCartItem = data.data;

          // update cart item in redux store 
          dispatch(cartItemActions.merge([updatedCartItem]))

          enqueueSnackbar("updated successfully.", { variant: "success" })
        }).catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" })
        })
      } else {
        // update cart item in redux store 
        dispatch(cartItemActions.merge([nextCartItem]))
      }
    }
  }

  /// selection change
  const handleSelectionChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    /**
     * update selection  to redux and redux-saga
     **/
    const nextCartItem = merge({}, value, { isSelected: e.currentTarget.checked })

    if (auth.userType === UserTypeEnum.MEMBER) {
      // put to replace the whole cart item 
      api.request({
        method: 'PUT',
        url: API1_URL + `/users/${auth.user.userId}/cartItems/${value.cartId}`,
        data: JSON.stringify(nextCartItem)
      }).then((data) => {

        const updatedCartItem = data.data;

        // update cart item in redux store 
        dispatch(cartItemActions.merge([updatedCartItem]))

        enqueueSnackbar("updated successfully.", { variant: "success" })
      }).catch((error: AxiosError) => {
        enqueueSnackbar(error.message, { variant: "error" })
      })
    } else {
      // update cart item in redux store 
      dispatch(cartItemActions.merge([nextCartItem]))
    }
  }

  /// selection change
  const handleDeleteClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    /**
     * update selection  to redux and redux-saga
     **/
    if (auth.userType === UserTypeEnum.MEMBER) {
      // put to replace the whole cart item 
      api.request({
        method: 'DELETE',
        url: API1_URL + `/users/${auth.user.userId}/cartItems/${value.cartId}`,
      }).then((data) => {

        // update cart item in redux store 
        dispatch(cartItemActions.delete(value))

        enqueueSnackbar("updated successfully.", { variant: "success" })
      }).catch((error: AxiosError) => {
        enqueueSnackbar(error.message, { variant: "error" })
      })
    } else {
      // update cart item in redux store 
      dispatch(cartItemActions.delete(value))
    }
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
            <ColorCell value={value.product.variants[0].variantColor} />
            <SizeCell value={value.product.variants[0].productSize.productSizeName} />
          </Box>
          <Box component="div" className={classes.actionBox}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={handleQtyIncrement}
                disabled={value.quantity === value.product.variants[0].variantStock}
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
              onChange={handleSelectionChange}
              checked={value.isSelected}
              inputProps={{ 'aria-labelledby': 'switch-list-label-selected-cart-item' }}
            />
            <IconButton onClick={handleDeleteClick}>
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        </Grid>
      </CardActions>
    </Card>
  )
}

export default CartItem

