import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ProductType } from 'domain/product/types';
import * as React from 'react';
import { cadCurrencyFormat } from 'src/utils';

declare type ProductCardV2PropsType = {
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
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: '100%',
      marginTop: '30'
    }
  }),
);

const ProductCardV2: React.FunctionComponent<ProductCardV2PropsType> = ({ product }) => {

  const classes = useStyles();

  /**
   * what is difference btw <CardActionArea> and <CardActions>
   **/

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={(product.productImages.length > 0) ? product.productImages[0].productImagePath : ""}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.category.categoryName}
        </Typography>
        <Typography gutterBottom variant="h6" component="h2">
          {product.productName}
        </Typography>
        <Typography variant="body2" color="primary" component="p">
          {/** 
            TODO: need to domain function to select cheapest price via product variant 
               or you can create a property in backend DTO so that you don't need to calculate in front-end 
            **/}
          <b>${cadCurrencyFormat(product.productBaseUnitPrice)}</b>
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button>
          Read More
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCardV2




