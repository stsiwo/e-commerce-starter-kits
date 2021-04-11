import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      margin: theme.spacing(1),
      textAlign: "center",
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      maxWidth: 300,
      margin: "5px 5px",
      
    },
    actionBox: {
      textAlign: "center"
    },
  }),
);

declare type CustomerBasicConfirmPropsType = {
}

/**
 * checkout: payment - customer basic info conform form  
 *
 * process:
 *
 *  1. display all user basic info
 *
 *  2. disabled all input 
 *
 *  3. if the user want to edit, change stepper id to go back to 'customer basic informaiton' step.
 *
 **/
const CustomerBasicConfirm: React.FunctionComponent<CustomerBasicConfirmPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // get cur auth user from redux store and display 
  const auth = useSelector(mSelector.makeAuthSelector())

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <TextField
        id="first-name"
        label="First Name"
        className={classes.formControl}
        value={auth.user.firstName}
        disabled
      />
      <TextField
        id="last-name"
        label="Last Name"
        className={classes.formControl}
        value={auth.user.lastName}
        disabled
      />
      <TextField
        id="email"
        label="Email"
        className={classes.formControl}
        value={auth.user.email}
        disabled
      />
      <Box component="div" className={classes.actionBox}>
        <Button>
          Edit
        </Button>
      </Box>
    </form>
  )
}

export default CustomerBasicConfirm




