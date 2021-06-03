import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CustomerBasicForm from 'components/common/Checkout/CustomerBasicForm';
import CustomerContactForm from 'components/common/Checkout/CustomerContactForm';
import Payment from 'components/common/Checkout/Payment';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mSelector, rsSelector } from 'src/selectors/selector';
import FinalConfirmForm from 'components/common/Checkout/FinalConfirmForm';
import Button from '@material-ui/core/Button';
import OrderItemForm from 'components/common/Checkout/OrderItemForm';
import { postSessionTimeoutOrderEventActionCreator } from 'reducers/slices/domain/order';
import { FetchStatusEnum } from 'src/app';

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
      margin: theme.spacing(6)
    },
  }),
);

/**
 * checkout page
 *
 *  - popup if user is not logged in
 **/
const Checkout: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const auth = useSelector(mSelector.makeAuthSelector())

  /**
   * steps:
   *  0: customer basic information
   *  1: customer contact information
   *  2: final confirmation
   *  3: payment
   **/
  const [activeStep, setActiveStep] = React.useState<CheckoutStepEnum>(CheckoutStepEnum.CUSTOMER_BASIC_INFORMATION);

  // step event handlers

  const goToStep: (step: CheckoutStepEnum) => void = (step) => {
    setActiveStep(step);
  }

  const goToNextStep: () => void = () => {
    setActiveStep((prev: CheckoutStepEnum) => (prev.valueOf() + 1 as CheckoutStepEnum))
  }

  const goToPrevStep: () => void = () => {
    setActiveStep((prev: CheckoutStepEnum) => (prev.valueOf() - 1 as CheckoutStepEnum))
  }

  const dispatch = useDispatch()

  /**
   * session time out stuff.
   *
   * if the customer does not finsih payment in CHECKOUT_SESSION_TIMEOUT, we cancel the final confirm and make the customer start over again. just click the final confirm again though.
   *
   * - this is because to prevent the customer occupies the product stock and make it avaible to the other customers.
   *
   **/
  const curCheckoutOrder = useSelector(rsSelector.domain.getCheckoutOrder);

  const handleSessionTimeout = () => {
    // if timeout, get the customer back to final confirm section.
    setActiveStep(CheckoutStepEnum.ORDER_ITEMS)

    dispatch(
      postSessionTimeoutOrderEventActionCreator({
        orderId: curCheckoutOrder.orderId,
        orderNumber: curCheckoutOrder.orderNumber,
      })

    );
  }

  const sessionTime: number = parseInt(CHECKOUT_SESSION_TIMEOUT)
  const curPostOrderFetchStatus = useSelector(rsSelector.app.getPostOrderFetchStatus);
  React.useEffect(() => {

    let timer: ReturnType<typeof setTimeout>;

    console.log("current checkout step: " + activeStep)

    if (curPostOrderFetchStatus === FetchStatusEnum.SUCCESS) {
      console.log("start session")
      //setTimeout(handleSessionTimeout, sessionTime)
      timer = setTimeout(handleSessionTimeout, 1000)
    }

    return () => {
      clearTimeout(timer);
    }
  }, [
      curPostOrderFetchStatus
    ])


  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Checkout"}
      </Typography>
      {/** customer basic info **/}
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step >
          <StepLabel>{"Customer Basic Information"}</StepLabel>
          <StepContent>
            <CustomerBasicForm
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
              goToStep={goToStep}
              user={auth.user}
            />
            {(NODE_ENV === 'development' &&
              <React.Fragment>
                <Button onClick={(e) => goToStep(CheckoutStepEnum.FINAL_CONFIRM)}>Final Conform</Button>
                <Button onClick={(e) => goToStep(CheckoutStepEnum.ORDER_ITEMS)}>Order Items</Button>
                <Button onClick={(e) => goToStep(CheckoutStepEnum.PAYMENT)}>Payment</Button>
              </React.Fragment>
            )}
          </StepContent>
        </Step>
        {/** customer contact info **/}
        <Step >
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
        <Step >
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
        <Step >
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
        <Step >
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
    </React.Fragment>
  )
}

export default Checkout


