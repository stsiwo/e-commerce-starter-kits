import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import UserCard from "components/common/UserCard";
import {
  defaultReviewValidationData,
  ReviewDataType,
  ReviewType,
  ReviewValidationDataType,
} from "domain/review/type";
import { useValidation } from "hooks/validation";
import { reviewSchema } from "hooks/validation/rules";
import * as React from "react";
import { useDispatch } from "react-redux";
import { putReviewActionCreator } from "reducers/slices/domain/review";
import ReviewProductHorizontalCard from "./ReviewProductHorizontalCard";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

interface AdminReviewFormPropsType {
  review: ReviewType;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    orderDetailBox: {},
    title: {
      textAlign: "center",
      fontWeight: theme.typography.fontWeightBold,
    },
    form: {
      margin: theme.spacing(1),
      textAlign: "center",
    },
    txtFieldBase: {
      width: "80%",
      maxWidth: 500,
      margin: theme.spacing(1, 0, 1, 0),
    },
    actionBox: {},
  })
);

/**
 * member or admin account management component
 *
 * process:
 *
 *    - 1. request to grab information about this user
 *
 *    - 2. display the info to this component
 *
 *    - 3. the user modify the input
 *
 *    - 4. every time the user modify the input, validate each of them
 *
 *    - 5. the user click the save button
 *
 *    - 6. display result popup message
 **/
const AdminReviewForm = React.forwardRef<any, AdminReviewFormPropsType>(
  (props, ref) => {
    // mui: makeStyles
    const classes = useStyles();

    const dispatch = useDispatch();

    // temp user account state
    const [curReviewState, setReviewState] = React.useState<ReviewDataType>(
      props.review
    );

    // validation logic (should move to hooks)
    const [curReviewValidationState, setReviewValidationState] =
      React.useState<ReviewValidationDataType>(defaultReviewValidationData);

    const { updateValidationAt, updateAllValidation, isValidSync } =
      useValidation({
        curDomain: curReviewState,
        curValidationDomain: curReviewValidationState,
        schema: reviewSchema,
        setValidationDomain: setReviewValidationState,
        defaultValidationDomain: defaultReviewValidationData,
      });

    // event handlers
    const handleReviewTitleInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextReviewTitle = e.currentTarget.value;
      updateValidationAt("reviewTitle", e.currentTarget.value);
      setReviewState((prev: ReviewDataType) => ({
        ...prev,
        reviewTitle: nextReviewTitle,
      }));
    };

    const handleReviewDescriptionInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextReviewDescription = e.currentTarget.value;
      updateValidationAt("reviewDescription", e.currentTarget.value);
      setReviewState((prev: ReviewDataType) => ({
        ...prev,
        reviewDescription: nextReviewDescription,
      }));
    };

    const handleReviewPointInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextReviewPoint = e.currentTarget.value;
      updateValidationAt("reviewPoint", e.currentTarget.value);
      setReviewState((prev: ReviewDataType) => ({
        ...prev,
        reviewPoint: parseFloat(nextReviewPoint),
      }));
    };

    const handleNoteInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextNote = e.currentTarget.value;
      updateValidationAt("note", e.currentTarget.value);
      setReviewState((prev: ReviewDataType) => ({
        ...prev,
        note: nextNote,
      }));
    };

    const handleReviewIsVerifiedInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextReviewIsVerified = e.currentTarget.checked;
      updateValidationAt("isVerified", e.currentTarget.checked);
      setReviewState((prev: ReviewDataType) => ({
        ...prev,
        isVerified: nextReviewIsVerified,
      }));
    };

    /**
     * call child function from parent
     *
     * ref: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
     *
     **/
    React.useImperativeHandle(ref, () => ({
      // event handler to submit
      handleSaveClickEvent: (e: React.MouseEvent<HTMLButtonElement>) => {
        const isValid: boolean = isValidSync(curReviewState);

        log(isValid);

        if (isValid) {
          // pass
          log("passed");
          log("update review");

          dispatch(
            putReviewActionCreator({
              reviewId: curReviewState.reviewId,
              isVerified: curReviewState.isVerified,
              reviewTitle: curReviewState.reviewTitle,
              reviewDescription: curReviewState.reviewDescription,
              note: curReviewState.note,
              reviewPoint: curReviewState.reviewPoint,
              productId: curReviewState.product.productId,
              userId: curReviewState.user.userId,
            })
          );
        } else {
          log("failed");
          updateAllValidation();
        }
      },
    }));

    return (
      <Grid container justify="center">
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            component="h6"
            className={classes.title}
          >
            {"Reviewing Customer"}
          </Typography>
          <UserCard
            firstName={curReviewState.user.firstName}
            lastName={curReviewState.user.lastName}
            email={curReviewState.user.email}
            userType={curReviewState.user.userType.userType}
            avatarImagePath={curReviewState.user.avatarImagePath}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            component="h6"
            className={classes.title}
          >
            {"Reviewed Product"}
          </Typography>
          <ReviewProductHorizontalCard product={props.review.product} />
        </Grid>
        <Grid item xs={12} className={classes.orderDetailBox}>
          <Typography
            variant="subtitle1"
            component="h6"
            className={classes.title}
          >
            {"Review Form"}
          </Typography>
          <form className={classes.form} noValidate autoComplete="off">
            <Typography component="legend">
              click/touch stars to rate this product.
            </Typography>
            <Rating
              name="review-point"
              precision={0.1}
              value={curReviewState.reviewPoint}
              onChange={handleReviewPointInputChangeEvent}
              className={`${classes.txtFieldBase}`}
              size="large"
            />
            <br />
            <TextField
              id="review-title"
              label="Review Title"
              className={`${classes.txtFieldBase}`}
              value={curReviewState.reviewTitle}
              onChange={handleReviewTitleInputChangeEvent}
              helperText={curReviewValidationState.reviewTitle}
              error={curReviewValidationState.reviewTitle !== ""}
            />
            <br />
            <TextField
              id="review-description"
              label="Review Description"
              multiline
              rows={6}
              className={`${classes.txtFieldBase}`}
              value={curReviewState.reviewDescription}
              onChange={handleReviewDescriptionInputChangeEvent}
              helperText={curReviewValidationState.reviewDescription}
              error={curReviewValidationState.reviewDescription !== ""}
            />
            <br />
            <TextField
              id="review-note"
              label="Review Note (Only Visible Admin)"
              multiline
              rows={6}
              className={`${classes.txtFieldBase}`}
              value={curReviewState.note}
              onChange={handleNoteInputChangeEvent}
              helperText={curReviewValidationState.note}
              error={curReviewValidationState.note !== ""}
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={curReviewState.isVerified}
                  onChange={handleReviewIsVerifiedInputChangeEvent}
                  name="review-is-verified"
                />
              }
              className={`${classes.txtFieldBase}`}
              label="Verified"
            />
            <br />
          </form>
        </Grid>
      </Grid>
    );
  }
);

export default AdminReviewForm;
