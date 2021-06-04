import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import OrderList from 'components/common/OrderList';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center"
    }
  }),
);

/**
 * guest & member order page
 *
 **/
const Orders: React.FunctionComponent<{}> = (props) => {


  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Orders"}
      </Typography>
      <OrderList />
    </React.Fragment>
  )
}

export default Orders



