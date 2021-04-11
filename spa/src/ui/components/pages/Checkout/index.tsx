import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stepper from '@material-ui/core/Stepper';
import { checkoutSteps, CheckoutStepType } from './checkoutSteps';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CustomerBasicForm from 'components/common/Checkout/CustomerBasicForm';
import { mSelector } from 'src/selectors/selector';
import { UserTypeEnum } from 'src/app';
import CustomerContactForm from 'components/common/Checkout/CustomerContactForm';

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

  // step state
  const [activeStep, setActiveStep] = React.useState<number>(0);

  // step event handlers
  const handleNextStepClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setActiveStep((prev: number) => prev + 1)
  }

  const handlePrevStepClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setActiveStep((prev: number) => prev - 1)
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
            <CustomerBasicForm onNextStepClick={handleNextStepClick} onPrevStepClick={handlePrevStepClick} user={auth.user} />
            <Button
              disabled={activeStep === 0}
              onClick={handlePrevStepClick}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStepClick}
            >
              {activeStep === checkoutSteps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </StepContent>
        </Step>
        {/** customer contact info **/}
        <Step >
          <StepLabel>{"Customer Contact Information"}</StepLabel>
          <StepContent>
            <CustomerContactForm onNextStepClick={handleNextStepClick} onPrevStepClick={handlePrevStepClick} user={auth.user} />
            <Button
              disabled={activeStep === 0}
              onClick={handlePrevStepClick}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStepClick}
            >
              {activeStep === checkoutSteps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </StepContent>
        </Step>
        {/** product information **/}
        <Step >
          <StepLabel>{"Product Information"}</StepLabel>
          <StepContent>
            <CustomerBasicForm onNextStepClick={handleNextStepClick} onPrevStepClick={handlePrevStepClick} user={auth.user} />
            <Button
              disabled={activeStep === 0}
              onClick={handlePrevStepClick}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStepClick}
            >
              {activeStep === checkoutSteps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </StepContent>
        </Step>
      </Stepper>
    </React.Fragment>
  )
}

export default Checkout


