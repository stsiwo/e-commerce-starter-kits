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

const defaultUserAccountPhoneData: UserAccountPhoneDataType = {
  phone: "",
  countryCode: ""
}

export declare type UserAccountPhoneValidationDataType = {
  phone?: string
  countryCode?: string
}

const defaultUserAccountValidationPhoneData: UserAccountPhoneValidationDataType = {
  phone: "",
  countryCode: ""
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
  const [curUserAccountPhoneState, setUserAccountPhoneState] = React.useState<UserAccountPhoneDataType>(defaultUserAccountPhoneData);

  // validation logic (should move to hooks)
  const [curUserAccountPhoneValidationState, setUserAccountPhoneValidationState] = React.useState<UserAccountPhoneValidationDataType>(defaultUserAccountValidationPhoneData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curUserAccountPhoneState,
    curValidationDomain: curUserAccountPhoneValidationState,
    schema: userAccountPhoneSchema,
    setValidationDomain: setUserAccountPhoneValidationState
  })

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
      if (isNew) {
        console.log("this one is to create new one")
        /**
         * TODO:
         * POST /users/{userId}/phones to add new one
         **/
      } else {
        console.log("this one is to update existing one")
        /**
         * TODO:
         * PUT /users/{userId}/phones/{phoneId} to update one 
         **/
      }
    } else {
      updateAllValidation()
    }
  }

  // update/create logic for address
  //  - true: create
  //  - false: update
  const [isNew, setNew] = React.useState<boolean>(true);

  // modal logic
  const [curModalOpen, setModalOpen] = React.useState<boolean>(false);
  const handleModalOpenClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setModalOpen(true) 
  }
  const handleModalCancelClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setModalOpen(false) 
  }

  // event handler for click 'add new one' button
  const handleAddNewPhoneBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setUserAccountPhoneState(defaultUserAccountPhoneData)
    setUserAccountPhoneValidationState(defaultUserAccountValidationPhoneData)
    setNew(true);
    setModalOpen(true);
  }

 // delete an existing phone number
  const handleDeletePhoneClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    console.log("delete an existing phone number event triggered")
    /**
     * TODO: DELETE /users/{userId}/phones/{phoneId}
     **/
  }

  // event handler to click an phone list item to update phone
  const handlePhoneItemClickEvent: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {

    const targetPhoneId: string = e.currentTarget.getAttribute("data-phone-id");
    const targetPhone = testPhoneList.find((phone: UserPhoneType) => {
      return phone.phoneId == targetPhoneId
    })

    setUserAccountPhoneState(targetPhone);
    setUserAccountPhoneValidationState(defaultUserAccountValidationPhoneData)
    setNew(false);
    setModalOpen(true)
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
        <ListItem key={phone.phoneId} data-phone-id={phone.phoneId} onClick={handlePhoneItemClickEvent}>
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
          <Button onClick={handleAddNewPhoneBtnClickEvent}>
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
