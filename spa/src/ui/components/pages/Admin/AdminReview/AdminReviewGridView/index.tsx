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
import EditIcon from "@material-ui/icons/Edit";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Pagination from "@material-ui/lab/Pagination";
import SearchForm from "components/common/SearchForm";
import { getStatus } from "domain/review";
import { ReviewType } from "domain/review/type";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  deleteSingleReviewFetchStatusActions,
  postReviewFetchStatusActions,
  putReviewFetchStatusActions,
} from "reducers/slices/app/fetchStatus/review";
import {
  deleteSingleReviewActionCreator,
  fetchReviewActionCreator,
  reviewPaginationPageActions,
  reviewQuerySearchQueryActions,
} from "reducers/slices/domain/review";
import { FetchStatusEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import AdminReviewFormDialog from "../AdminReviewFormDialog";
import AdminReviewSearchController from "../AdminReviewSearchController";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

declare type AdminReviewGridViewPropsType = {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(4),
    },
    loadingBox: {
      height: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    media: {},
    searchBox: {
      display: "flex",
      justifyContent: "flex-end",
    },
    actionBox: {
      textAlign: "center",
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

const generateRows: (domains: ReviewType[]) => GridRowsProp = (domains) => {
  return domains.map((domain: ReviewType) => {
    return {
      id: domain.reviewId,
      title: domain.reviewTitle,
      date: domain.createdAt,
      user: domain.user.firstName + " " + domain.user.lastName,
      product: domain.product.productName,
      reviewPoint: domain.reviewPoint,
      status: getStatus(domain.isVerified),
      actions: domain.reviewId,
    };
  });
};

const generateColumns: (
  onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>,
  onDelete: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
) => GridColDef[] = (onEdit, onDelete) => {
  return [
    { field: "id", headerName: "ID", width: 100 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "user", headerName: "User", width: 150 },
    { field: "product", headerName: "Product", width: 150 },
    { field: "reviewPoint", headerName: "Review Point", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-review-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton data-review-id={params.value} onClick={onDelete}>
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
const AdminReviewGridView: React.FunctionComponent<AdminReviewGridViewPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    const dispatch = useDispatch();

    // domain cur item
    const curReviewList = useSelector(mSelector.makeReviewSelector());

    // cur selected review item
    const [curReviewId, setReviewId] = React.useState<string>(null);

    const pagination = useSelector(mSelector.makeReviewPaginationSelector());

    const curQueryString = useSelector(mSelector.makeReviewQuerySelector());

    // fetch review
    React.useEffect(() => {
      log("this is called?");
      dispatch(fetchReviewActionCreator());
    }, [JSON.stringify(curQueryString), pagination.page]);

    // spa url query string
    // notification/email link use 'reviewId' but the request to the api use 'searchQuery' internally.
    const query = useQuery();
    const searchQuery = query.get("reviewId");
    React.useEffect(() => {
      if (searchQuery) {
        dispatch(reviewQuerySearchQueryActions.update(searchQuery));
      }
    }, [searchQuery]);

    const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

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
        dispatch(deleteSingleReviewActionCreator({ reviewId: curReviewId }));
      };

    // grid event handler stuff
    const handleEditClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      const reviewId = e.currentTarget.getAttribute("data-review-id");

      log("target reveiw to be edit: " + reviewId);

      setReviewId(reviewId);

      setFormOpen(true);
    };

    const handleDeleteClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      setDeleteDialogOpen(true);

      const reviewId = e.currentTarget.getAttribute("data-review-id");
      setReviewId(reviewId);
    };

    // pagination event handler
    //const handlePageChange = (param: GridPageChangeParams) => {
    //  // need to decrement since we incremented when display
    //  const nextPage = param.page;

    //  dispatch(reviewPaginationPageActions.update(nextPage));
    //};

    const handlePaginationChange = (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => {
      // need to decrement since we incremented when display
      const nextPage = value - 1;

      dispatch(reviewPaginationPageActions.update(nextPage));
    };
    /**
     * search query stuffs
     **/
    const handleSearchChange = (value: string) => {
      dispatch(reviewQuerySearchQueryActions.update(value));
    };

    // fetch result
    // fetch order fetching result
    const curFetchReviewStatus = useSelector(
      mSelector.makeFetchReviewFetchStatusSelector()
    );

    // close form dialog only when success for post/put/delete
    const curPostFetchStatus = useSelector(
      rsSelector.app.getPostReviewFetchStatus
    );
    const curPutFetchStatus = useSelector(
      rsSelector.app.getPutReviewFetchStatus
    );
    const curDeleteSingleFetchStatus = useSelector(
      rsSelector.app.getDeleteSingleReviewFetchStatus
    );
    React.useEffect(() => {
      if (
        curPostFetchStatus === FetchStatusEnum.SUCCESS ||
        curPutFetchStatus === FetchStatusEnum.SUCCESS ||
        curDeleteSingleFetchStatus === FetchStatusEnum.SUCCESS
      ) {
        setFormOpen(false);
        setDeleteDialogOpen(false);

        dispatch(postReviewFetchStatusActions.clear());
        dispatch(putReviewFetchStatusActions.clear());
        dispatch(deleteSingleReviewFetchStatusActions.clear());
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
          title="Review List"
        />
        <CardContent className={classes.cardContentBox}>
          <Box className={classes.searchBox}>
            <SearchForm
              searchQuery={curQueryString.searchQuery}
              onChange={handleSearchChange}
              label={"search"}
            />
          </Box>
          <AdminReviewSearchController />
          {curFetchReviewStatus === FetchStatusEnum.FETCHING && (
            <Box className={classes.loadingBox}>
              <CircularProgress />
            </Box>
          )}
          {curFetchReviewStatus === FetchStatusEnum.SUCCESS && (
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
                rows={generateRows(curReviewList)}
                columns={generateColumns(handleEditClick, handleDeleteClick)}
                hideFooterPagination
                //page={pagination.page} // don't forget to increment when display
                //pageSize={pagination.limit}
                //rowCount={pagination.totalElements}
                //onPageChange={handlePageChange}
                autoHeight
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
          {curFetchReviewStatus === FetchStatusEnum.FAILED && (
            <Box className={classes.loadingBox}>
              <Typography variant="body1" component="h2">
                {"failed to fetch data... please try again..."}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions disableSpacing></CardActions>
        {/** update/create review (without its variants) **/}
        <AdminReviewFormDialog
          curFormOpen={curFormOpen}
          setFormOpen={setFormOpen}
          review={curReviewList.find(
            (review: ReviewType) => review.reviewId == curReviewId
          )}
        />
        {/** onDelete confiramtion dialog **/}
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="review-deletion-dialog"
          open={curDeleteDialogOpen}
        >
          <DialogTitle id="review-deletion-dialog">
            Product Deletion
          </DialogTitle>
          <DialogContent dividers>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              {"Do you want to delete this review permenently?"}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              Review ID:{" "}
              <b>
                {curReviewList.find(
                  (review: ReviewType) => review.reviewId == curReviewId
                ) &&
                  curReviewList.find(
                    (review: ReviewType) => review.reviewId == curReviewId
                  ).reviewId}
              </b>
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

export default AdminReviewGridView;
