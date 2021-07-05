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
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { putAuthCompanyActionCreator } from 'reducers/slices/app';
import { mSelector } from 'src/selectors/selector';
import { getProvinceList, getCountryList } from 'src/utils';
import MenuItem from '@material-ui/core/MenuItem';

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
    setValidationDomain: setAdminCompanyFormValidationState,
    defaultValidationDomain: defaultAdminCompanyFormValidationData,
  })

  // event handlers
  const handleCompanyNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCompanyName = e.target.value
    updateValidationAt("companyName", e.target.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      companyName: nextCompanyName
    }));

  }

  const handleDescriptionInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextDescription = e.target.value
    updateValidationAt("companyDescription", e.target.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      companyDescription: nextDescription
    }));

  }


  const handleCompanyEmailInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCompanyEmail = e.target.value
    updateValidationAt("companyEmail", e.target.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      companyEmail: nextCompanyEmail
    }));

  }


  const handlePhoneNumberInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPhoneNumber = e.target.value
    updateValidationAt("phoneNumber", e.target.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      phoneNumber: nextPhoneNumber
    }));

  }


  const handleCountryCodeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCountryCode = e.target.value
    updateValidationAt("countryCode", nextCountryCode);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      countryCode: nextCountryCode
    }));

  }

  const handleAddress1InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress1 = e.target.value
    updateValidationAt("address1", e.target.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      address1: nextAddress1
    }));

  }

  const handleAddress2InputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextAddress2 = e.target.value
    updateValidationAt("address2", e.target.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      address2: nextAddress2
    }));

  }

  const handleCityInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    // don't use 'currentTarget' for select (esp with material ui)
    const nextCity = e.target.value
    updateValidationAt("city", nextCity);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      city: nextCity
    }));

  }

  const handleProvinceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    // don't use 'currentTarget' for select (esp with material ui)
    const nextProvince = e.target.value
    updateValidationAt("province", nextProvince);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      province: nextProvince
    }));

  }

  const handleCountryInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    // don't use 'currentTarget' for select (esp material-ui)
    const nextCountry = e.target.value
    updateValidationAt("country", nextCountry);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      country: nextCountry
    }));

  }

  const handlePostalCodeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    // don't use 'currentTarget' for select (esp material-ui)
    const nextPostalCode = e.target.value
    updateValidationAt("postalCode", e.currentTarget.value);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      postalCode: nextPostalCode
    }));

  }

  const handleFacebookLinkInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    // don't use 'currentTarget' for select (esp with material ui)
    const nextFacebookLink = e.target.value
    updateValidationAt("facebookLink", nextFacebookLink);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      facebookLink: nextFacebookLink
    }));

  }

  const handleInstagramLinkInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    // don't use 'currentTarget' for select (esp with material ui)
    const nextInstagramLink = e.target.value
    updateValidationAt("instagramLink", nextInstagramLink);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      instagramLink: nextInstagramLink
    }));

  }

  const handleTwitterLinkInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    // don't use 'currentTarget' for select (esp with material ui)
    const nextTwitterLink = e.target.value
    updateValidationAt("twitterLink", nextTwitterLink);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      twitterLink: nextTwitterLink
    }));

  }

  const handleYoutubeLinkInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    // don't use 'currentTarget' for select (esp with material ui)
    const nextYoutubeLink = e.target.value
    updateValidationAt("youtubeLink", nextYoutubeLink);
    setAdminCompanyFormState((prev: AdminCompanyFormDataType) => ({
      ...prev,
      youtubeLink: nextYoutubeLink
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
          postalCode: curAdminCompanyFormState.postalCode,
          facebookLink: curAdminCompanyFormState.facebookLink,
          instagramLink: curAdminCompanyFormState.instagramLink,
          twitterLink: curAdminCompanyFormState.twitterLink,
          youtubeLink: curAdminCompanyFormState.youtubeLink,
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
                placeholder={'use the domain which matches with this web app.'}
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
                disabled
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
                select
                className={classes.formControl}
                value={curAdminCompanyFormState.province}
                onChange={handleProvinceInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.province}
                error={curAdminCompanyFormValidationState.province !== ""}
              >
                {getProvinceList().map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="country"
                label="Country"
                select
                disabled
                className={classes.formControl}
                value={curAdminCompanyFormState.country}
                onChange={handleCountryInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.country}
                error={curAdminCompanyFormValidationState.country !== ""}
              >
                {Object.keys(getCountryList()).map((country2Alpha: string) => (
                  <MenuItem key={country2Alpha} value={country2Alpha}>
                    {getCountryList()[country2Alpha]}
                  </MenuItem>
                ))}
              </TextField>
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
            <Grid
              item
              xs={12}
              sm={12}
              className={classes.gridItem}
            >
              <TextField
                id="facebook-link"
                label="FacebookLink"
                className={classes.formControl}
                value={curAdminCompanyFormState.facebookLink}
                onChange={handleFacebookLinkInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.facebookLink}
                error={curAdminCompanyFormValidationState.facebookLink !== ""}
              />
              <TextField
                id="instagram-link"
                label="Instagram Link"
                className={classes.formControl}
                value={curAdminCompanyFormState.instagramLink}
                onChange={handleInstagramLinkInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.instagramLink}
                error={curAdminCompanyFormValidationState.instagramLink !== ""}
              />
              <TextField
                id="twitter-link"
                label="Twitter Link"
                className={classes.formControl}
                value={curAdminCompanyFormState.twitterLink}
                onChange={handleTwitterLinkInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.twitterLink}
                error={curAdminCompanyFormValidationState.twitterLink !== ""}
              />
              <TextField
                id="youtube-link"
                label="Youtube Link"
                className={classes.formControl}
                value={curAdminCompanyFormState.youtubeLink}
                onChange={handleYoutubeLinkInputChangeEvent}
                helperText={curAdminCompanyFormValidationState.youtubeLink}
                error={curAdminCompanyFormValidationState.youtubeLink !== ""}
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <CardActions disableSpacing>
        <Button onClick={handleUserAccountSaveClickEvent} variant="contained">
          Save
        </Button>
      </CardActions>
    </Card>
  )
}

export default AdminAccountCompanyManagement




