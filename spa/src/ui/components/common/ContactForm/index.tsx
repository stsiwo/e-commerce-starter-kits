import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { api } from "configs/axiosConfig";
import { logger } from "configs/logger";
import {
  ContactFormDataType,
  ContactFormValidationDataType,
  defaultContactFormValidationData,
  generateDefaultContactFormData,
} from "domain/user/types";
import { useValidation } from "hooks/validation";
import { contactSchema } from "hooks/validation/rules";
import * as React from "react";
import { useDispatch } from "react-redux";
import { messageActions } from "reducers/slices/app";
import { MessageTypeEnum } from "src/app";
import { getNanoId } from "src/utils";
const log = logger(__filename);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    form: {
      margin: theme.spacing(1),
      textAlign: "center",
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      margin: theme.spacing(2),
      width: 300,
    },
    formEmail: {
      margin: theme.spacing(2),
      width: "80%",
    },
    formTitle: {
      margin: theme.spacing(2),
      width: "80%",
    },
    recaptchaBox: {
      "& > div": {
        margin: `${theme.spacing(2)}px auto`,
      },
    },
    actionBox: {
      textAlign: "center",
      margin: `${theme.spacing(2)}px 0`,
    },
  })
);

/**
 * guest & member contactform page
 *
 **/
const ContactForm: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [curContactFormState, setContactFormState] =
    React.useState<ContactFormDataType>(generateDefaultContactFormData());

  const [curContactFormValidationState, setContactFormValidationState] =
    React.useState<ContactFormValidationDataType>(
      defaultContactFormValidationData
    );

  const { updateValidationAt, updateAllValidation, isValidSync } =
    useValidation({
      curDomain: curContactFormState,
      curValidationDomain: curContactFormValidationState,
      schema: contactSchema,
      setValidationDomain: setContactFormValidationState,
      defaultValidationDomain: defaultContactFormValidationData,
    });

  // event handlers
  const handleFirstNameInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextFirstName = e.currentTarget.value;
    updateValidationAt("firstName", e.currentTarget.value);
    setContactFormState((prev: ContactFormDataType) => ({
      ...prev,
      firstName: nextFirstName,
    }));
  };

  const handleLastNameInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextLastName = e.currentTarget.value;
    updateValidationAt("lastName", e.currentTarget.value);
    setContactFormState((prev: ContactFormDataType) => ({
      ...prev,
      lastName: nextLastName,
    }));
  };

  const handleEmailInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextEmail = e.currentTarget.value;
    updateValidationAt("email", e.currentTarget.value);
    setContactFormState((prev: ContactFormDataType) => ({
      ...prev,
      email: nextEmail,
    }));
  };

  const handleTitleInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextTitle = e.currentTarget.value;
    updateValidationAt("title", e.currentTarget.value);
    setContactFormState((prev: ContactFormDataType) => ({
      ...prev,
      title: nextTitle,
    }));
  };

  const handleDescriptionInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextDescription = e.currentTarget.value;
    updateValidationAt("description", e.currentTarget.value);
    setContactFormState((prev: ContactFormDataType) => ({
      ...prev,
      description: nextDescription,
    }));
  };

  // event handler to submit
  const handleContactSendClickEvent: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = async (e) => {
    // recaptcha validation
    const recaptchaToken = grecaptcha.getResponse();

    if (!recaptchaToken) {
      dispatch(
        messageActions.update({
          id: getNanoId(),
          type: MessageTypeEnum.ERROR,
          message: "please verify the reCaptch first before submit.",
        })
      );
      return false;
    }

    const isValid: boolean = isValidSync(curContactFormState);

    log(isValid);

    if (isValid) {
      // pass
      log("passed");

      //const body = {
      //  ...curContactFormState, // application/json since object
      //  recaptchaToken: recaptchaToken,
      //};

      const form = new URLSearchParams();
      form.append("firstName", curContactFormState.firstName);
      form.append("lastName", curContactFormState.lastName);
      form.append("email", curContactFormState.email);
      form.append("title", curContactFormState.title);
      form.append("description", curContactFormState.description);
      form.append("recaptchaToken", recaptchaToken);

      // request
      api
        .request({
          method: "POST",
          url: API1_URL + `/contact`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: form,
        })
        .then((data) => {
          dispatch(
            messageActions.update({
              id: getNanoId(),
              type: MessageTypeEnum.SUCCESS,
              message: "your request has submitted successfully.",
            })
          );
        });
    } else {
      log("failed");
      updateAllValidation();
    }
  };

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <TextField
        id="first-name"
        label="First Name"
        className={classes.formControl}
        value={curContactFormState.firstName}
        onChange={handleFirstNameInputChangeEvent}
        helperText={curContactFormValidationState.firstName}
        error={curContactFormValidationState.firstName !== ""}
      />
      <TextField
        id="last-name"
        label="Last Name"
        className={classes.formControl}
        value={curContactFormState.lastName}
        onChange={handleLastNameInputChangeEvent}
        helperText={curContactFormValidationState.lastName}
        error={curContactFormValidationState.lastName !== ""}
      />
      <TextField
        id="email"
        label="Email"
        type="email"
        className={`${classes.formControl}`}
        value={curContactFormState.email}
        onChange={handleEmailInputChangeEvent}
        helperText={curContactFormValidationState.email}
        error={curContactFormValidationState.email !== ""}
      />
      <br />
      <TextField
        id="title"
        label="Title"
        className={`${classes.formTitle}`}
        value={curContactFormState.title}
        onChange={handleTitleInputChangeEvent}
        helperText={curContactFormValidationState.title}
        error={curContactFormValidationState.title !== ""}
      />
      <br />
      <TextField
        id="description"
        label="Description"
        multiline
        rows={10}
        className={`${classes.formTitle}`}
        value={curContactFormState.description}
        onChange={handleDescriptionInputChangeEvent}
        helperText={curContactFormValidationState.description}
        error={curContactFormValidationState.description !== ""}
      />
      <FormLabel component="legend">ReCaptcha</FormLabel>
      <div
        className={`g-recaptcha ${classes.recaptchaBox}`}
        data-sitekey={RECAPTCHA_SITE_KEY}
      ></div>
      <Box component="div" className={classes.actionBox}>
        <Button onClick={handleContactSendClickEvent} variant="contained">
          Send
        </Button>
      </Box>
    </form>
  );
};

export default ContactForm;
