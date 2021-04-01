import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ProductType } from 'domain/product/types';
import * as React from 'react';

declare type ProductCardV2PropsType = {
  product: ProductType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
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
        image={product.productImages[0].productImagePath}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.category.categoryName}
        </Typography>
        <Typography gutterBottom variant="h5" component="h2">
          {product.productName}
        </Typography>
        <Typography variant="body2" color="primary" component="p">
          {`$${product.productBaseUnitPrice}`}
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




