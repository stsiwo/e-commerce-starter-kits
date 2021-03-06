import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { UserAddressType } from 'domain/user/types';
import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { CheckoutStepEnum } from 'components/pages/Checkout';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      /**
       * TODO: need to match height with other elements (e.g., shipping, billing card)
       *
       *  - don't do "100%". it overflows. i dont know why.
       **/
      height: "90%",
      display: "flex",
      flexDirection: "column",
      margin: theme.spacing(1),
    },
  }),
);

declare type AddressConfirmCardPropsType = {
  headerIcon: React.ReactNode
  title: string
  address: UserAddressType
  goToStep?: (step: CheckoutStepEnum) => void
}

const AddressConfirmCard: React.FunctionComponent<AddressConfirmCardPropsType> = (props) => {

  const classes = useStyles();

  const handleGoToStep: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    props.goToStep(CheckoutStepEnum.CUSTOMER_CONTACT_INFORMATION)
  }


  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar>
            {props.headerIcon}
          </Avatar>
        }
        title={props.title}
        action={
          <IconButton onClick={handleGoToStep}>
            <EditIcon />
          </IconButton>
        }
      />
      <CardContent>
        {!props.address &&
          <Typography variant="body1" component="p" align="left" >
            {"Oops. You haven't selected your address."}
          </Typography>
        }
        {props.address &&
          <React.Fragment>
            <Typography variant="body1" component="p">
              {`${props.address.address1} ${props.address.address2}`}
            </Typography>
            <Typography variant="body1" component="p">
              {`${props.address.city} ${props.address.province}`}
            </Typography>
            <Typography variant="body1" component="p">
              {`${props.address.country} ${props.address.postalCode}`}
            </Typography>
          </React.Fragment>
        }
      </CardContent>
    </Card>
  )
}

export default AddressConfirmCard





