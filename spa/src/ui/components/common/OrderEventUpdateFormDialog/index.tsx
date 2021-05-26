import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { defaultOrderEventData, OrderEventType, orderStatusBagList, OrderStatusEnum, OrderType } from 'domain/order/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postOrderEventActionCreator, putOrderEventActionCreator } from 'reducers/slices/domain/order';
import { AuthType } from 'src/app';
import { mSelector } from 'src/selectors/selector';

interface OrderEventUpdateFormDialogPropsType {
  open: boolean
  onClose: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
  orderEvent: OrderEventType
  order: OrderType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      textAlign: "center",
      margin: theme.spacing(1),
    },
    txtFieldBase: {
      width: "80%",
      margin: theme.spacing(1),
    },
    actionBox: {
    },
  }),
);

const OrderEventUpdateFormDialog: React.FunctionComponent<OrderEventUpdateFormDialogPropsType> = (props) => {

  const classes = useStyles();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // order bag item
  const lastOrderEvent = props.order.latestOrderEvent;
  const lastOrderStatusBag = orderStatusBagList[lastOrderEvent.orderStatus]

  const dispatch = useDispatch()

  // order event form stuff
  const auth: AuthType = useSelector(mSelector.makeAuthSelector())
  const [curOrderEventState, setOrderEventState] = React.useState<OrderEventType>(defaultOrderEventData);

  // update/create logic for product
  //  - true: create
  //  - false: update
  // if props.product exists, it updates, otherwise, new
  const [isNew, setNew] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (props.orderEvent) {
      setNew(false);
      setOrderEventState(props.orderEvent)
    } else {
      setNew(true);
      setOrderEventState(defaultOrderEventData)
    }
  }, [
    JSON.stringify(props.orderEvent) 
  ])

  /**
   * update btn click event handler
   **/
  const handleFormSaveClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    /**
     * skip validation since there is less fields to validate (overkill)
     *
     **/

    if (isNew) {
      console.log("new order event creation")
      // request
      dispatch(
        postOrderEventActionCreator({
          orderStatus: curOrderEventState.orderStatus,
          orderId: props.order.orderId,
          note: curOrderEventState.note,
          userId: auth.user.userId,
        }) 
      )
    } else {
      console.log("update order event")
      // request
      dispatch(
        putOrderEventActionCreator({
          orderEventId: curOrderEventState.orderEventId,
          orderId: props.order.orderId,
          note: curOrderEventState.note,
          userId: auth.user.userId,
        }) 
      )
    }
  }

  const handleNoteInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextNote = e.currentTarget.value
    setOrderEventState((prev: OrderEventType) => ({
      ...prev,
      note: nextNote
    }));
  }

  const handleOrderStatusInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextOrderStatus = e.target.value as OrderStatusEnum; 
    setOrderEventState((prev: OrderEventType) => ({
      ...prev,
      orderStatus: nextOrderStatus
    }));
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="order-event-update-dialog">
      <DialogTitle id="order-event-update-dialog-title">Order Event Form</DialogTitle>
      <DialogContent>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            id="order-event-order-status"
            label="Order Status"
            className={`${classes.txtFieldBase}`}
            select
            value={curOrderEventState.orderStatus}
            onChange={handleOrderStatusInputChangeEvent}
            disabled={isNew ? false : true} // if existing order event, you can't edit this
          >
            {(!isNew && curOrderEventState && 
              <MenuItem key={curOrderEventState.orderStatus} value={curOrderEventState.orderStatus}>
                {curOrderEventState.orderStatus}
              </MenuItem>
            )}
            {(props.order.nextAdminOrderEventOptions.map((orderStatus: OrderStatusEnum) => (
                <MenuItem key={orderStatus} value={orderStatus}>
                  {orderStatus}
                </MenuItem>
              )))}
          </TextField>
          <TextField
            id="order-event-note"
            label="Note"
            placeholder={"Optional"}
            multiline
            rows={3}
            className={`${classes.txtFieldBase}`}
            value={curOrderEventState.note}
            onChange={handleNoteInputChangeEvent}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleFormSaveClick} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderEventUpdateFormDialog



