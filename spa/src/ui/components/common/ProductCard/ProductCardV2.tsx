import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ProductType } from "domain/product/types";
import * as React from "react";
import { cadCurrencyFormat, getApiUrl } from "src/utils";
import CornerRibbon from "../CornerRibbon";
import Box from "@material-ui/core/Box";
import { Link as RRLink } from "react-router-dom";

declare type ProductCardV2PropsType = {
  product: ProductType;
};

/**
 * make card actions align bottom to look nice esp when each card height is different.
 *
 * - ref: https://stackoverflow.com/questions/52669681/align-card-buttons-on-bottom-material-ui
 *
 * - parent:position:relative and child:position:absolute does not work!!
 *
 * - use parent:flex and child:marginXXX:auto
 *
 **/
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      position: "relative",
      height: "100%",
    },
    card: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",

      marginTop: "auto",
    },
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: "100%",
      marginTop: "30",
    },
    title: {
      fontSize: "1rem",
    },
  })
);

const ProductCardV2: React.FunctionComponent<ProductCardV2PropsType> = ({
  product,
}) => {
  const classes = useStyles();

  const primaryImageUrl =
    product.productImages.length > 0
      ? getApiUrl(product.productImages[0].productImagePath)
      : null;

  return (
    <Box className={classes.box}>
      <Card className={classes.card}>
        <CardMedia className={classes.media} image={primaryImageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.category.categoryName}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            className={classes.title}
          >
            {product.productName}
          </Typography>
          <Typography variant="body2" color="primary" component="p">
            <b>${cadCurrencyFormat(product.cheapestPrice)} ~</b>
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button
            component={RRLink}
            to={`/products/${product.productPath}`}
            variant="contained"
          >
            Read More
          </Button>
        </CardActions>
      </Card>
      {product.isDiscountAvailable && <CornerRibbon text={"Discount"} />}
    </Box>
  );
};

export default ProductCardV2;
