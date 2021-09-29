import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import classNames from "classnames";
import { ProductType, ProductVariantType } from "domain/product/types";
import * as React from "react";
import { Link as RRLink } from "react-router-dom";
import { cadCurrencyFormat, getApiUrl } from "src/utils";
import { theme } from "ui/css/theme";

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface ProductHorizontalCardPropsType {
  product?: ProductType;
  variant?: ProductVariantType;
  imgLeft?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    featureBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
    },
    featureImgBox: {
      flex: "0 0 30%",
      width: "100%",
      minWidth: "300px",
      "& > img": {
        width: "100%",
        height: "auto",
      },
    },
    featureRightContentBox: {
      flex: "0 0 60%",
      textAlign: "left",
      padding: `${theme.spacing(2)}px`,
      minWidth: "300px",

      "& > .btn-control": {
        textAlign: "right",
      },
      [theme.breakpoints.down("md")]: {
        textAlign: "center",
        "& > .btn-control": {
          textAlign: "center",
        },
      },
    },
    featureLeftContentBox: {
      flex: "0 0 60%",
      textAlign: "right",
      padding: `0 ${theme.spacing(2)}px`,
      minWidth: "300px",

      "& > .btn-control": {
        textAlign: "left",
      },
      [theme.breakpoints.down("md")]: {
        textAlign: "center",
        "& > .btn-control": {
          textAlign: "center",
        },
      },
    },
    anchor: {
      textDecoration: "none",
      color: "inherit",
    },
    price: {
      color: theme.palette.fifth.main,
    },
  })
);

/**
 * member or admin account management component
 **/
const ProductHorizontalCardV2: React.FunctionComponent<ProductHorizontalCardPropsType> =
  ({ product, variant, imgLeft }) => {
    // mui: makeStyles
    const classes = useStyles();

    const themes = useTheme();
    const lteMd = useMediaQuery(themes.breakpoints.down("md"));

    const renderContent = (
      style: string,
      isRightImg: boolean
    ): React.ReactNode => {
      return (
        <Box
          component="div"
          className={classNames(style, { isRightImg: isRightImg })}
        >
          <Typography variant="body2" color="textSecondary" component="p">
            {product.category.categoryName}
          </Typography>
          <Typography gutterBottom variant="h6" component="h2" className={""}>
            {product.productName}
          </Typography>
          <Typography gutterBottom variant="body2" component="p" className={""}>
            {product.productDescription}
          </Typography>
          <Typography variant="body2" component="p" className={classes.price}>
            <b>{cadCurrencyFormat(product.cheapestPrice)} ~</b>
          </Typography>
          <Box component="div" className="btn-control">
            <Button
              component={RRLink}
              to={`/products/${product.productPath}`}
              variant="contained"
            >
              Read More
            </Button>
          </Box>
        </Box>
      );
    };

    const primaryImageUrl =
      product.productImages.length > 0
        ? getApiUrl(product.productImages[0].productImagePath)
        : null;

    const renderImg = (): React.ReactNode => {
      return (
        <Box component="div" className={classes.featureImgBox}>
          <img
            className={""}
            src={primaryImageUrl}
            alt={`${product.productName} Image`}
          />
        </Box>
      );
    };

    console.log("down md: " + theme.breakpoints.down("md"));

    return (
      product && (
        <RRLink
          to={`/products/${product.productPath}`}
          className={classNames(classes.anchor, classes.featureBox)}
        >
          {imgLeft || lteMd ? (
            <React.Fragment>
              {renderImg()}
              {renderContent(classes.featureRightContentBox, false)}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {renderContent(classes.featureLeftContentBox, true)}
              {renderImg()}
            </React.Fragment>
          )}
        </RRLink>
      )
    );
  };

export default ProductHorizontalCardV2;
