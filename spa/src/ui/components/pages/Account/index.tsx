import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import UserAccountManagement from 'components/common/UserAccountManagement';

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
 **/
const Account: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Account"}
      </Typography>
      <UserAccountManagement />
    </React.Fragment>
  )
}

export default Account

