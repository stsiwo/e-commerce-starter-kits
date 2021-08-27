import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { fetchSingleAuthOrderActionCreator } from "reducers/slices/app";
import { mSelector } from "src/selectors/selector";
import OrderForm from "./OrderForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center",
    },
  })
);

/**
 * guest & member orderdetail page
 *
 **/
const Order: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { orderId } = useParams<{ orderId: string }>();

  const auth = useSelector(mSelector.makeAuthSelector());
  const curOrder = useSelector(mSelector.makeOrderByIdSelector(orderId));

  React.useEffect(() => {
    if (!curOrder) {
      dispatch(
        fetchSingleAuthOrderActionCreator({
          orderId: orderId,
          userId: auth.user.userId,
        })
      );
    }
  }, []);

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {"Order"}
      </Typography>
      {curOrder && <OrderForm order={curOrder} />}
    </React.Fragment>
  );
};

export default Order;
