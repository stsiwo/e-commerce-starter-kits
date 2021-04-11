import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { UserAddressType } from 'domain/user/types';
import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(1),
    },
  }),
);

declare type AddressConfirmCardPropsType = {
  headerIcon: React.ReactNode
  title: string
  address: UserAddressType
}

const AddressConfirmCard: React.FunctionComponent<AddressConfirmCardPropsType> = (props) => {

  const classes = useStyles();

  /**
   * what is difference btw <CardActionArea> and <CardActions>
   **/

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar>
            {props.headerIcon}
          </Avatar>
        }
        title={props.title}
      />
      <CardContent>
        <Typography variant="body1" component="p"> 
          {`${props.address.address1} ${props.address.address2}`}
        </Typography> 
        <Typography variant="body1" component="p"> 
          {`${props.address.city} ${props.address.province} ${props.address.postalCode}`}
        </Typography> 
        <Typography variant="body1" component="p"> 
          {`${props.address.country}`}
        </Typography> 
      </CardContent>
    </Card>
  )
}

export default AddressConfirmCard





