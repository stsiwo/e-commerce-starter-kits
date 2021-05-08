import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import { UserPhoneType } from 'domain/user/types';
import * as React from 'react';
import { CheckoutStepEnum } from 'components/pages/Checkout';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      /**
       * TODO: need to match height with other elements (e.g., shipping, billing card)
       *
       *  - don't do "100%". it overflows. i don't know why.
       **/
      height: "90%",
      display: "flex",
      flexDirection: "column",
      margin: theme.spacing(1),
    },
    content: {
    },
  }),
);

declare type PhoneConfirmCardPropsType = {
  phone: UserPhoneType
  goToStep?: (step: CheckoutStepEnum) => void
}

const PhoneConfirmCard: React.FunctionComponent<PhoneConfirmCardPropsType> = (props) => {

  const classes = useStyles();

  const handleGoToStep: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    props.goToStep(CheckoutStepEnum.CUSTOMER_CONTACT_INFORMATION)
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar>
            <PhoneIphoneIcon />
          </Avatar>
        }
        title={"Phone #"}
        action={
          <IconButton onClick={handleGoToStep}>
            <EditIcon />
          </IconButton>
        }
      />
      <CardContent className={classes.content}>
        {!props.phone &&
          <Typography variant="body1" component="p" align="left" >
            {"Oops. You haven't selected your primary phone."}
          </Typography>
        }
        {props.phone &&
          <Typography variant="body1" component="p">
            {`${props.phone.countryCode} ${props.phone.phoneNumber}`}
          </Typography>
        }
      </CardContent>
    </Card>
  )
}

export default PhoneConfirmCard






