import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import ContactForm from 'components/common/ContactForm';

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
 * guest & member contact page
 *
 **/
const Contact: React.FunctionComponent<{}> = (props) => {


  const classes = useStyles();

  const dispatch = useDispatch()

  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Contact"}
      </Typography>
      <Typography variant="body1" component="p" align="center" >
        {"If you have any inquiry/feedback about my company, products, and your purchase, please use this contact form. We will respond your request as soon as possible."}
      </Typography>
      <ContactForm />
    </React.Fragment>
  )
}

export default Contact


