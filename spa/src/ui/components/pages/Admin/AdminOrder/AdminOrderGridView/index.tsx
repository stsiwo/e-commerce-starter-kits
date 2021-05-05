import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp } from '@material-ui/data-grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import * as React from 'react';
import AdminOrderFormDrawer from '../AdminOrderFormDrawer';
import { OrderType } from 'domain/order/types';
import { useSelector, useDispatch } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { useSnackbar } from 'notistack';
import { fetchOrderActionCreator, orderPaginationPageActions } from 'reducers/slices/domain/order';
import Pagination from '@material-ui/lab/Pagination/Pagination';

declare type AdminOrderGridViewPropsType = {
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
      id: domain.orderId,
      number: domain.orderNumber,
      date: domain.createdAt,
      cost: domain.productCost, // TODO: implement this at the backend 
      status: domain.orderEvents[domain.orderEvents.length - 1].orderStatus,
      actions: domain.orderId,
    }
  })
}

const generateColumns: (onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => GridColDef[] = (onEdit) => {
  return [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'number', headerName: '#', width: 150 },
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

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // domain cur item
  const curOrderList = useSelector(mSelector.makeOrderSelector())

  // cur selected order item
  const [curOrder, setOrder] = React.useState<OrderType>(null);

  const pagination = useSelector(mSelector.makeProductPaginationSelector())

  // fetch order
  React.useEffect(() => {
    dispatch(fetchOrderActionCreator())
  }, [
    pagination.page 
  ])

  const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

  // grid event handler stuff
  const handleEditClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const orderId = e.currentTarget.getAttribute("data-order-id")

    const targetOrder = curOrderList.find((order: OrderType) => order.orderId == orderId)

    setOrder(targetOrder);

    setFormOpen(true);
  }

  // pagination event handler
  
  /**
   * TODO: make sure pagiantion working when you have more data.
   *
   **/
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {

    // need to decrement since we incremented when display
    const nextPage = value - 1;

    dispatch(orderPaginationPageActions.update(nextPage))
  };
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
        <DataGrid
          autoHeight
          rows={generateRows(curOrderList)}
          columns={generateColumns(handleEditClick)}
          pageSize={pagination.limit}
          rowCount={pagination.limit}
        />
        <Pagination
          page={pagination.page + 1} // don't forget to increment when display
          count={pagination.totalPages}
          color="primary"
          showFirstButton
          showLastButton
          size={"medium"}
          onChange={handlePaginationChange}
        />
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
      <AdminOrderFormDrawer
        curFormOpen={curFormOpen}
        setFormOpen={setFormOpen}
        order={curOrder}
      />
    </Card>
  )
}

export default AdminOrderGridView






