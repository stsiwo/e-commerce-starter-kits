import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { WishlistItemType } from "domain/wishlist/types";
import { useWaitResponse } from "hooks/waitResponse";
import * as React from "react";
import { useSelector } from "react-redux";
import { Link as RRLink } from "react-router-dom";
import { rsSelector } from "src/selectors/selector";
import { cadCurrencyFormat, getApiUrl } from "src/utils";
import ColorCell from "../GridData/ColorCell";
import SizeCell from "../GridData/SizeCell";

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface WishlistItemPropsType {
  value: WishlistItemType;
  onMoveToCartClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
  onDelete?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
    },
    card: {},
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
    },
    anchor: {
      textDecoration: "none",
      color: "inherit",
    },
  })
);

/**
 * member or admin account management component
 **/
const WishlistItem: React.FunctionComponent<WishlistItemPropsType> = ({
  value,
  onMoveToCartClick,
  onDelete,
}) => {
  // mui: makeStyles
  const classes = useStyles();

  const primaryImageUrl =
    value.product.productImages.length > 0
      ? getApiUrl(value.product.productImages[0].productImagePath)
      : null;

  /**
   * avoid multiple click submission
   */
  const curPatchFetchStatus = useSelector(
    rsSelector.app.getPatchWishlistItemFetchStatus
  );
  const curDeleteFetchStatus = useSelector(
    rsSelector.app.getDeleteWishlistItemFetchStatus
  );
  const { curDisableBtnStatus: curDisablePatchBtnStatus } = useWaitResponse({
    fetchStatus: curPatchFetchStatus,
  });
  const { curDisableBtnStatus: curDisableDeleteBtnStatus } = useWaitResponse({
    fetchStatus: curDeleteFetchStatus,
  });

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <RRLink
        to={`/products/${value.product.productPath}`}
        className={classes.anchor}
      >
        <CardHeader
          className={classes.cardHeader}
          avatar={<Avatar alt="" src={primaryImageUrl} />}
          title={value.product.productName}
          subheader={`${cadCurrencyFormat(
            value.product.variants[0].currentPrice
          )}`}
        ></CardHeader>
      </RRLink>
      <CardActions>
        <Grid container justify="space-between">
          <Box component="div" className={classes.actionBox}>
            <ColorCell value={value.product.variants[0].variantColor} />
            <SizeCell
              value={value.product.variants[0].productSize.productSizeName}
            />
          </Box>
          <Box component="div" className={classes.actionBox}>
            <Button
              startIcon={<AddShoppingCartIcon />}
              onClick={onMoveToCartClick}
              data-wishlist-id={value.wishlistItemId}
              variant="contained"
              disabled={curDisablePatchBtnStatus}
            >
              Move To Cart
            </Button>
            <IconButton
              onClick={onDelete}
              data-wishlist-id={value.wishlistItemId}
              disabled={curDisableDeleteBtnStatus}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default WishlistItem;
