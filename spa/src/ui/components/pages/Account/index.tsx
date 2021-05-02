import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import UserAccountBasicManagement from 'components/common/UserAccountBasicManagement';
import UserAccountPhoneManagement from 'components/common/UserAccountPhoneManagement';
import UserAccountAddressManagement from 'components/common/UserAccountAddressManagement';
import Grid from '@material-ui/core/Grid';
import UserAccountAvatarManagement from 'components/common/UserAccountAvatarManagement';


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
      margin: theme.spacing(1) 
    }
  }),
);

/**
 * member account management page
 *
 **/
const Account: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();


  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Account"}
      </Typography>
      <Grid 
        container 
        justify="center" 
        alignItems="center"
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
          <UserAccountBasicManagement />
        </Grid>
        <Grid 
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <UserAccountPhoneManagement phones={[]}/>
        </Grid>
        <Grid 
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <UserAccountAddressManagement addresses={[]}/>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Account

