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
import { OrderEventType, orderStatusBagList, OrderType } from 'domain/order/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSingleOrderEventActionCreator, postOrderEventActionCreator } from 'reducers/slices/domain/order';
import { toDateString } from 'src/utils';
import OrderEventUpdateFormDialog from '../OrderEventUpdateFormDialog';
import { mSelector, rsSelector } from 'src/selectors/selector';
import { UserTypeEnum, FetchStatusEnum } from 'src/app';
import { postOrderEventFetchStatusActions, putOrderEventFetchStatusActions, deleteSingleOrderEventFetchStatusActions } from 'reducers/slices/app/fetchStatus/order';

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
  order: OrderType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: `${theme.spacing(1)}px auto`,
      maxWidth: 700,
    },
    paper: {
      padding: '6px 16px',
    },
    secondaryTail: {
      backgroundColor: theme.palette.secondary.main,
    },
    btnBox: {
      textAlign: "center",
    },
    addBtn: {
      margin: theme.spacing(1),
    }
  }),
);

/**
 * member or admin account management component
 **/
const OrderTimeline: React.FunctionComponent<OrderTimelinePropsType> = ({ order }) => {

  // mui: makeStyles
  const classes = useStyles();

  const dispatch = useDispatch()

  const auth = useSelector(mSelector.makeAuthSelector())

  // cur selected orderEvent item
  const [curOrderEvent, setOrderEvent] = React.useState<OrderEventType>(null);

  // update form dialog open
  const [curFormOpen, setFormOpen] = React.useState<boolean>(false)

  // delete confirm dialog open
  const [curDeleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false)

  // event handlers to order event 
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>, orderEventId: string) => {

    console.log("selected order event id: " + orderEventId)

    const targetOrderEvent = order.orderEvents.find((orderEvent: OrderEventType) => orderEvent.orderEventId == orderEventId)

    console.log("selected order event:")
    console.log(targetOrderEvent)

    setOrderEvent(targetOrderEvent);

    setFormOpen(true);

  }

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, orderEventId: string) => {
    setDeleteDialogOpen(true);
    const targetOrderEvent = order.orderEvents.find((orderEvent: OrderEventType) => orderEvent.orderEventId == orderEventId)

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
    setDeleteDialogOpen(false);
  }

  const handleDeletionOk: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    /**
     * DELETE request
     **/
    dispatch(
      deleteSingleOrderEventActionCreator({
        orderEventId: curOrderEvent.orderEventId,
        orderId: order.orderId,
      })
    )
  }

  // handle add new order event
  const handleAddNewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOrderEvent(null)
    setFormOpen(true);
  }

  // next addable option based on user type
  const nextOrderEventOptions = React.useMemo(() => {
    if (auth.userType === UserTypeEnum.MEMBER) {
      console.log("next addable optons: member")
      // member
      return order.nextMemberOrderEventOptions
    } else {
      // admin
      console.log("next addable optons: admin")
      return order.nextAdminOrderEventOptions
    }
  }, [JSON.stringify(order)])

  // close form dialog only when success for post/put/delete
  const curPostFetchStatus = useSelector(rsSelector.app.getPostOrderEventFetchStatus);
  const curPutFetchStatus = useSelector(rsSelector.app.getPutOrderEventFetchStatus);
  const curDeleteSingleFetchStatus = useSelector(rsSelector.app.getDeleteSingleOrderEventFetchStatus);
  React.useEffect(() => {
    if (
      curPostFetchStatus === FetchStatusEnum.SUCCESS ||
      curPutFetchStatus === FetchStatusEnum.SUCCESS ||
      curDeleteSingleFetchStatus === FetchStatusEnum.SUCCESS
    ) {
      setDeleteDialogOpen(false)
      setFormOpen(false)

      dispatch(
        postOrderEventFetchStatusActions.clear()
      )
      dispatch(
        putOrderEventFetchStatusActions.clear()
      )
      dispatch(
        deleteSingleOrderEventFetchStatusActions.clear()
      )
    }
  })

  const renderTimelineContent: (orderEvent: OrderEventType, latestOrderEvent: OrderEventType) => React.ReactNode = (orderEvent, latestOrderEvent) => {

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
              {orderEvent.note ? orderEvent.note : orderStatusObj.defaultNote}
            </Typography>
            <Divider />
            <Box>
              {(auth.userType === UserTypeEnum.ADMIN &&
                <IconButton onClick={(e) => handleEditClick(e, orderEvent.orderEventId)}>
                  <EditIcon />
                </IconButton>
              )}
              {(auth.userType === UserTypeEnum.ADMIN && orderEvent.undoable && orderEvent.orderEventId === latestOrderEvent.orderEventId &&
                <IconButton onClick={(e) => handleDeleteClick(e, orderEvent.orderEventId)}>
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
    return order.orderEvents.map((orderEvent: OrderEventType, index: number) => {
      return renderTimelineContent(orderEvent, order.latestOrderEvent)
    })
  }

  return (
    <React.Fragment>
      <Timeline align="alternate" className={classes.root}>
        {renderTimeline()}
        <Box className={classes.btnBox}>
          <Button
            className={classes.addBtn}
            disabled={!nextOrderEventOptions || nextOrderEventOptions.length === 0}
            onClick={(e) => handleAddNewClick(e)}
            variant="contained"
          >
            {"Add New Order Event"}
          </Button>
        </Box>
      </Timeline>
      {/** update form dialog **/}
      <OrderEventUpdateFormDialog
        onClose={handleFormCloseClick}
        open={curFormOpen}
        orderEvent={curOrderEvent}
        order={order}
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
          <Button autoFocus onClick={handleDeletionCancel} variant="contained">
            Cancel
          </Button>
          <Button onClick={handleDeletionOk} variant="contained">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default OrderTimeline



