import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { DataGrid, GridCellParams, GridColDef, GridPageChangeParams, GridRowsProp } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import { getCurOrderStatus } from 'domain/order';
import { OrderType } from 'domain/order/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderActionCreator, orderPaginationPageActions } from 'reducers/slices/domain/order';
import { FetchStatusEnum } from 'src/app';
import { mSelector, rsSelector } from 'src/selectors/selector';
import AdminOrderFormDrawer from '../AdminOrderFormDrawer';
import AdminOrderSearchController from '../AdminOrderSearchController';

declare type AdminOrderGridViewPropsType = {
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(4),
    },
    media: {
    },
    actionBox: {
      textAlign: "center"
    },
    cardContentBox: {
      height: "70vh",
    }
  }),
);

const generateRows: (domains: OrderType[]) => GridRowsProp = (domains) => {
  return domains.map((domain: OrderType) => {
    return {
      id: domain.orderNumber,
      date: domain.createdAt,
      cost: domain.productCost, // TODO: implement this at the backend 
      status: getCurOrderStatus(domain), //domain.orderEvents[domain.orderEvents.length - 1].orderStatus,
      actions: domain.orderId,
    }
  })
}

const generateColumns: (onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => GridColDef[] = (onEdit) => {
  return [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'date', headerName: 'Order Date', width: 150 },
    { field: 'cost', headerName: 'Cost', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-order-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </React.Fragment>
      )
    },
  ];
}

/**
 * admin product management component
 *
 **/
const AdminOrderGridView: React.FunctionComponent<AdminOrderGridViewPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch()

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

  const pagination = useSelector(mSelector.makeProductPaginationSelector())

  const curQueryString = useSelector(mSelector.makeOrderQuerySelector())

  // fetch order fetching result
  const curFetchOrderStatus = useSelector(mSelector.makeFetchOrderFetchStatusSelector())

  // fetch order
  React.useEffect(() => {
    dispatch(fetchOrderActionCreator())
  }, [
    JSON.stringify(curQueryString),
    pagination.page 
  ])

  const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

  // grid event handler stuff
  const handleEditClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const orderId = e.currentTarget.getAttribute("data-order-id")
    setOrderId(orderId);
    setFormOpen(true);
  }

  // pagination event handler
  
  const handlePageChange = (param: GridPageChangeParams) => {
    // need to decrement since we incremented when display
    const nextPage = param.page;

    dispatch(orderPaginationPageActions.update(nextPage))
  }

  // fetch result
  if (curFetchOrderStatus === FetchStatusEnum.FETCHING) {
    return <CircularProgress />
  } else if (curFetchOrderStatus === FetchStatusEnum.FAILED) {
    return (
      <Typography variant="body1" component="h2" >
        {"failed to fetch data... please try again..."}
      </Typography>
    )
  }


  return (
    <Card className={classes.root}>
      <CardHeader
        titleTypographyProps={{
          variant: 'h6',
        }}
        subheaderTypographyProps={{
          variant: 'body1'
        }}
        title="List"
      />
      <CardContent
        className={classes.cardContentBox}
      >
        <AdminOrderSearchController />
        <DataGrid
          rows={generateRows(curOrderList)}
          columns={generateColumns(handleEditClick)}
          page={pagination.page} // don't forget to increment when display
          pageSize={pagination.limit}
          rowCount={pagination.totalElements}
          onPageChange={handlePageChange}
        />
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
      <AdminOrderFormDrawer
        curFormOpen={curFormOpen}
        setFormOpen={setFormOpen}
        order={curOrderList.find((order: OrderType) => order.orderId === curOrderId)}
      />
    </Card>
  )
}

export default AdminOrderGridView






