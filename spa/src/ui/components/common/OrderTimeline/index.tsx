import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Timeline from '@material-ui/lab/Timeline';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { OrderEventType, orderStatusBagList } from 'domain/order/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { orderActions } from 'reducers/slices/domain/order';
import { toDateString } from 'src/utils';
import OrderEventUpdateFormDialog from '../OrderEventUpdateFormDialog';

/**
 * TODO: review this when test data is available.
 *
 *  - logic about order events
 *
 *    - the admin can delete an existing order event if undoable.
 *
 *    - whether existing order event is editable/deletable or not depends on orderEvent.undoable.
 *
 *    - the amdin can edit all order event only about 'note'.
 *
 *    - the admin can edit delete an existing order event if it is undoable and it is the last order event. the other order events are not deletable even if it is undoable.
 *
 **/

interface OrderTimelinePropsType {
  orderEvents: OrderEventType[]
  orderId: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: '6px 16px',
    },
    secondaryTail: {
      backgroundColor: theme.palette.secondary.main,
    },
  }),
);

/**
 * member or admin account management component
 **/
const OrderTimeline: React.FunctionComponent<OrderTimelinePropsType> = ({ orderEvents, orderId }) => {

  // mui: makeStyles
  const classes = useStyles();

  const dispatch = useDispatch()

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // cur selected orderEvent item
  const [curOrderEvent, setOrderEvent] = React.useState<OrderEventType>(null);

  // update form dialog open
  const [curFormOpen, setFormOpen] = React.useState<boolean>(false)

  // delete confirm dialog open
  const [curDeleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false)

  // event handlers to order event 
  const handleEditClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const orderEventId = e.currentTarget.getAttribute("data-orderEvent-id")

    const targetOrderEvent = orderEvents.find((orderEvent: OrderEventType) => orderEvent.orderEventId == orderEventId)

    setOrderEvent(targetOrderEvent);

    setFormOpen(true);

  }

  const handleDeleteClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setDeleteDialogOpen(true);

    const orderEventId = e.currentTarget.getAttribute("data-orderEvent-id")

    const targetOrderEvent = orderEvents.find((orderEvent: OrderEventType) => orderEvent.orderEventId == orderEventId)

    setOrderEvent(targetOrderEvent);
  }

  /**
   * update form event handlers
   **/
  const handleFormCloseClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setFormOpen(false);
  }

  /**
   * deletion confirm dialog event handlers
   **/
  const handleDeletionCancel: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setFormOpen(false);
  }

  const handleDeletionOk: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    /**
     * DELETE request
     **/
    // request
    api.request({
      method: 'DELETE',
      url: API1_URL + `/orders/${orderId}/events/${curOrderEvent.orderEventId}`
    }).then((data) => {

      // remove the order event from redux store 
      dispatch(orderActions.deleteEvent({
        orderId: orderId,
        eventId: curOrderEvent.orderEventId
      }))

      enqueueSnackbar("deleted successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })
  }

  const renderTimelineContent: (orderEvent: OrderEventType) => React.ReactNode = (orderEvent) => {

    const OrderStatusIcon = orderStatusBagList[orderEvent.orderStatus].icon
    const orderStatusObj = orderStatusBagList[orderEvent.orderStatus]

    return (
      <TimelineItem key={orderEvent.orderEventId}>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            {toDateString(orderEvent.createdAt)}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot
            style={{
              backgroundColor: "#fff",
              color: orderStatusObj.color,
            }}
          >
            <OrderStatusIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="subtitle1" component="h1">
              {orderStatusObj.label}
            </Typography>
            <Typography variant="body2" component="p" color="textSecondary">
              {orderStatusObj.defaultNote}
            </Typography>
            <Divider />
            <Box>
              <IconButton data-order-event-id={orderEvent.orderId} onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
              {(orderEvent.undoable &&
                <IconButton data-order-event-id={orderEvent.orderId} onClick={handleDeleteClick}>
                  <RemoveCircleIcon />
                </IconButton>
              )}
            </Box>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    )
  }

  const renderTimeline: () => React.ReactNode = () => {
    return orderEvents.map((orderEvent: OrderEventType, index: number) => {
      return renderTimelineContent(orderEvent)
    })
  }

  return (
    <React.Fragment>
      <Timeline align="alternate">
        {renderTimeline()}
      </Timeline>
      {/** update form dialog **/}
      <OrderEventUpdateFormDialog
        onClose={handleFormCloseClick}
        open={curFormOpen}
        orderEvent={curOrderEvent}
        orderEvents={orderEvents}
        orderId={orderId}
      />
      {/** onDelete confiramtion dialog **/}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="order-event-deletion-dialog"
        open={curDeleteDialogOpen}
      >
        <DialogTitle id="order-event-deletion-dialog">Order Event Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" component="p" align="left" className={null} >
            {"Do you want to delete this order event permenently?"}
          </Typography>
          <Typography variant="body1" component="p" align="left" className={null} >
            Order Event Id: <b>{curOrderEvent && curOrderEvent.orderEventId}</b>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeletionCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletionOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default OrderTimeline



