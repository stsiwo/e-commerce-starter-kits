import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ColorCell from "components/common/GridData/ColorCell";
import SizeCell from "components/common/GridData/SizeCell";
import { OrderDetailType } from "domain/order/types";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { mSelector } from "src/selectors/selector";
import { cadCurrencyFormat, getApiUrl } from "src/utils";

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface ProductHorizontalCardPropsType {
  orderDetail?: OrderDetailType;
  menu?: React.ReactElement;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: `${theme.spacing(1)}px auto`,
      maxWidth: 700,
    },
    card: {
      display: "flex",
      flexWrap: "nowrap",
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
    },
  })
);

/**
 * member or admin account management component
 **/
const OrderProductHorizontalCard: React.FunctionComponent<ProductHorizontalCardPropsType> =
  ({ orderDetail, menu }) => {
    // mui: makeStyles
    const classes = useStyles();

    const history = useHistory();

    const auth = useSelector(mSelector.makeAuthSelector());

    /**
     * if the product is available (e.g., not null), display teh primary image.
     **/
    const primaryImageUrl =
      orderDetail.product && orderDetail.product.productImages.length > 0
        ? getApiUrl(orderDetail.product.productImages[0].productImagePath)
        : null;

    const renderPrimaryImage = (url: string) => {
      if (url) {
        return <Avatar alt="" src={primaryImageUrl} />;
      } else {
        return (
          <Avatar>
            <FavoriteIcon />
          </Avatar>
        );
      }
    };

    return (
      <Card className={`${classes.card} ${classes.root}`}>
        <CardHeader
          className={classes.cardHeader}
          avatar={renderPrimaryImage(primaryImageUrl)}
          title={orderDetail.productName}
          subheader={`${cadCurrencyFormat(orderDetail.productUnitPrice)} x${
            orderDetail.productQuantity
          }`}
          action={
            <Box component="div" className={classes.actionBox}>
              <ColorCell value={orderDetail.productColor} />
              <SizeCell value={orderDetail.productSize} />
              {menu}
            </Box>
          }
        ></CardHeader>
      </Card>
    );
  };

export default OrderProductHorizontalCard;
