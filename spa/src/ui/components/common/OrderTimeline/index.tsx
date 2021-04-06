import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Timeline from '@material-ui/lab/Timeline';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import { OrderEventType, orderStatusBagList } from 'domain/order/types';
import * as React from 'react';

interface OrderTimelinePropsType {
  orderEvents: OrderEventType[]
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
const OrderTimeline: React.FunctionComponent<OrderTimelinePropsType> = ({ orderEvents }) => {

  // mui: makeStyles
  const classes = useStyles();

  const renderTimelineContent: (orderEvent: OrderEventType) => React.ReactNode = (orderEvent) => {

    const OrderStatusIcon = orderStatusBagList[orderEvent.orderStatus].icon
    const orderStatusObj = orderStatusBagList[orderEvent.orderStatus]

    return (
      <TimelineItem key={orderEvent.orderEventId}>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            {/**orderEvent.createdAt**/}
            {"PM 10:00"}
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
    <Timeline align="alternate">
      {renderTimeline()}
    </Timeline>
  )
}

export default OrderTimeline



