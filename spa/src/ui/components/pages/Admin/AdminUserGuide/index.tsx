import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      flexGrow: 1,
      padding: theme.spacing(0, 1),
      /**
       * this is necessary for scrollable tabs (from Mui) used for filter/sort for each domain.
       **/
      width: "100%",
    },
    accordionDetailRoot: {
      display: "block",
    },
    subsection: {
      marginBottom: theme.spacing(1),
    },
    subheader: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: "1rem",
    },
    parag: {
      marginLeft: theme.spacing(1),
    },
  })
);

/**
 * admin account management page
 *
 **/
const AdminDashboard: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  return (
    <Box component="div" className={classes.box}>
      <Typography variant="h6" component="h6">
        User Guide
      </Typography>
      {/** Policies */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Policies
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Refund Policy
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              A Refund is only available for <b>30 days</b> after the package is
              delivered.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              Support a full refund and a partial refund. A full refund is
              automatically managed by this web app when the admin handles a
              return or cancel. A partial refund requires the admin to manually
              handle the transaction at the Stripe console.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              We ask customers to keep the following information for refunds:
            </Typography>
            <ul>
              <li>the receipt of payment which we sent after your purchase</li>
              <li>
                the order number included in the confirmation email after your
                purchase
              </li>
            </ul>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="p"
              className={classes.subheader}
            >
              Supported Countries
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              Currently, supported countries of this app are{" "}
              <b>domestic only</b>.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Users */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Users
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              User Type
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              We define the following user types:
            </Typography>
            <ul>
              <li>
                <b>guest</b>: a customer without membership
              </li>
              <li>
                <b>member</b>: a customer with membership
              </li>
              <li>
                <b>admin</b>: an admin who manages this web app
              </li>
            </ul>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              User Status
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              Also, a member belongs to one of the following statuses:
            </Typography>
            <ul>
              <li>
                <b>temporary</b>: a member who signed up but does not verify the
                email.
              </li>
              <li>
                <b>active</b>:a member who signed up and verified with the
                email.
              </li>
              <li>
                <b>admin</b>: a member who did suspicious behaviors. this member
                cannot log in unless the admin changes the status to either
                temporary or active.
              </li>
              <li>
                <b>deleted by customer</b>: a member who requests for the
                deletion of our membership.
              </li>
            </ul>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Deletion Request From A Member
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              Any member can request the deletion of his/her membership, but
              this is a temporary deletion. The admin must delete the account
              permanently.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              The member cannot create an account with the email used to create
              the account before until the admin permanently deletes the
              account.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              The member can restore the account if they want, but they need to
              contact the admin and ask for restoration and must be before the
              admin deletes the account permanently.:w
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Categories */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Validation
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              A category name and path must be unique for each category.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              If you want to remove a category, the category cannot have any
              product belonging to the category. In order to remove the
              category, you need to change the category of those products first.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Products */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Products
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Validation
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              Product name and path must be unique for each product.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              The max product price: $10000.00 (need to set the max in order to
              calculate the cheapest price of this product) and the min product
              price: $1.00.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              Any Product must have the primary image (e.g., the 1st image).
            </Typography>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Publishing
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              To publish your product, there are two conditions
            </Typography>
            <ul>
              <li>release date must be after or equal to today.</li>
              <li>the product must have at least one product.</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              We automatically publish products when a release date is set in
              the future if the product has at least one product.
            </Typography>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Product Images
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              We recommended product image size be around 800x800 (1:1). You
              don't need to put a huge image. it makes performance worse.
            </Typography>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Product Size
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              Currently, we provide you the following available product sizes:
            </Typography>
            <ul>
              <li>XS</li>
              <li>S</li>
              <li>M</li>
              <li>L</li>
              <li>XL</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              These sizes are just simple standards. If you need a more accurate
              product size, use the description or note with the product sizes
              (e.g., XS: 10cm, S: 20cm, and so on)
            </Typography>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Product Variant
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              Weight, length, width, and height are used for calculating
              shipping info (e.g., rating), and there are minimum values:
            </Typography>
            <ul>
              <li>Weight: 0.01 kg</li>
              <li>Length: 1.00 cm</li>
              <li>Width: 1.00 cm</li>
              <li>Height: 1.00 cm</li>
            </ul>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Product Price
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              There are three types of price:
            </Typography>
            <ul>
              <li>
                <b>product base unit price</b>: (mandatory) If you don't specify
                the product variant unit price for its variant, this base unit
                price is applied for the variant price.
              </li>
              <li>
                <b>product variant unit price</b>: (optional) If you specify the
                price, this is the price of the variant.
              </li>
              <li>
                <b>product variant discount price</b>: (optional) If you enable
                the discount of a variant, you need to specify the discount
                price and its start and end date. the discount price is the
                price of the variant during the date. The discount price must be
                cheaper than the price of the base unit price/variant unit
                price.
              </li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              e.g.,
            </Typography>
            <ul>
              <li>
                <b>Product A</b>: base unit price: $10.00
              </li>
              <li>
                <b>Product Variant A_1</b>: no variant unit price &#61;&#62;
                this variant price is $10.00
              </li>
              <li>
                <b>Product Variant A_2</b>: variant unit price: $20.00
                &#61;&#62; this variant price is $20.00
              </li>
              <li>
                <b>Product Variant A_3</b>: variant unit price $30.00 and
                discount price: $25.00 &#61;&#62; this variant price is $25.00
                during the discount period.
              </li>
            </ul>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Discount
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              A product variant can be discount if the following conditions are
              met:
            </Typography>
            <ul>
              <li>discount checkbox is checked.</li>
              <li>
                the current date is during the discount start date and end date
                (both inclusive).
              </li>
            </ul>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Shipping */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Shipping
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Features
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              The current version of this web app does not fully support the
              shipping feature. We only support the following features:
            </Typography>
            <ul>
              <li>
                calculate the estimated shipping cost and delivery date based on
                the weight of the product.
              </li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              This price is approximate so not precise. If we add
              length/width/height to the calculation but if customers buy
              multiple items, it is impossible to get the proper
              length/width/height so we decided not to include those criteria.
            </Typography>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Postal Service
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              We use Canada Post as a main postal service. Currently, we only
              estimate shipping cost and delivery date with 'regular parcel'
              without any options (e.g., no express or any other options).
            </Typography>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Flow
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              The admin is responsible for taking care of the following tasks
              for shipping:
            </Typography>
            <ol>
              <li>packing the items</li>
              <li>bring the items to Canada Post</li>
              <li>issue the return label (if the admin want)</li>
              <li>pay the fee</li>
              <li>
                keep track of the delivery (also, update the order event (e.g.,
                add 'DELIVERED') at admin page)
              </li>
            </ol>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Orders */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Orders
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Order Events
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              Each Order has several order events (e.g., an order is delivered).
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              When a guest user wants to do return/cancel the order, the admin
              communicates with them via email. When a member user wants to do
              return/cancel the order, the admin communicates with them via
              email/order management page. The admin is responsible to update
              the order status at the admin page (e.g., add cancel_request order
              event and so on).
            </Typography>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Order Event Type
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>DRAFT</b>: created when a customer did the final confirm (e.g.,
              create a payment intent in Stripe and the session starts)
            </Typography>
            <ul>
              <li>addable by member/guest</li>
              <li>next available order event by admin: ERROR</li>
              <li>next available order event by guest/member: none</li>
              <li>undoable: false (e.g., cannot delete it)</li>
              <li>
                this order event is automatically added by the app but displays
                the specific user type (customer/admin) to users.
              </li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>SESSION_TIMEOUT</b>: created when a customer's session is time
              out.
            </Typography>
            <ul>
              <li>addable by member/guest</li>
              <li>next available order event by admin: ERROR</li>
              <li>next available order event by guest/member: none</li>
              <li>undoable: false (e.g., cannot delete it)</li>
              <li>
                this order event is automatically added by the app but displays
                the specific user type (customer/admin) to users.
              </li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>ORDERED</b>: created when a customer ordered successfully.
            </Typography>
            <ul>
              <li>addable by member/guest</li>
              <li>next available order event by admin: ERROR</li>
              <li>next available order event by guest/member: none</li>
              <li>undoable: false (e.g., cannot delete it)</li>
              <li>
                this order event is automatically added by the app but displays
                the specific user type (customer/admin) to users.
              </li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>PAYMENT_FAILED</b>: created when a customer failed to pay.
            </Typography>
            <ul>
              <li>addable by member/guest</li>
              <li>next available order event by admin: ERROR</li>
              <li>next available order event by guest/member: none</li>
              <li>undoable: false (e.g., cannot delete it)</li>
              <li>
                this order event is automatically added by the app but displays
                the specific user type (customer/admin) to users.
              </li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>PAID</b>: created when a customer ordered paid successfully.
            </Typography>
            <ul>
              <li>addable by member/guest</li>
              <li>
                next available order event by admin: SHIPPED, CANCEL_REQUEST,
                ERROR
              </li>
              <li>
                next available order event by guest/member: CALCEL_REQUEST
              </li>
              <li>undoable: false (e.g., cannot delete it)</li>
              <li>
                this order event is automatically added by the app but displays
                the specific user type (customer/admin) to users.
              </li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>CANCEL_REQUEST</b>: created when a customer sent a cancel
              request. successfully.
            </Typography>
            <ul>
              <li>addable by member/guest</li>
              <li>
                next available order event by admin: RECEIVED_CANCEL_REQUEST,
                ERROR
              </li>
              <li>next available order event by guest/member: NONE</li>
              <li>undoable: true (e.g., cannot delete it)</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>RECEIVED_CANCEL_REQUEST</b>: created when the admin confirmed
              the cancel request.
            </Typography>
            <ul>
              <li>addable by admin</li>
              <li>next available order event by admin: CANCELED, ERROR</li>
              <li>next available order event by guest/member: NONE</li>
              <li>undoable: true (e.g., cannot delete it)</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>CANCELED</b>: created when the admin canceled the order (e.g,
              refund).
            </Typography>
            <ul>
              <li>addable by admin</li>
              <li>next available order event by admin: ERROR</li>
              <li>next available order event by guest/member: NONE</li>
              <li>undoable: false (e.g., cannot delete it)</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>SHIPPED</b>: created when the admin shipped the package.
            </Typography>
            <ul>
              <li>addable by admin</li>
              <li>
                next available order event by admin: DELIVERED, RETURN_REQUEST,
                ERROR
              </li>
              <li>
                next available order event by guest/member: RETURN_REQUEST
              </li>
              <li>undoable: true (e.g., cannot delete it)</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>RETURN_REQUEST</b>: created when a customer sent a return
              request.
            </Typography>
            <ul>
              <li>addable by member/admin</li>
              <li>
                next available order event by admin: RECEIVED_RETURN_REQUEST,
                ERROR
              </li>
              <li>next available order event by guest/member: none</li>
              <li>undoable: true (e.g., cannot delete it)</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>RECEIVED_RETURN_REQUEST</b>: created when the admin confirmed
              the return request.
            </Typography>
            <ul>
              <li>addable by admin</li>
              <li>next available order event by admin: RETURNED, ERROR</li>
              <li>next available order event by guest/member: none</li>
              <li>undoable: true (e.g., cannot delete it)</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>RETURNED</b>: created when the admin confirmed the return
              request.
            </Typography>
            <ul>
              <li>addable by admin</li>
              <li>next available order event by admin: RETURNED, ERROR</li>
              <li>next available order event by guest/member: none</li>
              <li>undoable: false (e.g., cannot delete it)</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>DELIVERED</b>: created when the package is delivered.
            </Typography>
            <ul>
              <li>addable by admin</li>
              <li>
                next available order event by admin: RETURN_REQUEST, ERROR
              </li>
              <li>
                next available order event by guest/member: RETURN_REQUEST
              </li>
              <li>undoable: true (e.g., cannot delete it)</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>ERROR</b>: created when the admin adds an error on the order.
            </Typography>
            <ul>
              <li>addable by admin</li>
              <li>next available order event by admin: none</li>
              <li>next available order event by guest/member: none</li>
              <li>undoable: false (e.g., cannot delete it)</li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              The admin can add any order events except for DRAFT, ORDERED, and
              SESSION_TIMEOUT, PAID, and PAYMENT_FAILED, and the order is
              matter. for example, you cannot add paid order event before
              shipping.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              The member can only add either return/cancel requests. The cancel
              request is only addable before shipping and after being paid. The
              return request is only addable after shipping.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              If the customer is not eligible for a refund policy, the user
              cannot return the item.
            </Typography>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="h6"
              className={classes.subheader}
            >
              Return And Cancel Flows
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              When customers want to cancel/return the item, here are typical
              steps that the admin should follow:
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>Cancellation</b>: this should happen before the admin ships an
              order. Otherwise, it should be returned. order.
            </Typography>
            <ol>
              <li>
                the guest/member users submit a cancel request via email or the
                order management page.
              </li>
              <li>
                the admin updates order event (e.g., add the event called
                'received_cancel_request' to give the customer your
                confirmation.
              </li>
              <li>
                then, the admin updates the order event (e.g., add the event
                called 'canceled'). this will cancel the payment and refund the
                payment to the customer.
              </li>
              <li>
                finally, the customer receives the refund processed by Stripe.
              </li>
            </ol>
            <Typography variant="body1" component="p" className={classes.parag}>
              <b>Return</b>: this should happen after the admin ships an order.
              Otherwise, it should be canceled.
            </Typography>
            <ol>
              <li>
                the guest/member users submit a return request via email or the
                order management page.
              </li>
              <li>
                the admin updates order event (e.g., add the event called
                'received_return_request' to give the customer your
                confirmation.
              </li>
              <li>
                the admin sends an email to ask the customer to return the
                package with the return label if you would like to receive the
                package back.
              </li>
              <li>
                after you received the package, the admin updates order event
                (e.g., add the event called 'returned'). this will cancel the
                payment and refund the payment to the customer.
              </li>
              <li>
                restore the stock at the product management page if you desire.
              </li>
              <li>
                finally, the customer receives the refund processed by Stripe.
              </li>
            </ol>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Email */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Email
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography variant="body1" component="p" className={classes.parag}>
              We will send an email to the appropriate user when the following
              events happen:
            </Typography>
            <ul>
              <li>send to admin when a new order was placed by a customer.</li>
              <li>send to admin when a customer submits a cancel request.</li>
              <li>send to admin when a customer submits a return request.</li>
              <li>
                send to a customer when a new order was placed by the customer
                as confirmation.
              </li>
              <li>send to a customer when the admin shipped items.</li>
              <li>
                send to a customer when the admin confirms a cancel request.
              </li>
              <li>send to a customer when the admin canceled an order.</li>
              <li>
                send to a customer when the admin confirms a return request.
              </li>
              <li>send to a customer when the admin returned an order.</li>
              <li>send to admin when a member submits/updates a review.</li>
              <li>send to a customer when the admin verifies a review.</li>
              <li>
                send to a customer when a member request to re-issue a
                verification email.
              </li>
              <li>
                send to a customer when a member requests a forgot-password
                email.
              </li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              Additionally, our payment system (e.g., Stripe) automatically send
              an email when the following events:
            </Typography>
            <ul>
              <li>
                send to a customer when payment was succeeded. it contains a
                receipt.
              </li>
              <li>
                send to a customer when payment is refunded. it contains a
                receipt.
              </li>
            </ul>
            <Typography variant="body1" component="p" className={classes.parag}>
              The admin receives an email to the following email addresses:
            </Typography>
            <ul>
              <li>basic email address</li>
              <li>company email address</li>
            </ul>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Notifications */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Notifications
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography variant="body1" component="p" className={classes.parag}>
              We will send a notification to the appropriate user when the
              following events happen:
            </Typography>
            <ul>
              <li>send to admin when a new order was placed by a customer.</li>
              <li>
                send to a customer when an order event was added by admin.
              </li>
              <li>
                send to admin when an order event was added by a customer.
              </li>
              <li>send to admin when a member submits/updates a review.</li>
              <li>send to a customer when the admin verifies a review.</li>
            </ul>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Reviews */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Reviews
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography variant="body1" component="p" className={classes.parag}>
              When the items were delivered successfully, the customer (only
              member) can submit a review about the product they bought.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              The app automatically sends an email to ask them to write a review
              when the items were delivered successfully. Every time the
              customer creates/updates a review, the admin must verify the
              review to be published. The reviews are deleted automatically when
              the product is deleted by the admin.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Cart Items */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Cart Items
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography variant="body1" component="p" className={classes.parag}>
              Customers can keep product variants in your cart to buy them. The
              max number of cart items is 5 and the max quantity of a cart item
              is 10.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              The cart Items are deleted automatically if the product variant is
              no longer available (e.g., the stack is empty or the product
              variant is deleted by admin).
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Wishlist Items */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Wishlist Items
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography variant="body1" component="p" className={classes.parag}>
              Members can keep product variants on your wishlist to save for
              later.
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              The wishlist items are deleted automatically if the product
              variant is deleted by the admin.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/** Security */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" component="h6">
            Security
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailRoot }}>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="p"
              className={classes.subheader}
            >
              Limit Login Attempt
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              A user can attempt login 10 times at most. if they failed to log
              in after the attempts, they cannot attempt in 30 mins. After 30
              mins, they can attempt it again.
            </Typography>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="p"
              className={classes.subheader}
            >
              Password
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              A user's password (including admin, guest, and member) must meet
              the following conditions:
            </Typography>
            <ul>
              <li>A password must be at least 8 characters.</li>
              <li>
                A password must include lowercase and uppercase characters.
              </li>
            </ul>
          </Box>
          <Box className={classes.subsection}>
            <Typography
              variant="button"
              component="p"
              className={classes.subheader}
            >
              Email Verification
            </Typography>
            <Typography variant="body1" component="p" className={classes.parag}>
              We ask each member to verify its email address by sending the
              verification email. The reason is to improve security and avoid
              degrade email sending reputation. However, the temporary user can
              log in, buy, and do the same thing as an active user. so this
              verification is optional.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AdminDashboard;
