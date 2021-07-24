import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import {
  generateDefaultOrderEventData,
  hasNextOrderOptions,
  OrderEventType,
  orderStatusBagList,
  OrderStatusEnum,
} from "domain/order/types";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "reducers/slices/domain/order";
import { AuthType } from "src/app";
import { mSelector } from "src/selectors/selector";

interface TimelineUpdateFormPropsType {
  orderId: string;
  orderEvents: OrderEventType[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      margin: "0 auto",
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    form: {
      textAlign: "center",
      margin: theme.spacing(1),
    },
    txtFieldBase: {
      width: "80%",
      margin: theme.spacing(1),
    },
    actionBox: {},
  })
);

/**
 * admin time line update  management component
 *
 **/
const TimelineUpdateForm: React.FunctionComponent<TimelineUpdateFormPropsType> =
  ({ orderId, orderEvents }) => {
    // mui: makeStyles
    const classes = useStyles();

    // snackbar notification
    // usage: 'enqueueSnackbar("message", { variant: "error" };
    const { enqueueSnackbar } = useSnackbar();

    // order bag item
    const lastOrderEvent =
      orderEvents.length > 0 ? orderEvents[orderEvents.length - 1] : null;
    const lastOrderStatusBag = orderStatusBagList[lastOrderEvent.orderStatus];

    const dispatch = useDispatch();

    // drop down
    const [expanded, setExpanded] = React.useState(false);
    const handleExapandClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      setExpanded(!expanded);
    };

    // order event form stuff
    const auth: AuthType = useSelector(mSelector.makeAuthSelector());
    const [curOrderEventState, setOrderEventState] =
      React.useState<OrderEventType>(generateDefaultOrderEventData());

    const handleNoteInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextNote = e.currentTarget.value;
      setOrderEventState((prev: OrderEventType) => ({
        ...prev,
        note: nextNote,
      }));
    };

    const handleOrderStatusInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextOrderStatus = lastOrderStatusBag.nextOptions[
        auth.userType
      ].find(
        (orderStatus: OrderStatusEnum) => e.currentTarget.value === orderStatus
      );
      setOrderEventState((prev: OrderEventType) => ({
        ...prev,
        orderStatus: nextOrderStatus,
      }));
    };

    const handleCreatedAtChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextCreatedAt = e.currentTarget.value;
      setOrderEventState((prev: OrderEventType) => ({
        ...prev,
        createdat: nextCreatedAt,
      }));
    };

    // save event handler
    const handleNextOrderStatusSaveClickEvent: React.EventHandler<
      React.MouseEvent<HTMLInputElement>
    > = (e) => {
      // request
      api
        .request({
          method: "POST",
          url: API1_URL + `/orders/${orderId}/events`,
          data: curOrderEventState,
        })
        .then((data) => {
          const newOrderEvent = data.data;

          // fetch again
          dispatch(orderActions.appendEvent(newOrderEvent));

          enqueueSnackbar("updated successfully.", { variant: "success" });
        })
        .catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" });
        });
    };

    if (!hasNextOrderOptions(lastOrderStatusBag, auth.userType)) return null;

    return (
      <Card className={classes.root}>
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={handleExapandClickEvent}>
              <ExpandMoreIcon />
            </IconButton>
          }
          titleTypographyProps={{
            variant: "subtitle1",
          }}
          title="Add Next Status"
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <form className={classes.form} noValidate autoComplete="off">
              <TextField
                id="order-event-order-status"
                label="Order Status"
                className={`${classes.txtFieldBase}`}
                select
                value={curOrderEventState.orderStatus}
                onChange={handleOrderStatusInputChangeEvent}
              >
                {lastOrderEvent &&
                  hasNextOrderOptions(lastOrderStatusBag, auth.userType) &&
                  lastOrderStatusBag.nextOptions[auth.userType].map(
                    (orderStatus: OrderStatusEnum) => (
                      <MenuItem key={orderStatus} value={orderStatus}>
                        {orderStatus}
                      </MenuItem>
                    )
                  )}
              </TextField>
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
              <Box component="div" className={classes.actionBox}>
                <Button
                  onClick={handleNextOrderStatusSaveClickEvent}
                  variant="contained"
                >
                  Save
                </Button>
              </Box>
            </form>
          </CardContent>
        </Collapse>
      </Card>
    );
  };

export default TimelineUpdateForm;
