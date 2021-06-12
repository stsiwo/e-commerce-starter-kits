import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import UserAccountBasicManagement from 'components/common/UserAccountBasicManagement';
import UserAccountPhoneManagement from 'components/common/UserAccountPhoneManagement';
import UserAccountAddressManagement from 'components/common/UserAccountAddressManagement';
import Grid from '@material-ui/core/Grid';
import UserAccountAvatarManagement from 'components/common/UserAccountAvatarManagement';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import UserAccountRemovalManagement from 'components/common/UserAccountRemovalManagement';


/**
 * TODO: if you have maxWidth at any parent element, Grid xs,md,..  does not work!!
 **/

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    gridBox: {
    },
    gridItem: {
    }
  }),
);

/**
 * member account management page
 *
 **/
const Account: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const auth = useSelector(mSelector.makeAuthSelector());


  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Account"}
      </Typography>
      <Grid 
        container 
        justify="space-around" 
        alignItems="flex-start"
        className={classes.gridBox}
      >
        <Grid 
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <UserAccountAvatarManagement />
        </Grid>
        <Grid 
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <UserAccountBasicManagement user={auth.user} />
        </Grid>
        <Grid 
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <UserAccountPhoneManagement phones={auth.user.phones}/>
        </Grid>
        <Grid 
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <UserAccountAddressManagement addresses={auth.user.addresses}/>
        </Grid>
        <Grid 
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <UserAccountRemovalManagement user={auth.user}/>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Account

