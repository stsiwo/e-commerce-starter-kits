import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { defaultReviewData, ReviewDataType, ReviewValidationDataType, defaultReviewValidationData } from 'domain/review/type';
import { useValidation } from 'hooks/validation';
import { reviewSchema } from 'hooks/validation/rules';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import UserCard from 'components/common/UserCard';
import { testMemberUser } from 'tests/data/user';
import ProductHorizontalCard from 'components/common/ProductCard/ProductHorizontalCard';
import { generateProductList } from 'tests/data/product';

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
const AdminReviewForm: React.FunctionComponent<{}> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // temp user account state
  const [curReviewState, setReviewState] = React.useState<ReviewDataType>(defaultReviewData);

  // validation logic (should move to hooks)
  const [curReviewValidationState, setReviewValidationState] = React.useState<ReviewValidationDataType>(defaultReviewValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curReviewState,
    curValidationDomain: curReviewValidationState,
    schema: reviewSchema,
    setValidationDomain: setReviewValidationState
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

  // event handler to submit
  const handleProductSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curReviewState)

    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")
    } else {
      console.log("failed")
      updateAllValidation()
    }
  }

  // target test product
  const testProduct = generateProductList(1)[0]

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
        <UserCard user={testMemberUser} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <Typography variant="subtitle1" component="h6" className={classes.title}>
          {"Reviewed Product"}
        </Typography>
        <ProductHorizontalCard product={testProduct} variant={testProduct.productVariants[0]} />
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
          <Box component="div" className={classes.actionBox}>
            <Button onClick={handleProductSaveClickEvent}>
              Save
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  )
}

export default AdminReviewForm


