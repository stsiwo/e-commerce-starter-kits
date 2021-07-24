import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyActionCreator } from "reducers/slices/domain/company";
import { rsSelector } from "src/selectors/selector";
import { toDateString } from "src/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    parag: {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    subheader: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: "1rem",
      textTransform: "capitalize",
      margin: `${theme.spacing(1)}px 0`,
    },
    loadingBox: {
      height: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
  })
);

/**
 * guest & member order page
 *
 **/
const ReturnPolicy: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  /**
   * company stuff
   **/
  const curCompany = useSelector(rsSelector.domain.getCompany);
  React.useEffect(() => {
    if (!curCompany) {
      dispatch(fetchCompanyActionCreator());
    }
  }, []);

  if (!curCompany) {
    return (
      <Box className={classes.loadingBox}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {"Return Policy"}
      </Typography>
      <Typography variant="body2" component="p" align="right">
        Last Updated {toDateString(new Date("2021-07-22"))}
      </Typography>
      <b />
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Thank you for your purchase. We hope you are happy with your purchase.
        However, if you are not completely satisfied with your purchase for any
        reason, you may return it to us for a full refund or a partial refund
        only. Please see below for more information on your return policy.
      </Typography>
      <Typography variant="h6" component="h6" align="left">
        Returns
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        All returns must be postmarked within thirty (30) days of the purchase
        date. All returned items must be in new and unused condition, with all
        original tags and labels attached.
      </Typography>
      <Typography variant="h6" component="h6" align="left">
        Return Process
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        To return an item, place the item securely in its original packaging,
        and mail your return to the following address:
      </Typography>
      <br />
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        {curCompany.companyName}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Attn: Returns
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        {`${curCompany.address1} ${curCompany.address2}`}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        {`${curCompany.city}, ${curCompany.province} ${curCompany.postalCode}`}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        {`${curCompany.country}`}
      </Typography>
      <br />
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Return shipping charges will be paid or reimbursed by us.
      </Typography>
      <Typography variant="h6" component="h6" align="left">
        Refunds
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Refunds require you to have the following information:
      </Typography>
      <ul>
        <li>the receipt of payment which we sent after your purchase</li>
        <li>
          the order number included in the confirmation email after your
          purchase
        </li>
      </ul>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        Please make sure that you keep the above information after your
        purchase.
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        After receiving your item and inspecting the condition of your item, we
        will process your return. Please allow at least seven (7) days from the
        receipt of your item to process your return. Refunds may take 1-2
        billing cycles to appear on your credit card statement, depending on
        your credit card company. We will notify you by email when your return
        has been processed.
      </Typography>
      <Typography variant="h6" component="h6" align="left">
        Exceptions
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        For defective or damaged products, please contact us at the contact
        details below to arrange a refund or exchange.
      </Typography>
      <Typography variant="h6" component="h6" align="left">
        Questions
      </Typography>
      <Typography
        variant="body1"
        component="p"
        align="left"
        className={classes.parag}
      >
        If you have any questions concerning our return policy, please contact
        us at: {curCompany.companyEmail}
      </Typography>
    </React.Fragment>
  );
};

export default ReturnPolicy;
