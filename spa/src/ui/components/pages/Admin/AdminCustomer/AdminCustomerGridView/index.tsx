import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridPageChangeParams,
  GridRowsProp,
} from "@material-ui/data-grid";
import EditIcon from "@material-ui/icons/Edit";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import { UserType, userActiveLabelList } from "domain/user/types";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserActionCreator,
  userPaginationPageActions,
  userQuerySearchQueryActions,
} from "reducers/slices/domain/user";
import { mSelector } from "src/selectors/selector";
import AdminCustomerFormDrawer from "../AdminCustomerFormDrawer";
import AdminUserSearchController from "../AdminCustomerSearchController";
import Avatar from "@material-ui/core/Avatar";
import { FetchStatusEnum } from "src/app";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchForm from "components/common/SearchForm";
import { useLocation } from "react-router";
import { getApiUrl } from "src/utils";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";

declare type AdminCustomerGridViewPropsType = {};

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

const generateRows: (domains: UserType[]) => GridRowsProp = (domains) => {
  return domains.map((domain: UserType) => {
    return {
      id: domain.userId,
      avatar: domain.avatarImagePath,
      name: domain.firstName + " " + domain.lastName,
      email: domain.email,
      type: domain.userType.userType,
      status: userActiveLabelList[domain.active],
      //orders: domain.orders.length,
      //reviews: domain.reviews.length,
      actions: domain.userId,
    };
  });
};

const generateColumns: (
  onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>,
  onDelete: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
) => GridColDef[] = (onEdit, onDelete) => {
  return [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <Avatar src={params.value ? getApiUrl(params.value as string) : null} />
      ),
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    //{
    //  field: 'orders',
    //  headerName: 'Orders',
    //  width: 150,
    //},
    //{
    //  field: 'reviews',
    //  headerName: 'Reviews',
    //  width: 150,
    //},
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-user-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton data-user-id={params.value} onClick={onDelete}>
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
const AdminCustomerGridView: React.FunctionComponent<AdminCustomerGridViewPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    // auth
    const auth = useSelector(mSelector.makeAuthSelector());

    const dispatch = useDispatch();

    // snackbar notification
    // usage: 'enqueueSnackbar("message", { variant: "error" };
    const { enqueueSnackbar } = useSnackbar();

    // domain cur item
    const curUserList = useSelector(mSelector.makeUserSelector());

    // cur selected user item
    const [curUserId, setUserId] = React.useState<string>(null);

    const curQueryString = useSelector(mSelector.makeUserQuerySelector());

    const pagination = useSelector(mSelector.makeUserPaginationSelector());

    // fetch user
    React.useEffect(() => {
      dispatch(fetchUserActionCreator());
    }, [JSON.stringify(curQueryString), pagination.page]);

    // spa url query string
    const query = useQuery();
    const searchQuery = query.get("searchQuery");
    React.useEffect(() => {
      if (searchQuery) {
        dispatch(userQuerySearchQueryActions.update(searchQuery));
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
        // request (permenently)
        api
          .request({
            method: "DELETE",
            url: API1_URL + `/users/${curUserId}`,
          })
          .then((data) => {
            dispatch(fetchUserActionCreator());

            enqueueSnackbar("deleted successfully.", { variant: "success" });
          })
          .catch((error: AxiosError) => {
            enqueueSnackbar(error.message, { variant: "error" });
          });
      };

    // grid event handler stuff
    const handleEditClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      const userId = e.currentTarget.getAttribute("data-user-id");
      setUserId(userId);

      setFormOpen(true);
    };

    const handleDeleteClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      setDeleteDialogOpen(true);

      const userId = e.currentTarget.getAttribute("data-user-id");
      setUserId(userId);
    };

    // pagination event handler
    //const handlePageChange = (param: GridPageChangeParams) => {
    //  // need to decrement since we incremented when display
    //  const nextPage = param.page;

    //  dispatch(userPaginationPageActions.update(nextPage));
    //};

    const handlePaginationChange = (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => {
      // need to decrement since we incremented when display
      const nextPage = value - 1;

      dispatch(userPaginationPageActions.update(nextPage));
    };
    /**
     * search query stuffs
     **/
    const handleSearchChange = (value: string) => {
      dispatch(userQuerySearchQueryActions.update(value));
    };
    // fetch result
    // fetch order fetching result
    const curFetchCustomerStatus = useSelector(
      mSelector.makeFetchUserFetchStatusSelector()
    );
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
          title="Customer List"
        />
        <CardContent className={classes.cardContentBox}>
          <Box className={classes.searchBox}>
            <SearchForm
              searchQuery={curQueryString.searchQuery}
              onChange={handleSearchChange}
              label={"search"}
            />
          </Box>
          <AdminUserSearchController />
          {curFetchCustomerStatus === FetchStatusEnum.FETCHING && (
            <Box className={classes.loadingBox}>
              <CircularProgress />
            </Box>
          )}
          {curFetchCustomerStatus === FetchStatusEnum.SUCCESS && (
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
                rows={generateRows(curUserList)}
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
          {curFetchCustomerStatus === FetchStatusEnum.FAILED && (
            <Box className={classes.loadingBox}>
              <Typography variant="body1" component="h2">
                {"failed to fetch data... please try again..."}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions disableSpacing></CardActions>
        <AdminCustomerFormDrawer
          curFormOpen={curFormOpen}
          setFormOpen={setFormOpen}
          user={curUserList.find((user: UserType) => user.userId === curUserId)}
        />
        {/** onDelete confiramtion dialog **/}
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="user-deletion-dialog"
          open={curDeleteDialogOpen}
        >
          <DialogTitle id="user-deletion-dialog">User Deletion</DialogTitle>
          <DialogContent dividers>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              {"Do you want to delete this user permenently?"}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              User Email:{" "}
              <b>
                {curUserList.find(
                  (user: UserType) => user.userId === curUserId
                ) &&
                  curUserList.find(
                    (user: UserType) => user.userId === curUserId
                  ).email}
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

export default AdminCustomerGridView;
