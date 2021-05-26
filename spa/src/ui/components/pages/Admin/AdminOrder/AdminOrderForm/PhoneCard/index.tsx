import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import { UserPhoneType } from 'domain/user/types';
import * as React from 'react';

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

declare type PhoneCardPropsType = {
  phone: string
}

const PhoneCard: React.FunctionComponent<PhoneCardPropsType> = (props) => {

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar>
            <PhoneIphoneIcon />
          </Avatar>
        }
        title={"Phone #"}
      />
      <CardContent className={classes.content}>
        {!props.phone &&
          <Typography variant="body1" component="p" align="left" >
            {"Oops. You haven't selected your primary phone."}
          </Typography>
        }
        {props.phone &&
          <Typography variant="body1" component="p">
            {`${props.phone}`}
          </Typography>
        }
      </CardContent>
    </Card>
  )
}

export default PhoneCard







