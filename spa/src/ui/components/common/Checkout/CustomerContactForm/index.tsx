import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CheckoutStepComponentPropsType } from "components/pages/Checkout/checkoutSteps";
import { UserType } from "domain/user/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageActions } from "reducers/slices/app";
import { MessageTypeEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
import CustomerAddressesForm from "./CustomerAddressesForm";
import CustomerPhonesForm from "./CustomerPhonesForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionBox: {
      textAlign: "right",
    },
  })
);

declare type CustomerContactFormPropsType = {
  user: UserType;
} & CheckoutStepComponentPropsType;

/**
 * checkout: customer information (contact) component
 *
 * process:
 *
 *   1. keep track of phone and addresses (shipping & billing)
 *
 *   2. display currently registered phones and addresses
 *
 *   3. provide 'add' & 'remove' option
 *
 *   4. send a update request after update those
 *
 **/
const CustomerContactForm: React.FunctionComponent<CustomerContactFormPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    const dispatch = useDispatch();

    const curPrimaryPhone = useSelector(
      mSelector.makeAuthSelectedPhoneSelector()
    );
    const curBillingAddress = useSelector(
      mSelector.makeAuthBillingAddressSelector()
    );
    const curShippingAddress = useSelector(
      mSelector.makeAuthShippingAddressSelector()
    );

    // event handler to validate phone & addresses
    const handleValidateClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      //  - check each phone and addresses whether it sets the isSelected, isBillingAddress, isShippingAddress
      if (curPrimaryPhone && curBillingAddress && curShippingAddress) {
        // validation passed
        props.goToNextStep();
      } else {
        // validation failed.

        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.ERROR,
            message:
              "please select phone, shipping address, and billing address.",
          })
        );
      }
    };

    return (
      <Grid container justify="center">
        <Grid item xs={12} md={6}>
          <CustomerPhonesForm phones={props.user.phones} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomerAddressesForm addresses={props.user.addresses} />
        </Grid>
        <Grid item xs={12}>
          <Box component="div" className={classes.actionBox}>
            <Button onClick={(e) => props.goToPrevStep()} variant="contained">
              {"Previous"}
            </Button>
            <Button onClick={handleValidateClick} variant="contained">
              {"Confirm"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  };

export default CustomerContactForm;
