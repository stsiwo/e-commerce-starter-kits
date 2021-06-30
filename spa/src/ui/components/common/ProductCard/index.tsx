import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ProductType } from 'domain/product/types';
import * as React from 'react';
import { Link as RRLink } from "react-router-dom";
import { cadCurrencyFormat } from 'src/utils';

interface ProductCardPropsType {
  product: ProductType
}

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
    cardContent: {
    },
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: '100%',
      marginTop: '30'
    }
  }),
);

const ProductCard: React.FunctionComponent<ProductCardPropsType> = ({ product }) => {

  const classes = useStyles();

  /**
   * what is difference btw <CardActionArea> and <CardActions>
   **/
  const primaryImageUrl = (product.productImages.length > 0) ? API1_URL + product.productImages[0].productImagePath : null

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        // the first product image is the main one
        image={primaryImageUrl}
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.category.categoryName}
        </Typography>
        <Typography gutterBottom variant="h6" component="h2">
          {product.productName}
        </Typography>
        <Typography variant="body1" align="left" color="primary" component="p">
          <b>{`${cadCurrencyFormat(product.cheapestPrice)} ~`}</b>
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button component={RRLink} to={`/products/${product.productPath}`}>
          Read More
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard




