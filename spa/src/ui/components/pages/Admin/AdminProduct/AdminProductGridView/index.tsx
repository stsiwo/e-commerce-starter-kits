import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRowsProp,
} from "@material-ui/data-grid";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Pagination from "@material-ui/lab/Pagination";
import SearchForm from "components/common/SearchForm";
import { ProductType } from "domain/product/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link as RRLink } from "react-router-dom";
import {
  deleteSingleProductFetchStatusActions,
  postProductFetchStatusActions,
  putProductFetchStatusActions,
} from "reducers/slices/app/fetchStatus/product";
import {
  deleteSingleProductActionCreator,
  fetchProductActionCreator,
  productPaginationPageActions,
  productQuerySearchQueryActions,
} from "reducers/slices/domain/product";
import { FetchStatusEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import AdminProductFormDialog from "../AdminProductFormDialog";
import AdminProductSearchController from "../ADminProductSearchController";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

declare type AdminProductGridViewPropsType = {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(4),
      /**
       * this is necessary for scrollable tabs (from Mui) used for filter/sort for each domain.
       **/
      width: "100%",
    },
    loadingBox: {
      height: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    media: {},
    actionBox: {
      textAlign: "center",
    },
    searchBox: {
      display: "flex",
      justifyContent: "flex-end",
    },
    cardHeader: {
      paddingBottom: 0,
    },
    cardContentBox: {
      paddingTop: 0,
    },
    highlight: {
      color: theme.palette.fifth.main,
    },
    dataGrid: {
      // any <a> tag should be this color inside data grid.
      "& a": {
        color: theme.palette.fifth.main,
      },
    },
    pageBox: {
      padding: theme.spacing(2),
    },
  })
);

const generateRows: (domains: ProductType[]) => GridRowsProp = (domains) => {
  log("generateRows: does not update rows? how come");
  return domains.map((domain: ProductType) => {
    return {
      id: domain.productId,
      name: domain.productName,
      path: domain.productPath,
      category: domain.category.categoryName,
      unitPrice: domain.productBaseUnitPrice,
      discount: domain.isDiscountAvailable,
      releaseDate: domain.releaseDate,
      publish: domain.isPublic,
      variants: {
        count: domain.variants.length,
        productId: domain.productId,
      },
      actions: domain.productId,
    };
  });
};

const generateColumns: (
  onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>,
  onDelete: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
) => GridColDef[] = (onEdit, onDelete) => {
  return [
    { field: "name", headerName: "Name", width: 150 },
    { field: "unitPrice", headerName: "Unit Price", width: 150 },
    { field: "path", headerName: "Path", width: 150 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "discount", headerName: "Discount", width: 150 },
    { field: "releaseDate", headerName: "Release Date", width: 150 },
    { field: "publish", headerName: "Publish", width: 150 },
    {
      field: "variants",
      headerName: "Variants",
      width: 150,
      renderCell: (params: GridCellParams) => {
        const count = (params.value as { count: number; productId: string })
          .count;
        const productId = (params.value as { count: number; productId: string })
          .productId;
        return (
          <React.Fragment>
            <Link
              component={RRLink}
              to={`/admin/product-variants?productId=${productId}`}
            >
              {count}
            </Link>
          </React.Fragment>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-product-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton data-product-id={params.value} onClick={onDelete}>
            <RemoveCircleIcon />
          </IconButton>
        </React.Fragment>
      ),
    },
  ];
};

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * admin product management component
 *
 **/
const AdminProductGridView: React.FunctionComponent<AdminProductGridViewPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    const dispatch = useDispatch();

    const curProductList = useSelector(
      mSelector.makeProductWithoutCacheSelector()
    );

    // cur selected product item
    const [curProduct, setProduct] = React.useState<ProductType>(null);

    const pagination = useSelector(mSelector.makeProductPaginationSelector());

    const curQueryString = useSelector(mSelector.makeProductQuerySelector());

    log("current curProductList");
    log(curProductList);

    // fetch product
    React.useEffect(() => {
      dispatch(fetchProductActionCreator());
    }, [JSON.stringify(curQueryString), pagination.page]);

    // spa url query string
    const query = useQuery();
    const searchQuery = query.get("searchQuery");
    React.useEffect(() => {
      if (searchQuery) {
        dispatch(productQuerySearchQueryActions.update(searchQuery));
      }
    }, [searchQuery]);

    const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

    const handleNewFormToggleBtnClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = async (e) => {
      setFormOpen(!curFormOpen);
      // set null to make 'isNew' true
      setProduct(null);
    };

    // deletion dialog stuff
    const [curDeleteDialogOpen, setDeleteDialogOpen] =
      React.useState<boolean>(false);

    const handleDeletionCancel: React.EventHandler<
      React.MouseEvent<HTMLElement>
    > = (e) => {
      setDeleteDialogOpen(false);
    };

    const handleDeletionOk: React.EventHandler<React.MouseEvent<HTMLElement>> =
      (e) => {
        // request
        dispatch(
          deleteSingleProductActionCreator({ productId: curProduct.productId })
        );
      };

    // grid event handler stuff
    const handleEditClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      const productId = e.currentTarget.getAttribute("data-product-id");

      const targetProduct = curProductList.find(
        (product: ProductType) => product.productId == productId
      );

      setProduct(targetProduct);

      setFormOpen(true);
    };

    const handleDeleteClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      setDeleteDialogOpen(true);

      const productId = e.currentTarget.getAttribute("data-product-id");

      const targetProduct = curProductList.find(
        (product: ProductType) => product.productId == productId
      );

      setProduct(targetProduct);
    };

    /**
     * pagination.
     *
     * switch built-in pagination of DataGrid to the normal one.
     *
     */
    //const handlePageChange = (param: GridPageChangeParams) => {
    //  // need to decrement since we incremented when display
    //  log("start handling page change");
    //  const nextPage = param.page;

    //  log("next page: " + nextPage);
    //  dispatch(productPaginationPageActions.update(nextPage));
    //};

    const handlePaginationChange = (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => {
      // need to decrement since we incremented when display
      const nextPage = value - 1;

      dispatch(productPaginationPageActions.update(nextPage));
    };
    /**
     * search query stuffs
     **/
    const handleSearchChange = (value: string) => {
      dispatch(productQuerySearchQueryActions.update(value));
    };

    // fetch result
    // fetch order fetching result
    const curFetchProductStatus = useSelector(
      mSelector.makeFetchProductFetchStatusSelector()
    );

    // close form dialog only when success for post/put/delete
    const curPostFetchStatus = useSelector(
      rsSelector.app.getPostProductFetchStatus
    );
    const curPutFetchStatus = useSelector(
      rsSelector.app.getPutProductFetchStatus
    );
    const curDeleteSingleFetchStatus = useSelector(
      rsSelector.app.getDeleteSingleProductFetchStatus
    );
    React.useEffect(() => {
      if (
        curPostFetchStatus === FetchStatusEnum.SUCCESS ||
        curPutFetchStatus === FetchStatusEnum.SUCCESS ||
        curDeleteSingleFetchStatus === FetchStatusEnum.SUCCESS
      ) {
        setFormOpen(false);
        setDeleteDialogOpen(false);

        dispatch(postProductFetchStatusActions.clear());
        dispatch(putProductFetchStatusActions.clear());
        dispatch(deleteSingleProductFetchStatusActions.clear());
      }
    });

    return (
      <Card className={classes.root}>
        <CardHeader
          className={classes.cardHeader}
          titleTypographyProps={{
            variant: "h6",
          }}
          subheaderTypographyProps={{
            variant: "body1",
          }}
          title="Product List"
          action={
            <IconButton
              aria-label="add"
              onClick={handleNewFormToggleBtnClickEvent}
            >
              <AddCircleIcon />
            </IconButton>
          }
        />
        <CardContent className={classes.cardContentBox}>
          <Box className={classes.searchBox}>
            <SearchForm
              searchQuery={curQueryString.searchQuery}
              onChange={handleSearchChange}
              label={"search"}
            />
          </Box>
          <AdminProductSearchController />
          {curFetchProductStatus === FetchStatusEnum.FETCHING && (
            <Box className={classes.loadingBox}>
              <CircularProgress />
            </Box>
          )}
          {curFetchProductStatus === FetchStatusEnum.SUCCESS && (
            /**
             * 2nd page does not show the items even if there are items on state.
             *
             * i guees this pagination (e.g., DataGrid) need to have previous data to show the next data.
             *
             * for example, 1 page shows the items (1 - 20) and when fetch the next items (21 - 40), you still need the items (1 - 20) to show the next item (21 - 40).
             * since my implementation does not hold any previous data, so i cannot use this pagination anymore.
             *
             * instead, use the pagination (e.g., <Pagination>) component.
             *
             */
            <React.Fragment>
              <DataGrid
                rows={generateRows(curProductList)}
                columns={generateColumns(handleEditClick, handleDeleteClick)}
                hideFooterPagination
                //page={pagination.page} // don't forget to increment when display
                //pageSize={pagination.limit}
                //rowCount={pagination.totalElements}
                //onPageChange={handlePageChange}
                autoHeight
                className={classes.dataGrid}
              />
              <Grid
                container
                justify="center"
                alignItems="center"
                className={classes.pageBox}
              >
                <Pagination
                  page={pagination.page + 1} // don't forget to increment when display
                  count={pagination.totalPages}
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
        </CardContent>
        <CardActions disableSpacing></CardActions>
        {/** update/create product (without its variants) **/}
        <AdminProductFormDialog
          curFormOpen={curFormOpen}
          setFormOpen={setFormOpen}
          curProduct={curProduct}
        />
        {/** onDelete confiramtion dialog **/}
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="product-deletion-dialog"
          open={curDeleteDialogOpen}
        >
          <DialogTitle id="product-deletion-dialog">
            Product Deletion
          </DialogTitle>
          <DialogContent dividers>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              {"Do you want to delete this product permenently?"}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              Product Name: <b>{curProduct && curProduct.productName}</b>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleDeletionCancel}
              variant="contained"
            >
              Cancel
            </Button>
            <Button onClick={handleDeletionOk} variant="contained">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  };

export default AdminProductGridView;
