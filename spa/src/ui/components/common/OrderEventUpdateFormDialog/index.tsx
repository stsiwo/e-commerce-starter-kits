import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { defaultOrderEventData, hasNextOrderOptions, OrderEventType, orderStatusBagList, OrderStatusEnum } from 'domain/order/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderActions } from 'reducers/slices/domain/order';
import { AuthType } from 'src/app';
import { mSelector } from 'src/selectors/selector';

interface OrderEventUpdateFormDialogPropsType {
  open: boolean
  onClose: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
  orderEvents: OrderEventType[]
  orderEvent: OrderEventType
  orderId: string
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
  const lastOrderEvent = props.orderEvents.length > 0 ? props.orderEvents[props.orderEvents.length - 1] : null
  const lastOrderStatusBag = orderStatusBagList[lastOrderEvent.orderStatus]

  const dispatch = useDispatch()

  // order event form stuff
  const auth: AuthType = useSelector(mSelector.makeAuthSelector())
  const [curOrderEventState, setOrderEventState] = React.useState<OrderEventType>(props.orderEvent ? props.orderEvent : defaultOrderEventData);

  // update/create logic for product
  //  - true: create
  //  - false: update
  // if props.product exists, it updates, otherwise, new
  const [isNew, setNew] = React.useState<boolean>(props.orderEvent ? false : true);

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
      api.request({
        method: 'POST',
        url: API1_URL + `/orders/${props.orderId}/events`,
        data: curOrderEventState,
      }).then((data) => {

        const newOrderEvent = data.data;

        // append this order event
        dispatch(orderActions.appendEvent(newOrderEvent))

        enqueueSnackbar("updated successfully.", { variant: "success" })
      }).catch((error: AxiosError) => {
        enqueueSnackbar(error.message, { variant: "error" })
      })

    } else {
      console.log("update order event")
      // request
      api.request({
        method: 'PUT',
        url: API1_URL + `/orders/${props.orderId}/events/${curOrderEventState.orderEventId}`,
        data: curOrderEventState,
      }).then((data) => {

        const updatedOrderEvent = data.data;

        // append this order event
        dispatch(orderActions.updateEvent({
          orderId: props.orderId,
          event: updatedOrderEvent,
        }))

        enqueueSnackbar("updated successfully.", { variant: "success" })
      }).catch((error: AxiosError) => {
        enqueueSnackbar(error.message, { variant: "error" })
      })
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
    const nextOrderStatus = lastOrderStatusBag.nextOptions[auth.userType].find((orderStatus: OrderStatusEnum) => e.currentTarget.value === orderStatus)
    setOrderEventState((prev: OrderEventType) => ({
      ...prev,
      orderStatus: nextOrderStatus
    }));
  }

  const handleCreatedAtChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCreatedAt = e.currentTarget.value
    setOrderEventState((prev: OrderEventType) => ({
      ...prev,
      createdat: nextCreatedAt
    }));
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="order-event-update-dialog">
      <DialogTitle id="order-event-update-dialog-title">Subscribe</DialogTitle>
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
            {(lastOrderEvent &&
              hasNextOrderOptions(lastOrderStatusBag, auth.userType) &&
              lastOrderStatusBag.nextOptions[auth.userType].map((orderStatus: OrderStatusEnum) => (
                <MenuItem key={orderStatus} value={orderStatus}>
                  {orderStatus}
                </MenuItem>
              )))}
          </TextField>
          {/** TODO: validation: prevent the admin input past date. **/}
          {/** https://material-ui.com/components/pickers/ **/}
          <TextField
            id="order-event-created-at"
            label="Date"
            type="datetime-local"
            value={curOrderEventState.createdAt}
            defaultValue={new Date().toString()}
            className={classes.txtFieldBase}
            onChange={handleCreatedAtChangeEvent}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={isNew ? false : true} // if existing order event, you can't edit this
          />
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



