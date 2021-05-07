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
import { mSelector } from 'src/selectors/selector';
import FinalConfirmForm from 'components/common/Checkout/FinalConfirmForm';
import Button from '@material-ui/core/Button';
import OrderItemForm from 'components/common/Checkout/OrderItemForm';

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
            <Button onClick={(e) => goToStep(CheckoutStepEnum.FINAL_CONFIRM)}>Final Conform</Button>
            <Button onClick={(e) => goToStep(CheckoutStepEnum.ORDER_ITEMS)}>Order Items</Button>
            <Button onClick={(e) => goToStep(CheckoutStepEnum.PAYMENT)}>Payment</Button>
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


