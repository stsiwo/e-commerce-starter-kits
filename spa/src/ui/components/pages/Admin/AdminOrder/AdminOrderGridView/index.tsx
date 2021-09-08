import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
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
import Pagination from "@material-ui/lab/Pagination";
import SearchForm from "components/common/SearchForm";
import { getCurOrderStatus } from "domain/order";
import { OrderType } from "domain/order/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  fetchOrderActionCreator,
  orderPaginationPageActions,
  orderQuerySearchQueryActions,
} from "reducers/slices/domain/order";
import { FetchStatusEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { cadCurrencyFormat } from "src/utils";
import AdminOrderFormDrawer from "../AdminOrderFormDrawer";
import AdminOrderSearchController from "../AdminOrderSearchController";

declare type AdminOrderGridViewPropsType = {};

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

const generateRows: (domains: OrderType[]) => GridRowsProp = (domains) => {
  return domains.map((domain: OrderType) => {
    return {
      id: domain.orderNumber,
      stripeId: domain.stripePaymentIntentId,
      date: domain.createdAt,
      cost: cadCurrencyFormat(domain.productCost), // TODO: implement this at the backend
      customerName: domain.orderFirstName + " " + domain.orderLastName,
      customerEmail: domain.orderEmail,
      status: getCurOrderStatus(domain), //domain.orderEvents[domain.orderEvents.length - 1].orderStatus,
      actions: domain.orderId,
    };
  });
};

const generateColumns: (
  onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
) => GridColDef[] = (onEdit) => {
  return [
    { field: "id", headerName: "ID", width: 150 },
    { field: "stripeId", headerName: "Stripe ID", width: 150 },
    { field: "date", headerName: "Order Date", width: 150 },
    { field: "cost", headerName: "Cost", width: 150 },
    { field: "customerName", headerName: "Name", width: 150 },
    { field: "customerEmail", headerName: "Email", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-order-id={params.value} onClick={onEdit}>
            <EditIcon />
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
const AdminOrderGridView: React.FunctionComponent<AdminOrderGridViewPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    // auth
    const auth = useSelector(mSelector.makeAuthSelector());

    const dispatch = useDispatch();

    // domain cur item
    const curOrderList = useSelector(mSelector.makeOrderSelector());

    /**
     * WARN: don't create duplicated data like 'curOrder' as state.
     *
     * breaking the rule of 'a single source of truth'. when you need to refer to data, always go to redux store. !!!
     *
     **/

    // cur selected order item
    const [curOrderId, setOrderId] = React.useState<string>(null);

    const pagination = useSelector(mSelector.makeOrderPaginationSelector());

    const curQueryString = useSelector(mSelector.makeOrderQuerySelector());

    // fetch order fetching result
    const curFetchOrderStatus = useSelector(
      mSelector.makeFetchOrderFetchStatusSelector()
    );

    // fetch order
    React.useEffect(() => {
      dispatch(fetchOrderActionCreator());
    }, [JSON.stringify(curQueryString), pagination.page]);

    // spa url query string
    // you can use either 'orderId'/'seachQuery' when request to the api
    // notification/email link use 'orderId' but the request to the api use 'searchQuery' internally.
    const query = useQuery();
    const searchQuery = query.get("orderId");
    React.useEffect(() => {
      if (searchQuery) {
        dispatch(orderQuerySearchQueryActions.update(searchQuery));
      }
    }, [searchQuery]);
    const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

    // grid event handler stuff
    const handleEditClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      const orderId = e.currentTarget.getAttribute("data-order-id");
      setOrderId(orderId);
      setFormOpen(true);
    };

    // pagination event handler

    //const handlePageChange = (param: GridPageChangeParams) => {
    //  // need to decrement since we incremented when display
    //  const nextPage = param.page;

    //  dispatch(orderPaginationPageActions.update(nextPage));
    //};

    const handlePaginationChange = (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => {
      // need to decrement since we incremented when display
      const nextPage = value - 1;
      dispatch(orderPaginationPageActions.update(nextPage));
    };
    /**
     * search query stuffs
     **/
    const handleSearchChange = (value: string) => {
      dispatch(orderQuerySearchQueryActions.update(value));
    };

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
          title="List"
        />
        <CardContent className={classes.cardContentBox}>
          <Box className={classes.searchBox}>
            <SearchForm
              searchQuery={curQueryString.searchQuery}
              onChange={handleSearchChange}
              label={"search"}
            />
          </Box>
          <AdminOrderSearchController />
          {curFetchOrderStatus === FetchStatusEnum.FETCHING && (
            <Box className={classes.loadingBox}>
              <CircularProgress />
            </Box>
          )}
          {curFetchOrderStatus === FetchStatusEnum.SUCCESS && (
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
                rows={generateRows(curOrderList)}
                columns={generateColumns(handleEditClick)}
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
          {curFetchOrderStatus === FetchStatusEnum.FAILED && (
            <Box className={classes.loadingBox}>
              <Typography variant="body1" component="h2">
                {"failed to fetch data... please try again..."}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions disableSpacing></CardActions>
        <AdminOrderFormDrawer
          curFormOpen={curFormOpen}
          setFormOpen={setFormOpen}
          order={curOrderList.find(
            (order: OrderType) => order.orderId === curOrderId
          )}
        />
      </Card>
    );
  };

export default AdminOrderGridView;
