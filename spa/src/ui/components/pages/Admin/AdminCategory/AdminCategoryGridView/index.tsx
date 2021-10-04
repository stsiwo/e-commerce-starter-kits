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
import { CategoryType } from "domain/product/types";
import { useWaitResponse } from "hooks/waitResponse";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  deleteSingleCategoryFetchStatusActions,
  postCategoryFetchStatusActions,
  putCategoryFetchStatusActions,
} from "reducers/slices/app/fetchStatus/category";
import {
  categoryPaginationPageActions,
  categoryQuerySearchQueryActions,
  deleteSingleCategoryActionCreator,
  fetchCategoryActionCreator,
} from "reducers/slices/domain/category";
import { FetchStatusEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import AdminCategoryFormDialog from "../AdminCategoryFormDialog";

declare type AdminCategoryGridViewPropsType = {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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

const generateRows: (domains: CategoryType[]) => GridRowsProp = (domains) => {
  return domains.map((domain: CategoryType) => {
    return {
      id: domain.categoryId,
      name: domain.categoryName,
      path: domain.categoryPath,
      description: domain.categoryDescription,
      products: domain.totalProductCount,
      actions: domain.categoryId,
    };
  });
};

const generateColumns: (
  onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>,
  onDelete: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
) => GridColDef[] = (onEdit, onDelete) => {
  return [
    { field: "name", headerName: "Name", width: 150 },
    { field: "path", headerName: "Path", width: 150 },
    { field: "products", headerName: "Products", width: 150 },
    { field: "description", headerName: "Description", width: 400 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-category-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton data-category-id={params.value} onClick={onDelete}>
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
 * admin category management component
 *
 **/
const AdminCategoryGridView: React.FunctionComponent<AdminCategoryGridViewPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    // auth
    const auth = useSelector(mSelector.makeAuthSelector());

    const dispatch = useDispatch();

    // domain cur item
    const curCategoryList = useSelector(
      mSelector.makeCategoryWithoutCacheSelector()
    );

    // cur selected category item
    const [curCategory, setCategory] = React.useState<CategoryType>(null);

    const pagination = useSelector(mSelector.makeCategoryPaginationSelector());

    const curQueryString = useSelector(mSelector.makeCategoryQuerySelector());

    // fetch category
    React.useEffect(() => {
      dispatch(fetchCategoryActionCreator());
    }, [JSON.stringify(curQueryString), pagination.page]);

    // spa url query string
    const query = useQuery();
    const searchQuery = query.get("searchQuery");
    React.useEffect(() => {
      if (searchQuery) {
        dispatch(categoryQuerySearchQueryActions.update(searchQuery));
      }
    }, [searchQuery]);

    const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

    const handleNewFormToggleBtnClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = async (e) => {
      setCategory(null);
      setFormOpen(!curFormOpen);
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
          deleteSingleCategoryActionCreator({
            categoryId: curCategory.categoryId,
            version: curCategory.version,
          })
        );
      };

    // grid event handler stuff
    const handleEditClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      const categoryId = e.currentTarget.getAttribute("data-category-id");

      const targetCategory = curCategoryList.find(
        (category: CategoryType) => category.categoryId == categoryId
      );

      setCategory(targetCategory);

      setFormOpen(true);
    };

    const handleDeleteClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      setDeleteDialogOpen(true);

      const categoryId = e.currentTarget.getAttribute("data-category-id");

      const targetCategory = curCategoryList.find(
        (category: CategoryType) => category.categoryId == categoryId
      );

      setCategory(targetCategory);
    };

    /**
     * pagination
     *
     */
    //const handlePageChange = (param: GridPageChangeParams) => {
    //  // need to decrement since we incremented when display
    //  const nextPage = param.page;

    //  dispatch(categoryPaginationPageActions.update(nextPage));
    //};

    const handlePaginationChange = (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => {
      // need to decrement since we incremented when display
      const nextPage = value - 1;

      dispatch(categoryPaginationPageActions.update(nextPage));
    };
    /**
     * search query stuffs
     **/
    const handleSearchChange = (value: string) => {
      dispatch(categoryQuerySearchQueryActions.update(value));
    };

    // fetch result
    // fetch order fetching result
    const curFetchCategoryStatus = useSelector(
      mSelector.makeFetchCategoryFetchStatusSelector()
    );

    // close form dialog only when success for post/put/delete
    const curPostFetchStatus = useSelector(
      rsSelector.app.getPostCategoryFetchStatus
    );
    const curPutFetchStatus = useSelector(
      rsSelector.app.getPutCategoryFetchStatus
    );
    const curDeleteSingleFetchStatus = useSelector(
      rsSelector.app.getDeleteSingleCategoryFetchStatus
    );
    React.useEffect(() => {
      if (
        curPostFetchStatus === FetchStatusEnum.SUCCESS ||
        curPutFetchStatus === FetchStatusEnum.SUCCESS ||
        curDeleteSingleFetchStatus === FetchStatusEnum.SUCCESS
      ) {
        setFormOpen(false);
        setDeleteDialogOpen(false);

        dispatch(postCategoryFetchStatusActions.clear());
        dispatch(putCategoryFetchStatusActions.clear());
        dispatch(deleteSingleCategoryFetchStatusActions.clear());
      }
    });

    /**
     * avoid multiple click submission
     */
    const curDeleteFetchStatus = useSelector(
      rsSelector.app.getDeleteSingleCategoryFetchStatus
    );
    const { curDisableBtnStatus: curDisableDeleteBtnStatus } = useWaitResponse({
      fetchStatus: curDeleteFetchStatus,
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
          title="Category List"
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
          {curFetchCategoryStatus === FetchStatusEnum.FETCHING && (
            <Box className={classes.loadingBox}>
              <CircularProgress />
            </Box>
          )}
          {curFetchCategoryStatus === FetchStatusEnum.SUCCESS && (
            <React.Fragment>
              <DataGrid
                rows={generateRows(curCategoryList)}
                columns={generateColumns(handleEditClick, handleDeleteClick)}
                hideFooterPagination
                //page={pagination.page} // don't forget to increment when display
                //pageSize={pagination.limit}
                //rowCount={pagination.totalElements}
                //onPageChange={handlePageChange}
                autoHeight
                // not gonna use pagination of this DataGrid
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
          {curFetchCategoryStatus === FetchStatusEnum.FAILED && (
            <Box className={classes.loadingBox}>
              <Typography variant="body1" component="h2">
                {"failed to fetch data... please try again..."}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions disableSpacing></CardActions>
        {/** update/create category (without its variants) **/}
        <AdminCategoryFormDialog
          curFormOpen={curFormOpen}
          setFormOpen={setFormOpen}
          category={curCategory}
        />
        {/** onDelete confiramtion dialog **/}
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="category-deletion-dialog"
          open={curDeleteDialogOpen}
        >
          <DialogTitle id="category-deletion-dialog">
            Category Deletion
          </DialogTitle>
          <DialogContent dividers>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              {"Do you want to delete this category permenently?"}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              Category Name: <b>{curCategory && curCategory.categoryName}</b>
            </Typography>
            <br />
            {curCategory && curCategory.totalProductCount > 0 && (
              <Typography
                variant="body2"
                component="p"
                align="left"
                color={"error"}
                className={null}
              >
                {
                  "Oops, this category holds several products. come back here after you change the category of those products if you want to delete this category."
                }
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleDeletionCancel}
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletionOk}
              color="primary"
              disabled={
                (curCategory && curCategory.totalProductCount > 0) ||
                curDisableDeleteBtnStatus
              }
              variant="contained"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  };

export default AdminCategoryGridView;
