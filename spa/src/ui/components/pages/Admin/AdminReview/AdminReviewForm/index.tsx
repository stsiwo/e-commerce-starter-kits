import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { AxiosError } from 'axios';
import ProductHorizontalCard from 'components/common/ProductCard/ProductHorizontalCard';
import UserCard from 'components/common/UserCard';
import { api } from 'configs/axiosConfig';
import { defaultReviewValidationData, ReviewDataType, ReviewType, ReviewValidationDataType } from 'domain/review/type';
import { useValidation } from 'hooks/validation';
import { reviewSchema } from 'hooks/validation/rules';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewActionCreator } from 'reducers/slices/domain/review';
import { mSelector } from 'src/selectors/selector';
import { testMemberUser } from 'tests/data/user';

interface AdminReviewFormPropsType {
  review: ReviewType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    orderDetailBox: {

    },
    title: {
      textAlign: "center",
      fontWeight: theme.typography.fontWeightBold
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
    actionBox: {
    }
  }),
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
const AdminReviewForm = React.forwardRef<any, AdminReviewFormPropsType>((props, ref) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch()

  // temp user account state
  const [curReviewState, setReviewState] = React.useState<ReviewDataType>(props.review);

  // validation logic (should move to hooks)
  const [curReviewValidationState, setReviewValidationState] = React.useState<ReviewValidationDataType>(defaultReviewValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curReviewState,
    curValidationDomain: curReviewValidationState,
    schema: reviewSchema,
    setValidationDomain: setReviewValidationState,
    defaultValidationDomain: defaultReviewValidationData,
  })

  // event handlers
  const handleReviewTitleInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextReviewTitle = e.currentTarget.value
    updateValidationAt("reviewTitle", e.currentTarget.value);
    setReviewState((prev: ReviewDataType) => ({
      ...prev,
      reviewTitle: nextReviewTitle
    }));
  }

  const handleReviewDescriptionInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextReviewDescription = e.currentTarget.value
    updateValidationAt("reviewDescription", e.currentTarget.value);
    setReviewState((prev: ReviewDataType) => ({
      ...prev,
      reviewDescription: nextReviewDescription
    }));
  }

  const handleReviewPointInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextReviewPoint = e.currentTarget.value
    updateValidationAt("reviewPoint", e.currentTarget.value);
    setReviewState((prev: ReviewDataType) => ({
      ...prev,
      reviewPoint: parseFloat(nextReviewPoint)
    }));
  }

  const handleReviewIsVerifiedInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextReviewIsVerified = e.currentTarget.checked
    updateValidationAt("isVerified", e.currentTarget.checked);
    setReviewState((prev: ReviewDataType) => ({
      ...prev,
      isVerified: nextReviewIsVerified
    }));
  }

  /**
   * call child function from parent 
   *
   * ref: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
   *
   **/
  React.useImperativeHandle(ref, () => ({

    // event handler to submit
    handleSaveClickEvent: (e: React.MouseEvent<HTMLButtonElement>) => {
      const isValid: boolean = isValidSync(curReviewState)

      console.log(isValid);

      if (isValid) {
        // pass 
        console.log("passed")
        console.log("update review")
        // request
        api.request({
          method: 'PUT',
          url: API1_URL + `/reviews/${curReviewState.reviewId}`,
          data: curReviewState,
        }).then((data) => {

          // fetch again
          dispatch(fetchReviewActionCreator())

          enqueueSnackbar("updated successfully.", { variant: "success" })
        }).catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" })
        })
      } else {
        console.log("failed")
        updateAllValidation()
      }
    }
  }))

  return (
    <Grid
      container
      justify="center"
    >
      <Grid
        item
        xs={12}
        md={6}
      >
        <Typography variant="subtitle1" component="h6" className={classes.title}>
          {"Reviewing Customer"}
        </Typography>
        <UserCard
          firstName={testMemberUser.firstName}
          lastName={testMemberUser.lastName}
          email={testMemberUser.email}
          userType={testMemberUser.userType.userType}
          avatarImagePath={testMemberUser.avatarImagePath}
        />
      </Grid>
        <Grid
          item
          xs={12}
          md={6}
        >
          <Typography variant="subtitle1" component="h6" className={classes.title}>
            {"Reviewed Product"}
          </Typography>
          <ProductHorizontalCard product={props.review.product} variant={props.review.product.variants[0]} />
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.orderDetailBox}
        >
          <Typography variant="subtitle1" component="h6" className={classes.title}>
            {"Review Form"}
          </Typography>
          <form className={classes.form} noValidate autoComplete="off">
            <Typography component="legend">click/touch stars to rate this product.</Typography>
            <Rating
              name="review-point"
              precision={0.1}
              value={curReviewState.reviewPoint}
              onChange={handleReviewPointInputChangeEvent}
              className={`${classes.txtFieldBase}`}
              size="large"
            /><br />
            <TextField
              id="review-title"
              label="Review Title"
              className={`${classes.txtFieldBase}`}
              value={curReviewState.reviewTitle}
              onChange={handleReviewTitleInputChangeEvent}
              helperText={curReviewValidationState.reviewTitle}
              error={curReviewValidationState.reviewTitle !== ""}
            /><br />
            <TextField
              id="review-description"
              label="Review Description"
              multiline
              rows={4}
              className={`${classes.txtFieldBase}`}
              value={curReviewState.reviewDescription}
              onChange={handleReviewDescriptionInputChangeEvent}
              helperText={curReviewValidationState.reviewDescription}
              error={curReviewValidationState.reviewDescription !== ""}
            /><br />
            <FormControlLabel
              control={
                <Switch
                  checked={curReviewState.isVerified}
                  onChange={handleReviewIsVerifiedInputChangeEvent}
                  name="review-is-verified" />
              }
              className={`${classes.txtFieldBase}`}
              label="Verified"
            /><br />
          </form>
        </Grid>
      </Grid>
      )
    })
    
    export default AdminReviewForm
    
    
