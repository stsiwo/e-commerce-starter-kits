import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {
  generateDefaultOrderEventData,
  OrderEventType,
  OrderStatusEnum,
  OrderType,
} from "domain/order/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAuthOrderEventActionCreator } from "reducers/slices/app";
import {
  postOrderEventActionCreator,
  putOrderEventActionCreator,
} from "reducers/slices/domain/order";
import { AuthType, UserTypeEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import Typography from "@material-ui/core/Typography";
import { logger } from "configs/logger";
const log = logger(__filename);

interface OrderEventUpdateFormDialogPropsType {
  open: boolean;
  onClose: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
  orderEvent: OrderEventType;
  order: OrderType;
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
    actionBox: {},
    warning: {
      fontWeight: "bold",
    },
  })
);

const OrderEventUpdateFormDialog: React.FunctionComponent<OrderEventUpdateFormDialogPropsType> =
  (props) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    // order event form stuff
    const auth: AuthType = useSelector(mSelector.makeAuthSelector());
    const [curOrderEventState, setOrderEventState] =
      React.useState<OrderEventType>(generateDefaultOrderEventData());

    // update/create logic for product
    //  - true: create
    //  - false: update
    // if props.product exists, it updates, otherwise, new
    const [isNew, setNew] = React.useState<boolean>(false);

    log("is props.orderEvent changed?");
    log(props.orderEvent);

    // switch update/create
    React.useEffect(() => {
      /**
       * need this 'props.open' since if user open 'edit' after the anotehr 'edit', it still previous input exists.
       * so every time form is open, we need to set target entity state.
       */
      if (props.open) {
        if (props.orderEvent) {
          log("update order event");
          setNew(false);
          setOrderEventState(props.orderEvent);
        } else {
          log("create order event");
          setNew(true);
          setOrderEventState(generateDefaultOrderEventData());
        }
      }
    }, [JSON.stringify(props.orderEvent), props.open]);

    /**
     * update btn click event handler
     **/
    const handleFormSaveClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      /**
       * skip validation since there is less fields to validate (overkill)
       *
       **/
      if (auth.userType === UserTypeEnum.ADMIN) {
        // admin
        if (isNew) {
          log("new order event creation");
          // request
          dispatch(
            postOrderEventActionCreator({
              orderStatus: curOrderEventState.orderStatus,
              orderId: props.order.orderId,
              note: curOrderEventState.note,
              userId: auth.user.userId,
            })
          );
        } else {
          log("update order event");
          // request
          dispatch(
            putOrderEventActionCreator({
              orderEventId: curOrderEventState.orderEventId,
              orderId: props.order.orderId,
              note: curOrderEventState.note,
              userId: auth.user.userId,
            })
          );
        }
      } else {
        // member
        if (isNew) {
          // request
          dispatch(
            postAuthOrderEventActionCreator({
              orderStatus: curOrderEventState.orderStatus,
              orderId: props.order.orderId,
              note: curOrderEventState.note,
              userId: auth.user.userId,
            })
          );
        }
      }
    };

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
      const nextOrderStatus = e.target.value as OrderStatusEnum;
      setOrderEventState((prev: OrderEventType) => ({
        ...prev,
        orderStatus: nextOrderStatus,
      }));
    };

    // next addable option based on user type
    const nextOrderEventOptions = React.useMemo(() => {
      if (auth.userType === UserTypeEnum.MEMBER) {
        log("next addable optons: member");
        // member
        return props.order.nextMemberOrderEventOptions;
      } else {
        // admin
        log("next addable optons: admin");
        return props.order.nextAdminOrderEventOptions;
      }
    }, [JSON.stringify(props.order)]);

    return (
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="order-event-update-dialog"
      >
        <DialogTitle id="order-event-update-dialog-title">
          Order Event Form
        </DialogTitle>
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
              {!isNew &&
                curOrderEventState && ( // this is to display the order status of existing order event. nothing relating to new order event.
                  <MenuItem
                    key={curOrderEventState.orderStatus}
                    value={curOrderEventState.orderStatus}
                  >
                    {curOrderEventState.orderStatus}
                  </MenuItem>
                )}
              {nextOrderEventOptions.map((orderStatus: OrderStatusEnum) => (
                <MenuItem key={orderStatus} value={orderStatus}>
                  {orderStatus}
                </MenuItem>
              ))}
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
            {(curOrderEventState.orderStatus === OrderStatusEnum.CANCELED ||
              curOrderEventState.orderStatus === OrderStatusEnum.RETURNED) && (
              <Typography
                variant="body1"
                component="p"
                align="left"
                className={classes.warning}
                color="error"
              >
                {
                  "This order event cannot be undo once you add it and the payment will be refund to the customer. Are you sure you want to add this event?"
                }
              </Typography>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={handleFormSaveClick}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default OrderEventUpdateFormDialog;
