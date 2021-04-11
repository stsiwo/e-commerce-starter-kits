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
      margin: theme.spacing(1),
    },
  }),
);

declare type PhoneConfirmCardPropsType = {
  phone: UserPhoneType
}

const PhoneConfirmCard: React.FunctionComponent<PhoneConfirmCardPropsType> = (props) => {

  const classes = useStyles();

  /**
   * what is difference btw <CardActionArea> and <CardActions>
   **/

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
      <CardContent>
        <Typography variant="body1" component="p">
          {`${props.phone.countryCode} ${props.phone.phone}`}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default PhoneConfirmCard






