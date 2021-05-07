import { CheckoutStepEnum } from ".";

export declare type CheckoutStepComponentPropsType = {
  goToPrevStep?: () => void 
  goToNextStep?: () => void 
  goToStep?: (step: CheckoutStepEnum) => void
}
