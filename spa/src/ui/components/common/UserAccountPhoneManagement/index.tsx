import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import { UserPhoneType } from 'domain/user/types';
import { useValidation } from 'hooks/validation';
import { userAccountPhoneSchema } from 'hooks/validation/rules';
import * as React from 'react';
import { testPhoneList } from 'tests/data/user';

export declare type UserAccountPhoneDataType = {
  phone: string
  countryCode: string
}

export declare type UserAccountPhoneValidationDataType = {
  phone?: string
  countryCode?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      margin: theme.spacing(1),
      textAlign: "center",
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      display: "flex",
      maxWidth: 400,
      width: "80%",
      margin: "5px auto",

    },
    listBox: {
      maxWidth: 400,
      width: "80%",
      margin: "5px auto",
    },
    modalBox: {

    },
    modalContent: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%)`,
      backgroundColor: "#fff",
      maxWidth: 400,
      width: "80%",
      margin: "5px auto",

    },
    actionBox: {
      textAlign: "center"
    },
  }),
);

export declare type UserAccountPhoneManagementPropsType = {
  phones: UserPhoneType[]
}

/**
 * member or admin account management component
 *
 * process:
 *
 *    - 1. recieve the user data prop from parent component
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
const UserAccountPhoneManagement: React.FunctionComponent<UserAccountPhoneManagementPropsType> = ({ phones }) => {

  // mui: makeStyles
  const classes = useStyles();

  // temp user account state
  const [curUserAccountPhoneState, setUserAccountPhoneState] = React.useState<UserAccountPhoneDataType>({
    phone: "",
    countryCode: "",
  });

  // validation logic (should move to hooks)
  const [curUserAccountPhoneValidationState, setUserAccountPhoneValidationState] = React.useState<UserAccountPhoneValidationDataType>({
    phone: "",
    countryCode: "",
  });

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curUserAccountPhoneState,
    curValidationDomain: curUserAccountPhoneValidationState,
    schema: userAccountPhoneSchema,
    setValidationDomain: setUserAccountPhoneValidationState
  })

  // modal logic
  const [curModalOpen, setModalOpen] = React.useState<boolean>(false);
  const handleModalOpenClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setModalOpen(true) 
  }
  const handleModalCancelClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setModalOpen(false) 
  }

  // event handlers
  const handlePhoneInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPhone = e.currentTarget.value
    updateValidationAt("phone", e.currentTarget.value);
    setUserAccountPhoneState((prev: UserAccountPhoneDataType) => ({
      ...prev,
      phone: nextPhone
    }));

  }

  const handleCountryCodeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCountryCode = e.currentTarget.value
    updateValidationAt("countryCode", e.currentTarget.value);
    setUserAccountPhoneState((prev: UserAccountPhoneDataType) => ({
      ...prev,
      countryCode: nextCountryCode
    }));
  }


  // event handler to submit
  const handleUserAccountSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curUserAccountPhoneState)

    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")
      /**
       * TODO:
       * POST /users/{userId}/phones to add new one
       **/
    } else {
      updateAllValidation()
    }
  }

 // delete an existing phone number
  const handleDeletePhoneClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    console.log("delete an existing phone number event triggered")
    /**
     * TODO: DELETE /users/{userId}/phones/{phoneId}
     **/
  }

  // render functions

  // display current phone number list
  const renderCurPhoneListComponent: () => React.ReactNode = () => {
    /**
     * TODO: replace with real one and remove test data
     **/
    //return phones.map((phone: UserPhoneType) => {
    return testPhoneList.map((phone: UserPhoneType) => {
      return (
        <ListItem key={phone.phoneId} >
          <ListItemAvatar>
            <Avatar>
              <PhoneIphoneIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={phone.phone}
            secondary={phone.countryCode}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={handleDeletePhoneClickEvent}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )
    })
  }

  // display popup modal to add new phone number

  return (
    <React.Fragment>
      <Box component="div">
        {(testPhoneList.length === 0 &&
          <Typography variant="body2" component="p" align="center" >
            {"Oops. You Haven't Registered Any Phone Yet."}
          </Typography>
        )}
        {(testPhoneList.length > 0 &&
          <List className={classes.listBox}>
            {renderCurPhoneListComponent()}
          </List>
        )}
        <Box component="div" className={classes.actionBox}>
          <Button onClick={handleModalOpenClickEvent}>
            Add New Phone
        </Button>
        </Box>
      </Box>
      <Modal
        open={curModalOpen}
        onClose={handleModalOpenClickEvent}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <form className={classes.modalContent} noValidate autoComplete="off">
          <TextField
            id="phone"
            label="Phone"
            className={classes.formControl}
            value={curUserAccountPhoneState.phone}
            onChange={handlePhoneInputChangeEvent}
            helperText={curUserAccountPhoneValidationState.phone}
            error={curUserAccountPhoneValidationState.phone !== ""}

          />
          <TextField
            id="country-code"
            label="Country Code"
            className={classes.formControl}
            value={curUserAccountPhoneState.countryCode}
            onChange={handleCountryCodeInputChangeEvent}
            helperText={curUserAccountPhoneValidationState.countryCode}
            error={curUserAccountPhoneValidationState.countryCode !== ""}
          />
          <Box component="div" className={classes.actionBox}>
            <Button onClick={handleModalCancelClickEvent}>
              Cancel
            </Button>
            <Button onClick={handleUserAccountSaveClickEvent}>
              Save
            </Button>
          </Box>
        </form>
      </Modal>
    </React.Fragment>
  )
}

export default UserAccountPhoneManagement
