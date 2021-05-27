import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { UserType } from 'domain/user/types';
import * as React from 'react';
import AdminCustomerAddressForm from './AdminCustomerAddressForm';
import AdminCustomerBasicForm from './AdminCustomerBasicForm';
import AdminCustomerPhoneForm from './AdminCustomerPhoneForm';
import AdminCustomerAvatarForm from './AdminCustomerAvatarForm';
import TextField from '@material-ui/core/TextField';

interface AdminCustomerFormPropsType {
  user: UserType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    orderDetailBox: {

    },
    title: {
      textAlign: "center",
      fontWeight: theme.typography.fontWeightBold
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      display: "flex",
      maxWidth: 400,
      width: "80%",
      margin: "5px auto",

    },
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
const AdminCustomerForm: React.FunctionComponent<AdminCustomerFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  /**
   * test order date
   **/

  return (
    <Grid
      container
      justify="center"
    >
      <Grid
        item
        xs={12}
        className={classes.orderDetailBox}
      >
        <TextField
          id="customer-id"
          label="Customer Id"
          className={classes.formControl}
          value={props.user.userId}
          inputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        className={classes.orderDetailBox}
      >
        <AdminCustomerAvatarForm user={props.user}/>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        className={classes.orderDetailBox}
      >
        <AdminCustomerBasicForm user={props.user}/>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <AdminCustomerPhoneForm phones={props.user.phones} userId={props.user.userId} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <AdminCustomerAddressForm addresses={props.user.addresses}  userId={props.user.userId} />
      </Grid>
    </Grid>
  )
}

export default AdminCustomerForm
