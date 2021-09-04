import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import { logger } from "configs/logger";
import { isReachMaxQuantity } from "domain/cart";
import { CartItemCriteria, CartItemType } from "domain/cart/types";
import merge from "lodash/merge";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartItemActions } from "reducers/slices/domain/cartItem";
import { UserTypeEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { cadCurrencyFormat, getApiUrl } from "src/utils";
import ColorCell from "../GridData/ColorCell";
import SizeCell from "../GridData/SizeCell";
const log = logger(__filename);

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface CartItemPropsType {
  value: CartItemType;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
    },
    card: {
      /**
       * need this one to make vertical scrollbar appears of the parent drawer.
       **/

      /**
       * when small screen, the controller of a cart item moves to the next row, so need "157px".
       *
       * otherwise, it is single row, so need "133px".
       **/
      minHeight: "157px",

      [theme.breakpoints.up("sm")]: {
        minHeight: "133px",
      },
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
    btnRoot: {
      "&:disabled": {
        color: "#000",
      },
    },
    actionBox: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "nowrap",
      alignItems: "center",
    },
  })
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
  const auth = useSelector(mSelector.makeAuthSelector());

  const dispatch = useDispatch();
  // event handlers

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  /// qty change
  const handleQtyIncrement: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    // max quantity = 10
    if (isReachMaxQuantity(value.quantity)) {
      return false;
    }

    if (value.quantity < value.product.variants[0].variantStock) {
      const nextCartItem = merge({}, value, { quantity: value.quantity + 1 });

      if (auth.userType === UserTypeEnum.MEMBER) {
        // put to replace the whole cart item
        api
          .request({
            method: "PUT",
            url:
              API1_URL +
              `/users/${auth.user.userId}/cartItems/${value.cartItemId}`,
            data: {
              cartItemId: nextCartItem.cartItemId,
              isSelected: nextCartItem.isSelected,
              quantity: nextCartItem.quantity,
              userId: nextCartItem.user.userId,
              variantId: nextCartItem.product.variants[0].variantId,
            } as CartItemCriteria,
          })
          .then((data) => {
            const updatedCartItem = data.data;

            // update cart item in redux store
            dispatch(cartItemActions.updateOne(updatedCartItem));

            enqueueSnackbar("updated successfully.", { variant: "success" });
          })
          .catch((error: AxiosError) => {
            enqueueSnackbar(error.message, { variant: "error" });
          });
      } else {
        // update cart item in redux store
        dispatch(cartItemActions.updateOne(nextCartItem));
      }
    }
  };

  const handleQtyDecrement: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    if (value.quantity > 1) {
      const nextCartItem = merge({}, value, { quantity: value.quantity - 1 });

      if (auth.userType === UserTypeEnum.MEMBER) {
        // put to replace the whole cart item
        api
          .request({
            method: "PUT",
            url:
              API1_URL +
              `/users/${auth.user.userId}/cartItems/${value.cartItemId}`,
            data: {
              cartItemId: nextCartItem.cartItemId,
              isSelected: nextCartItem.isSelected,
              quantity: nextCartItem.quantity,
              userId: nextCartItem.user.userId,
              variantId: nextCartItem.product.variants[0].variantId,
            } as CartItemCriteria,
          })
          .then((data) => {
            const updatedCartItem = data.data;

            // update cart item in redux store
            dispatch(cartItemActions.updateOne(updatedCartItem));

            enqueueSnackbar("updated successfully.", { variant: "success" });
          })
          .catch((error: AxiosError) => {
            enqueueSnackbar(error.message, { variant: "error" });
          });
      } else {
        // update cart item in redux store
        dispatch(cartItemActions.updateOne(nextCartItem));
      }
    }
  };

  /// selection change
  const handleSelectionChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * update selection  to redux and redux-saga
     **/
    const nextCartItem = merge({}, value, {
      isSelected: e.currentTarget.checked,
    });

    log("target cart item id: " + value.cartItemId);

    if (auth.userType === UserTypeEnum.MEMBER) {
      // put to replace the whole cart item
      api
        .request({
          method: "PUT",
          url:
            API1_URL +
            `/users/${auth.user.userId}/cartItems/${value.cartItemId}`,
          data: {
            cartItemId: nextCartItem.cartItemId,
            isSelected: nextCartItem.isSelected,
            quantity: nextCartItem.quantity,
            userId: nextCartItem.user.userId,
            variantId: nextCartItem.product.variants[0].variantId,
          } as CartItemCriteria,
        })
        .then((data) => {
          const updatedCartItem = data.data;

          log(updatedCartItem);

          // update cart item in redux store
          dispatch(cartItemActions.updateOne(updatedCartItem));

          enqueueSnackbar("updated successfully.", { variant: "success" });
        })
        .catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" });
        });
    } else {
      // update cart item in redux store
      dispatch(cartItemActions.updateOne(nextCartItem));
    }
  };

  /// selection change
  const handleDeleteClick: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    /**
     * update selection  to redux and redux-saga
     **/
    if (auth.userType === UserTypeEnum.MEMBER) {
      // put to replace the whole cart item
      api
        .request({
          method: "DELETE",
          url:
            API1_URL +
            `/users/${auth.user.userId}/cartItems/${value.cartItemId}`,
        })
        .then((data) => {
          // update cart item in redux store
          dispatch(cartItemActions.delete(value));

          enqueueSnackbar("updated successfully.", { variant: "success" });
        })
        .catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" });
        });
    } else {
      // update cart item in redux store
      dispatch(cartItemActions.delete(value));
    }
  };

  const primaryImageUrl =
    value.product.productImages.length > 0
      ? getApiUrl(value.product.productImages[0].productImagePath)
      : null;

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Avatar alt="" src={primaryImageUrl} />}
        title={value.product.productName}
        subheader={`${cadCurrencyFormat(
          value.product.variants[0].currentPrice
        )}`}
      ></CardHeader>
      <CardActions>
        <Grid container justify="space-between">
          <Box component="div" className={classes.actionBox}>
            <ColorCell value={value.product.variants[0].variantColor} />
            <SizeCell
              value={value.product.variants[0].productSize.productSizeName}
            />
          </Box>
          <Box component="div" className={classes.actionBox}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              {/** don't use <IconButton> inside <ButtonGroup>, it causes errors e.g., 'fullwidth' 'disableelevation unrecognaized property. use lowercase... **/}
              <Button onClick={handleQtyIncrement} variant="contained">
                <AddCircleIcon />
              </Button>
              <Button variant="contained">{value.quantity}</Button>
              <Button onClick={handleQtyDecrement} variant="contained">
                <RemoveCircleIcon />
              </Button>
            </ButtonGroup>
            <Switch
              edge="end"
              onChange={handleSelectionChange}
              checked={value.isSelected}
              inputProps={{
                "aria-labelledby": "switch-list-label-selected-cart-item",
              }}
            />
            <IconButton onClick={handleDeleteClick}>
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default CartItem;
