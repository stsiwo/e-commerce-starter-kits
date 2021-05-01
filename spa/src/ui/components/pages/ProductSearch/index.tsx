import * as React from 'react';
import SearchController from 'components/common/SearchController';
import SearchResult from 'components/common/SearchResult';
import { ProductType } from 'domain/product/types';
import { generateProductList } from 'tests/data/product';
import Pagination from '@material-ui/lab/Pagination';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageBox: {
      padding: theme.spacing(2),
    }
  }),
);

/**
 * "/search" endpoint: to search & display products
 *
 * - stpes:
 *  
 *  1. send a request to /products (GET) to fetch the products
 *  2. manage states (e.g., result blog list, filter/sort/pagination) here (not in child component)
 *  3. every time filter/sort/pagination changes, send a request again.
 *
 **/
const ProductSearch: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles()

  //
  const [curProductList, setProductList] = React.useState<ProductType[]>(generateProductList(40))

  // filter/sort/pagination

  // useEffect to send request every time its dependency updated
  return (
    <React.Fragment>
      <SearchController />
      <SearchResult products={curProductList} />
      <Grid 
        container 
        justify="center" 
        alignItems="center"
        className={classes.pageBox}
      >
        <Pagination
          page={1}
          count={10}
          color="primary"
          showFirstButton
          showLastButton
          size={"medium"}
        />
      </Grid>
    </React.Fragment>
  )
}

export default ProductSearch


