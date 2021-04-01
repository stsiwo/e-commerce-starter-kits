import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { ProductType } from 'domain/product/types';
import ProductCardV2 from '../ProductCard/ProductCardV2';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

declare type SearchResultPropsType = {
  products: ProductType[],
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridBox: {
      // need to set this. otherwise, <Grid spacing={x}> causes overflow horizontally.
      // ref: https://material-ui.com/components/grid/#limitations
      //
      // still overflow!
      //  - quit using <Grid spacing={x}>. 
      //  - use 'margin' on <Grid item> // it works
      overflow: "hidden",
      padding: theme.spacing(0, 1, 0, 1),
      margin: theme.spacing(3, 0, 3, 0),
    },
    gridItem: {
      maxWidth: 200,
      margin: theme.spacing(1) 
    }
  }),
);


const SearchResult: React.FunctionComponent<SearchResultPropsType> = ({ products }) => {

  const classes = useStyles()

  const renderProductList: () => React.ReactNode = () => {
    return products.map((product: ProductType) => {
      return (
        <Grid 
          key={product.productId}
          item
          xs={12}
          sm={6}
          md={3}
          className={classes.gridItem}
        >
         <ProductCardV2 product={product}/> 
        </Grid>
      )
    })
  }

  return (
    <Grid 
      container
      className={classes.gridBox}
      spacing={0}
      justify="center"
    >
      {renderProductList()}
    </Grid>
  )
}

export default SearchResult



