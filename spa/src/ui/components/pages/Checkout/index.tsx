import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CustomerBasicForm from "components/common/Checkout/CustomerBasicForm";
import CustomerContactForm from "components/common/Checkout/CustomerContactForm";
import FinalConfirmForm from "components/common/Checkout/FinalConfirmForm";
import OrderItemForm from "components/common/Checkout/OrderItemForm";
import Payment from "components/common/Checkout/Payment";
import { logger } from "configs/logger";
import { CheckoutSessionStatusEnum } from "domain/order/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { putAuthFetchStatusActions } from "reducers/slices/app/fetchStatus/auth";
import { resetCheckoutStateActionCreator } from "reducers/slices/common";
import { checkoutSessionStatusActions } from "reducers/slices/domain/checkout";
import { postSessionTimeoutOrderEventActionCreator } from "reducers/slices/domain/order";
import { FetchStatusEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
const log = logger(__filename);

export enum CheckoutStepEnum {
  CUSTOMER_BASIC_INFORMATION = 0,
  CUSTOMER_CONTACT_INFORMATION = 1,
  ORDER_ITEMS = 2,
  FINAL_CONFIRM = 3,
  PAYMENT = 4,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
  })
);

/**
 * checkout page
 *
 *  - popup if user is not logged in
 **/
const Checkout: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const auth = useSelector(mSelector.makeAuthSelector());

  /**
   * steps:
   *  0: customer basic information
   *  1: customer contact information
   *  2: final confirmation
   *  3: payment
   **/
  const [activeStep, setActiveStep] = React.useState<CheckoutStepEnum>(
    CheckoutStepEnum.CUSTOMER_BASIC_INFORMATION
  );

  // step event handlers

  const goToStep: (step: CheckoutStepEnum) => void = (step) => {
    setActiveStep(step);
  };

  const goToNextStep: () => void = () => {
    setActiveStep(
      (prev: CheckoutStepEnum) => (prev.valueOf() + 1) as CheckoutStepEnum
    );
  };

  const goToPrevStep: () => void = () => {
    setActiveStep(
      (prev: CheckoutStepEnum) => (prev.valueOf() - 1) as CheckoutStepEnum
    );
  };

  const dispatch = useDispatch();

  /**
   * backdrop while creating a new order.
   *
   **/
  const curPostOrderFetchStatus = useSelector(
    rsSelector.app.getPostOrderFetchStatus
  );
  const curCheckoutOrder = useSelector(rsSelector.domain.getCheckoutOrder);
  const [curBackdropOpen, setBackdropOpen] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (curPostOrderFetchStatus === FetchStatusEnum.FETCHING) {
      setBackdropOpen(true);
    } else {
      setBackdropOpen(false);
    }
  }, [curPostOrderFetchStatus]);

  /**
   * backdrop while fetching rating info
   *
   **/
  const curRatingFetchStatus = useSelector(rsSelector.app.getRatingFetchStatus);
  React.useEffect(() => {
    if (curRatingFetchStatus === FetchStatusEnum.FETCHING) {
      setBackdropOpen(true);
    } else {
      setBackdropOpen(false);
    }
  }, [curRatingFetchStatus]);
  /**
   * session time out stuff.
   *
   * if the customer does not finsih payment in CHECKOUT_SESSION_TIMEOUT, we cancel the final confirm and make the customer start over again. just click the final confirm again though.
   *
   * - this is because to prevent the customer occupies the product stock and make it avaible to the other customers.
   *
   * if current checkout session status is anything but IN_SESSION, we need to clear session time.
   *
   **/
  const curCheckoutSessionStatus = useSelector(
    rsSelector.domain.getCheckoutSessionStatus
  );

  const handleSessionTimeout = () => {
    log("session time out");
    dispatch(
      postSessionTimeoutOrderEventActionCreator({
        orderId: curCheckoutOrder.orderId,
        orderNumber: curCheckoutOrder.orderNumber,
        orderVersion: curCheckoutOrder.version,
      })
    );

    // if timeout, get the customer back to final confirm section.
    setActiveStep(CheckoutStepEnum.CUSTOMER_BASIC_INFORMATION);

    // update sessionStatus (global state)
    dispatch(
      checkoutSessionStatusActions.update(CheckoutSessionStatusEnum.EXPIRED)
    );
  };
  const sessionTime: number = parseInt(CHECKOUT_SESSION_TIMEOUT);
  let timer: ReturnType<typeof setTimeout>;

  /**
   * if session status is IN_SESSION, start session timer.
   *
   * Otherwise, clear the timer when the following:
   *  1. session status is either INITIAL, EXPIRED, and PAYMENT_ATTEMPTED
   *  2. if the user abort this session (e.g., handle this by unsubscribe.
   *
   **/
  React.useEffect(() => {
    log(curCheckoutSessionStatus);
    if (curCheckoutSessionStatus === CheckoutSessionStatusEnum.IN_SESSION) {
      log("session status is in_session so start timer");
      timer = setTimeout(handleSessionTimeout, sessionTime); // this will change session status to be expired.

      /**
       * need to add this otherwise, the above timer is not canceled even if session status changed.
       **/
      return () => {
        clearTimeout(timer);
      };
    } else {
      log("session status is NOT in_session so clear timer");
      clearTimeout(timer);
    }

    // don't forget to cancel timer.
    // if this component is unmounted, this timer is unsubscribed.
    /**
     * cleanup function is run every time when dependencies has changed!!!
     *
     * this is different from class-based one (e.g., ComponentDidUnmounted), so be careful!!.
     *
     * ref: https://stackoverflow.com/questions/57023074/why-is-the-cleanup-function-from-useeffect-called-on-every-render
     *
     * how to run the cleanup only when unmount?
     *  = you can use another useEffect with [] as the 2nd arg so that this will only run only when mount/unmount.
     *
     * in this use case, I don't want to run the cleanup every time so comment out and create another useEffect.
     *
     **/
    //return () => {
    //  log("umount so clear timer")
    //  clearTimeout(timer);
    //}
  }, [curCheckoutSessionStatus]);

  // cleanup - clear timer
  React.useEffect(() => {
    return () => {
      log("umount so reset timer");
      clearTimeout(timer);
    };
  }, []);

  // reset auth fetch status which affect validating the current section.
  // this is necessary since the customer might come back to the specific section again and again.
  // every time the customer come back, we need to reset the previous state.
  React.useEffect(() => {
    // you only need to reset if fetch status which affect validation to the next step.
    // ex)
    /**
     * // if member, we need to make sure the request (update) succeeded or not. if yes, they can go next.
     * const curPutAuthFetchStatus = useSelector(rsSelector.app.getPutAuthFetchStatus);
     * React.useEffect(() => {
     *   if (curPutAuthFetchStatus === FetchStatusEnum.SUCCESS) {
     *     props.goToNextStep();
     *   }
     *   return () => {
     *     // reset fetch status in the case where the other component needs this.
     *     dispatch(
     *       putAuthFetchStatusActions.clear()
     *     )
     *   }
     * }, [])
     **/
    dispatch(putAuthFetchStatusActions.clear());
  }, [activeStep]);

  /**
   * reset checkout state handling.
   *
   * we need to reset the checkout state when following:
   *  1. payment attempted regardless of the result since each checkout need to be new. (e.g., session status = PAYMENT_ATTEMPTED, EXIPRED)
   *  2. the customer abort (e.g., go to another page) during payment section, we need to reset the checkout state 
   *
   * currently, this action (resetCheckoutStatus) is caught by following case reducers:
   *
      - stripeClientSecretActions
      - checkoutOrderActions
      - postOrderFetchStatusActions
      - checkoutIsRatingSuccess
   *
   *
   **/
  React.useEffect(() => {
    if (
      curCheckoutSessionStatus === CheckoutSessionStatusEnum.EXPIRED ||
      curCheckoutSessionStatus === CheckoutSessionStatusEnum.PAYMENT_ATTEMPTED
    ) {
      log(
        "reset checkout status since its status is expired or payment_attempted"
      );
      dispatch(resetCheckoutStateActionCreator());
    }
    /**
     * cleanup function is run every time when dependencies has changed!!!
     *
     * this is different from class-based one (e.g., ComponentDidUnmounted), so be careful!!.
     *
     * ref: https://stackoverflow.com/questions/57023074/why-is-the-cleanup-function-from-useeffect-called-on-every-render
     *
     * how to run the cleanup only when unmount?
     *  = you can use another useEffect with [] as the 2nd arg so that this will only run only when mount/unmount.
     *
     * in this use case, I don't want to run the cleanup every time so comment out and create another useEffect.
     *
     **/
    // unmount only
    //return () => {
    //  log("reset checkout since this user leaves the checkout page")
    //  dispatch(
    //    resetCheckoutStateActionCreator()
    //  )
    //}
  }, [curCheckoutSessionStatus]);

  // only run this clean up when unmount
  React.useEffect(() => {
    return () => {
      log("reset checkout since this user leaves the checkout page");
      dispatch(resetCheckoutStateActionCreator());
    };
  }, []);

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {"Checkout"}
      </Typography>
      {/** customer basic info **/}
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>{"Customer Basic Information"}</StepLabel>
          <StepContent>
            <CustomerBasicForm
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
              goToStep={goToStep}
              user={auth.user}
            />
            {NODE_ENV === "development" && (
              <React.Fragment>
                <Button
                  onClick={(e) => goToStep(CheckoutStepEnum.FINAL_CONFIRM)}
                  variant="contained"
                >
                  Final Conform
                </Button>
                <Button
                  onClick={(e) => goToStep(CheckoutStepEnum.ORDER_ITEMS)}
                  variant="contained"
                >
                  Order Items
                </Button>
                <Button
                  onClick={(e) => goToStep(CheckoutStepEnum.PAYMENT)}
                  variant="contained"
                >
                  Payment
                </Button>
              </React.Fragment>
            )}
          </StepContent>
        </Step>
        {/** customer contact info **/}
        <Step>
          <StepLabel>{"Customer Contact Information"}</StepLabel>
          <StepContent>
            <CustomerContactForm
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
              goToStep={goToStep}
              user={auth.user}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>{"Order Items"}</StepLabel>
          <StepContent>
            <OrderItemForm
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
              goToStep={goToStep}
              user={auth.user}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>{"Final Confirm"}</StepLabel>
          <StepContent>
            <FinalConfirmForm
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
              goToStep={goToStep}
              user={auth.user}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>{"Payment"}</StepLabel>
          <StepContent>
            <Payment
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
              goToStep={goToStep}
              user={auth.user}
            />
          </StepContent>
        </Step>
      </Stepper>
      <Backdrop className={classes.backdrop} open={curBackdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
};

export default Checkout;
