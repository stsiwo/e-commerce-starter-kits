import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ColorCell from "components/common/GridData/ColorCell";
import SizeCell from "components/common/GridData/SizeCell";
import { CartItemType } from "domain/cart/types";
import * as React from "react";
import { cadCurrencyFormat, getApiUrl } from "src/utils";

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface CartItemConfirmCardPropsType {
  value: CartItemType;
  onChange?: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
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
    action: {
      alignSelf: "center",
      marginTop: 0,
      marginRight: 0,
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
    cardActions: {
      display: "flex",
      justifyContent: "flex-end",
    },
  })
);

/**
 * member or admin account management component
 **/
const CartItemConfirmCard: React.FunctionComponent<CartItemConfirmCardPropsType> =
  ({ value, onChange }) => {
    // mui: makeStyles
    const classes = useStyles();

    // event handlers

    const primaryImageUrl =
      value.product.productImages.length > 0
        ? getApiUrl(value.product.productImages[0].productImagePath)
        : null;

    return (
      <Card className={`${classes.card} ${classes.root}`}>
        <CardHeader
          className={classes.cardHeader}
          // you can override the style of deeper element of Mui with 'classes' props
          // check the api document for your target component (e.g., CartHeader) to choose which element you are going to override
          classes={{
            action: classes.action,
          }}
          avatar={<Avatar alt="" src={primaryImageUrl} />}
          title={value.product.productName}
          subheader={`${cadCurrencyFormat(
            value.product.variants[0].currentPrice
          )}`}
        ></CardHeader>
        <CardActions className={classes.cardActions}>
          <ColorCell value={value.product.variants[0].variantColor} />
          <SizeCell
            value={value.product.variants[0].productSize.productSizeName}
          />
          <Typography variant="subtitle1" component="p">
            x<b>{`${value.quantity}`}</b>
          </Typography>
        </CardActions>
      </Card>
    );
  };

export default CartItemConfirmCard;
