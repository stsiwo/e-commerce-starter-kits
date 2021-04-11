import CustomerBasicForm from "components/common/Checkout/CustomerBasicForm";

export declare type CheckoutStepComponentPropsType = {
  onNextStepClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
  onPrevStepClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
}

export declare type CheckoutStepType = {
  label: string
  component: React.FunctionComponent<CheckoutStepComponentPropsType>
}

export const checkoutSteps: CheckoutStepType[] = [
  {
    label: "Customer Basic Information",
    component: CustomerBasicForm,
  },
  {
    label: "Customer Contact Information",
    component: null,
  },
  {
    label: "Product Information",
    component: null,
  },
  {
    label: "Payment",
    component: null,
  }
]

