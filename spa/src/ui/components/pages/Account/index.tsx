import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import UserAccountBasicManagement from 'components/common/UserAccountBasicManagement';
import UserAccountPhoneManagement from 'components/common/UserAccountPhoneManagement';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
  }),
);

/**
 * member account management page
 *
 * - it might be better place to fetch the user account info, then send it to child comonents (e.g., UserAccountBasicManagement)
 **/
const Account: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();


  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Account"}
      </Typography>
      <UserAccountBasicManagement />
      <UserAccountPhoneManagement phones={[]}/>
    </React.Fragment>
  )
}

export default Account

