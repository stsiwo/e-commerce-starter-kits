import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import SearchController from 'components/common/SearchController';
import SearchResult from 'components/common/SearchResult';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductWithCacheActionCreator, productPaginationPageActions } from 'reducers/slices/domain/product';
import { mSelector } from 'src/selectors/selector';

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

  const dispatch = useDispatch()

  // filter/sort/pagination
  const curDomains = useSelector(mSelector.makeProductSelector()); 

  const curQuery = useSelector(mSelector.makeProductQuerySelector())

  // pagination
  const curPagination = useSelector(mSelector.makeProductPaginationSelector())
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {

    // need to decrement since we incremented when display
    const nextPage = value - 1;

    dispatch(productPaginationPageActions.update(nextPage))
  };

  // api request every time query/page changes
  React.useEffect(() => {
    dispatch(fetchProductWithCacheActionCreator())
  }, [
    JSON.stringify(curQuery),
    curPagination.page,
  ])


  // useEffect to send request every time its dependency updated
  return (
    <React.Fragment>
      <SearchController />
      <SearchResult products={curDomains} />
      <Grid 
        container 
        justify="center" 
        alignItems="center"
        className={classes.pageBox}
      >
        <Pagination
          page={curPagination.page + 1} // don't forget to increment when display
          count={curPagination.totalPages}
          color="primary"
          showFirstButton
          showLastButton
          size={"medium"}
          onChange={handlePaginationChange}
        />
      </Grid>
    </React.Fragment>
  )
}

export default ProductSearch


