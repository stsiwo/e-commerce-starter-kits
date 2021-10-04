import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { classnames } from "@material-ui/data-grid";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import Rating from "@material-ui/lab/Rating";
import { AxiosError } from "axios";
import UserCard from "components/common/UserCard";
import ReviewProductHorizontalCard from "components/pages/Admin/AdminReview/AdminReviewForm/ReviewProductHorizontalCard";
import { api } from "configs/axiosConfig";
import { logger } from "configs/logger";
import {
  defaultReviewValidationData,
  ReviewDataType,
  ReviewType,
  ReviewValidationDataType,
} from "domain/review/type";
import { useValidation } from "hooks/validation";
import { reviewSchema } from "hooks/validation/rules";
import { useWaitResponse } from "hooks/waitResponse";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { messageActions } from "reducers/slices/app";
import {
  deleteSingleReviewFetchStatusActions,
  postReviewFetchStatusActions,
  putReviewFetchStatusActions,
} from "reducers/slices/app/fetchStatus/review";
import {
  postReviewActionCreator,
  putReviewActionCreator,
} from "reducers/slices/domain/review";
import { FetchStatusEnum, MessageTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";
import { getNanoId } from "src/utils";
const log = logger(__filename);

interface ReviewFormPropsType {
  review: ReviewType;
  isNew: boolean;
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
    reviewStatus: {
      margin: `${theme.spacing(1)}px 0`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    reviewVerified: {
      color: theme.palette.success.main,
    },
    reviewPending: {
      color: theme.palette.fifth.main,
    },
    rating: {},
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
const ReviewForm: React.FunctionComponent<ReviewFormPropsType> = (props) => {
  // mui: makeStyles
  const classes = useStyles();

  const dispatch = useDispatch();

  const history = useHistory();

  const auth = useSelector(mSelector.makeAuthSelector());

  // update/create logic for product
  //  - true: create
  //  - false: update
  // if props.product exists, it updates, otherwise, new
  const [isNew, setNew] = React.useState<boolean>(props.isNew);
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

  // event handler to submit
  const handleSaveClickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isValid: boolean = isValidSync(curReviewState);

    log(isValid);

    if (isValid) {
      // pass
      log("passed");

      if (isNew) {
        log("new review");
        dispatch(
          postReviewActionCreator({
            isVerified: false, // make sure this (member can't edit this) and every time and every time user edit this, need verfication from the admin to publish
            reviewTitle: curReviewState.reviewTitle,
            reviewDescription: curReviewState.reviewDescription,
            note: curReviewState.note, // keep this. but this is not editable my member and not visible by member.
            reviewPoint: curReviewState.reviewPoint,
            productId: curReviewState.product.productId, // assign explicitly in teh case of new
            userId: curReviewState.user.userId,
            version: curReviewState.version,
          })
        );
      } else {
        log("update review");
        dispatch(
          putReviewActionCreator({
            reviewId: curReviewState.reviewId,
            isVerified: false, // make sure this (member can't edit this) and every time and every time user edit this, need verfication from the admin to publish
            reviewTitle: curReviewState.reviewTitle,
            reviewDescription: curReviewState.reviewDescription,
            note: curReviewState.note, // keep this. but this is not editable my member and not visible by member.
            reviewPoint: curReviewState.reviewPoint,
            productId: curReviewState.product.productId, // assign explicitly in teh case of new
            userId: curReviewState.user.userId,
            version: curReviewState.version,
          })
        );
      }
    } else {
      log("failed");
      updateAllValidation();
    }
  };

  // deleting stuff
  const [curDeleteDialogOpen, setDeleteDialogOpen] =
    React.useState<boolean>(false);

  const handleDeleteClick = (e: React.MouseEvent<HTMLElement>) => {
    setDeleteDialogOpen(true);
  };

  const handleDeletionCancel: React.EventHandler<
    React.MouseEvent<HTMLElement>
  > = (e) => {
    setDeleteDialogOpen(false);
  };

  const handleDeletionOk: React.EventHandler<React.MouseEvent<HTMLElement>> = (
    e
  ) => {
    /**
     * use different endpoint rather than /reviews like PUT, POST
     *
     * this is because we don't have any way to authorized the request is from auth user. (e.g., @PreAuthorize)
     *
     **/

    dispatch(
      deleteSingleReviewFetchStatusActions.update(FetchStatusEnum.FETCHING)
    );

    // request
    api
      .request({
        method: "DELETE",
        headers: { "If-Match": `"${curReviewState.version}"` },
        url:
          API1_URL +
          `/users/${curReviewState.user.userId}/reviews/${curReviewState.reviewId}`,
      })
      .then((data) => {
        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.SUCCESS,
            message: data.data.message,
          })
        );
        dispatch(
          deleteSingleReviewFetchStatusActions.update(FetchStatusEnum.SUCCESS)
        );

        history.push("/orders");
      })
      .catch((error: AxiosError) => {
        dispatch(
          deleteSingleReviewFetchStatusActions.update(FetchStatusEnum.FAILED)
        );
      });
  };

  // close form dialog only when success for post/put/delete
  const curPostFetchStatus = useSelector(
    rsSelector.app.getPostReviewFetchStatus
  );
  const curPutFetchStatus = useSelector(rsSelector.app.getPutReviewFetchStatus);
  React.useEffect(() => {
    if (
      curPostFetchStatus === FetchStatusEnum.SUCCESS ||
      curPutFetchStatus === FetchStatusEnum.SUCCESS
    ) {
      history.push("/orders");

      dispatch(postReviewFetchStatusActions.clear());
      dispatch(putReviewFetchStatusActions.clear());
    }
  });

  /**
   * avoid multiple click submission
   */
  const { curDisableBtnStatus: curDisablePostBtnStatus } = useWaitResponse({
    fetchStatus: curPostFetchStatus,
  });
  const { curDisableBtnStatus: curDisablePutBtnStatus } = useWaitResponse({
    fetchStatus: curPutFetchStatus,
  });

  /**
   * avoid multiple click submission
   */
  const curDeleteFetchStatus = useSelector(
    rsSelector.app.getDeleteSingleReviewFetchStatus
  );
  const { curDisableBtnStatus: curDisableDeleteBtnStatus } = useWaitResponse({
    fetchStatus: curDeleteFetchStatus,
  });

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
      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          component="h6"
          className={classes.title}
        >
          {"Current Review Status"}
        </Typography>
        <Box className={classes.reviewStatus}>
          <VerifiedUserIcon
            color={curReviewState.isVerified ? "primary" : "disabled"}
          />
          <Typography
            variant="body2"
            component="p"
            className={classnames(classes.title)}
          >
            {curReviewState.isVerified ? "Approved" : "Pending"}
          </Typography>
        </Box>
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
            className={`${classes.txtFieldBase} ${classes.rating}`}
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
          <Box component="div" className={classes.actionBox}>
            {!props.isNew && (
              <Button onClick={handleDeleteClick} variant="contained">
                Delete
              </Button>
            )}
            <Button
              onClick={handleSaveClickEvent}
              variant="contained"
              disabled={curDisablePostBtnStatus || curDisablePutBtnStatus}
            >
              Save
            </Button>
          </Box>
          {/** onDelete confiramtion dialog **/}
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="product-deletion-dialog"
            open={curDeleteDialogOpen}
          >
            <DialogTitle id="product-deletion-dialog">
              Product Deletion
            </DialogTitle>
            <DialogContent dividers>
              <Typography
                variant="body1"
                component="p"
                align="left"
                className={null}
              >
                {"Do you want to delete this review permenently?"}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={handleDeletionCancel}
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeletionOk}
                variant="contained"
                disabled={curDisableDeleteBtnStatus}
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </Grid>
    </Grid>
  );
};

export default ReviewForm;
