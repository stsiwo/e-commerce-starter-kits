import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { AdminCompanyFormDataType, AdminCompanyFormValidationDataType, defaultAdminCompanyFormValidationData } from 'domain/user/types';
import { useValidation } from 'hooks/validation';
import { companySchema } from 'hooks/validation/rules';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { putAuthCompanyActionCreator } from 'reducers/slices/app';
import { mSelector } from 'src/selectors/selector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    form: {
      margin: theme.spacing(1),
      textAlign: "center",
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      margin: theme.spacing(1),
      width: "80%",
    },
    actionBox: {
      textAlign: "center"
    },
    gridBox: {
    },
    gridItem: {
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
const AdminAccountCompanyManagement: React.FunctionComponent<{}> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch()

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // temp user account state
  const [curAdminCompanyFormState, setAdminCompanyFormState] = React.useState<AdminCompanyFormDataType>(
    auth.user.companies[0] 
  );


  // validation logic (should move to hooks)
  const [curAdminCompanyFormValidationState, setAdminCompanyFormValidationState] = React.useState<AdminCompanyFormValidationDataType>(defaultAdminCompanyFormValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curAdminCompanyFormState,
    curValidationDomain: curAdminCompanyFormValidationState,
    schema: companySchema,
    setValidationDomain: setAdminCompanyFormValidationState
  })


  // event handlers
  const handleCompanyNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCompanyName = e.currentTarget.value
    updateValidationAt("companyName", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      companyName: nextCompanyName
    }));

  }

  const handleDescriptionInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextDescription = e.currentTarget.value
    updateValidationAt("companyDescription", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      companyDescription: nextDescription
    }));

  }


  const handleCompanyEmailInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCompanyEmail = e.currentTarget.value
    updateValidationAt("companyEmail", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      companyEmail: nextCompanyEmail
    }));

  }


  const handlePhoneNumberInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPhoneNumber = e.currentTarget.value
    updateValidationAt("phoneNumber", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      phoneNumber: nextPhoneNumber
    }));

  }


  const handleCountryCodeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCountryCode = e.currentTarget.value
    updateValidationAt("countryCode", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      countryCode: nextCountryCode
    }));

  }

  const handleAddress1InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress1 = e.currentTarget.value
    updateValidationAt("address1", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      address1: nextAddress1
    }));

  }

  const handleAddress2InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress2 = e.currentTarget.value
    updateValidationAt("address2", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      address2: nextAddress2
    }));

  }

  const handleCityInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCity = e.currentTarget.value
    updateValidationAt("city", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      city: nextCity
    }));

  }

  const handleProvinceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProvince = e.currentTarget.value
    updateValidationAt("province", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      province: nextProvince
    }));

  }

  const handleCountryInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCountry = e.currentTarget.value
    updateValidationAt("country", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      country: nextCountry
    }));

  }

  const handlePostalCodeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPostalCode = e.currentTarget.value
    updateValidationAt("postalCode", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      postalCode: nextPostalCode
    }));

  }

  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curAdminCompanyFormState)

    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")

      dispatch(
        putAuthCompanyActionCreator({
          companyId: curAdminCompanyFormState.companyId, 
          companyName: curAdminCompanyFormState.companyName, 
          companyDescription: curAdminCompanyFormState.companyDescription,
          companyEmail: curAdminCompanyFormState.companyEmail,
          phoneNumber: curAdminCompanyFormState.phoneNumber,
          countryCode: curAdminCompanyFormState.countryCode,
          address1: curAdminCompanyFormState.address1,
          address2: curAdminCompanyFormState.address2,
          city: curAdminCompanyFormState.city,
          province: curAdminCompanyFormState.province,
          country: curAdminCompanyFormState.country,
          postalCode: curAdminCompanyFormState.postalCode
        }) 
      );

    } else {
      updateAllValidation()
    }
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        titleTypographyProps={{
          variant: 'h6',
        }}
        subheaderTypographyProps={{
          variant: 'body1'
        }}
        title="Company"
        subheader={"Enter your company information. These information is used to describe your company in this website and shipping information when integrating with any postal company API."}
      />
      <CardContent>
        <form className={classes.form} noValidate autoComplete="off">
          <Grid
            container
            className={classes.gridBox}
            justify="center"
          >
            <Grid
              item
              xs={12}
              sm={6}
              className={classes.gridItem}
            >
              <Typography variant="h6" component="h6" align="left" gutterBottom>
                {"Basic Info"}
              </Typography>
              <TextField
                id="company-name"
                label="Company Name"
                className={classes.formControl}
                value={curAdminCompanyFormState.companyName}
                onChange={handleCompanyNameInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.companyName}
                error={curAdminCompanyFormValidationState.companyName !== ""}

              />
              <TextField
                id="company-description"
                label="Description"
                multiline
                rows={3}
                className={classes.formControl}
                value={curAdminCompanyFormState.companyDescription}
                onChange={handleDescriptionInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.companyDescription}
                error={curAdminCompanyFormValidationState.companyDescription !== ""}
              />
              <TextField
                id="company-email"
                label="Email"
                type="email"
                className={classes.formControl}
                value={curAdminCompanyFormState.companyEmail}
                onChange={handleCompanyEmailInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.companyEmail}
                error={curAdminCompanyFormValidationState.companyEmail !== ""}
              />
              <Typography variant="h6" component="h6" align="left" gutterBottom>
                {"Phone"}
              </Typography>
              <TextField
                id="phone"
                label="phone"
                className={classes.formControl}
                value={curAdminCompanyFormState.phoneNumber}
                onChange={handlePhoneNumberInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.phoneNumber}
                error={curAdminCompanyFormValidationState.phoneNumber !== ""}
              />
              <TextField
                id="country-code"
                label="Country Code"
                className={classes.formControl}
                value={curAdminCompanyFormState.countryCode}
                onChange={handleCountryCodeInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.countryCode}
                error={curAdminCompanyFormValidationState.countryCode !== ""}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              className={classes.gridItem}
            >
              <Typography variant="h6" component="h6" align="left" gutterBottom>
                {"Address"}
              </Typography>
              <TextField
                id="address1"
                label="Address 1"
                className={classes.formControl}
                value={curAdminCompanyFormState.address1}
                onChange={handleAddress1InputChangeEvent}
                helperText={curAdminCompanyFormValidationState.address1}
                error={curAdminCompanyFormValidationState.address1 !== ""}
              />
              <TextField
                id="address2"
                label="Address 2"
                className={classes.formControl}
                value={curAdminCompanyFormState.address2}
                onChange={handleAddress2InputChangeEvent}
                helperText={curAdminCompanyFormValidationState.address2}
                error={curAdminCompanyFormValidationState.address2 !== ""}
              />
              <TextField
                id="city"
                label="City"
                className={classes.formControl}
                value={curAdminCompanyFormState.city}
                onChange={handleCityInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.city}
                error={curAdminCompanyFormValidationState.city !== ""}
              />
              <TextField
                id="province"
                label="Province"
                className={classes.formControl}
                value={curAdminCompanyFormState.province}
                onChange={handleProvinceInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.province}
                error={curAdminCompanyFormValidationState.province !== ""}
              />
              <TextField
                id="country"
                label="Country"
                className={classes.formControl}
                value={curAdminCompanyFormState.country}
                onChange={handleCountryInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.country}
                error={curAdminCompanyFormValidationState.country !== ""}
              />
              <TextField
                id="postal-code"
                label="Postal Code"
                className={classes.formControl}
                value={curAdminCompanyFormState.postalCode}
                onChange={handlePostalCodeInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.postalCode}
                error={curAdminCompanyFormValidationState.postalCode !== ""}
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <CardActions disableSpacing>
        <Button onClick={handleUserAccountSaveClickEvent}>
          Save
        </Button>
      </CardActions>
    </Card>
  )
}

export default AdminAccountCompanyManagement




