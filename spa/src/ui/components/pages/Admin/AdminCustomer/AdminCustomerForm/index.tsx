import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import OrderTimeline from 'components/common/OrderTimeline';
import ProductHorizontalCard from 'components/common/ProductCard/ProductHorizontalCard';
import TimelineUpdateForm from 'components/common/TimelineUpdateForm';
import UserCard from 'components/common/UserCard';
import { OrderDetailType, OrderType } from 'domain/order/types';
import * as React from 'react';
import { generateOrderList } from 'tests/data/order';
import AdminCustomerDetail from '../AdminCustomerDetail';
import { testMemberUser } from 'tests/data/user';
import UserAccountBasicManagement from 'components/common/UserAccountBasicManagement';
import UserAccountPhoneManagement from 'components/common/UserAccountPhoneManagement';
import UserAccountAddressManagement from 'components/common/UserAccountAddressManagement';
import { UserType } from 'domain/user/types';

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
        <Typography variant="subtitle1" component="h6" className={classes.title}>
          {"Basic"}
        </Typography>
        <UserAccountBasicManagement user={props.user}/>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <Typography variant="subtitle1" component="h6" className={classes.title}>
          {"Phones"}
        </Typography>
        <UserAccountPhoneManagement phones={props.user.phones} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <Typography variant="subtitle1" component="h6" className={classes.title}>
          {"Addresses"}
        </Typography>
        <UserAccountAddressManagement addresses={props.user.addresses} />
      </Grid>
    </Grid>
  )
}

export default AdminCustomerForm
