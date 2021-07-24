import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import SearchController from "components/common/SearchController";
import SearchResult from "components/common/SearchResult";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublicProductActionCreator,
  productPaginationPageActions,
  productQuerySearchQueryActions,
} from "reducers/slices/domain/product";
import { mSelector } from "src/selectors/selector";
import SearchForm from "components/common/SearchForm";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FetchStatusEnum } from "src/app";
import Typography from "@material-ui/core/Typography";
import { useLocation } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageBox: {
      padding: theme.spacing(2),
    },
    searchBox: {
      display: "flex",
      justifyContent: "flex-end",
    },
    loadingBox: {
      height: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
  })
);

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * "/search" endpoint: to search & display products
 *
 **/
const ProductSearch: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  // filter/sort/pagination
  const curDomains = useSelector(mSelector.makeProductWithoutCacheSelector());

  const curQuery = useSelector(mSelector.makeProductQuerySelector());

  // spa url query string
  const query = useQuery();
  const searchQuery = query.get("searchQuery");
  React.useEffect(() => {
    if (searchQuery) {
      dispatch(productQuerySearchQueryActions.update(searchQuery));
    }
  }, [searchQuery]);

  // pagination
  const curPagination = useSelector(mSelector.makeProductPaginationSelector());
  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    // need to decrement since we incremented when display
    const nextPage = value - 1;

    dispatch(productPaginationPageActions.update(nextPage));
  };

  // api request every time query/page changes
  React.useEffect(() => {
    dispatch(fetchPublicProductActionCreator());
  }, [JSON.stringify(curQuery), curPagination.page]);

  /**
   * search query stuffs
   **/
  const handleSearchChange = (value: string) => {
    dispatch(productQuerySearchQueryActions.update(value));
  };

  // fetch result
  // fetch order fetching result
  const curFetchProductStatus = useSelector(
    mSelector.makeFetchPublicProductFetchStatusSelector()
  );

  // useEffect to send request every time its dependency updated
  return (
    <React.Fragment>
      <Box className={classes.searchBox}>
        <SearchForm
          searchQuery={curQuery.searchQuery}
          onChange={handleSearchChange}
          label={"search..."}
        />
      </Box>
      <SearchController />
      {curFetchProductStatus === FetchStatusEnum.FETCHING && (
        <Box className={classes.loadingBox}>
          <CircularProgress />
        </Box>
      )}
      {curFetchProductStatus === FetchStatusEnum.SUCCESS && (
        <React.Fragment>
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
      )}
      {curFetchProductStatus === FetchStatusEnum.FAILED && (
        <Box className={classes.loadingBox}>
          <Typography variant="body1" component="h2">
            {"failed to fetch data... please try again..."}
          </Typography>
        </Box>
      )}
    </React.Fragment>
  );
};

export default ProductSearch;
