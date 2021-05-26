import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import * as React from 'react';
import { UserTypeEnum } from 'src/app';
import SampleSelfImage from 'static/self.jpeg';

interface UserCardPropsType {
  firstName: string
  lastName: string
  userType: UserTypeEnum
  email: string
  avatarImagePath: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: `${theme.spacing(1)}px auto`,
      maxWidth: 700,
    },
    title: {
      textAlign: "center",
    },
    card: {
      display: "flex",
      flexWrap: "nowrap"
    },
    cardHeader: {
      width: "100%",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
    },
    details: {
      flexGrow: 1,
    },
    media: {
      width: 200,
    }
  }),
);

/**
 * member or admin account management component
 **/
const UserCard: React.FunctionComponent<UserCardPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  const imagePath = props.avatarImagePath ? API1_URL + props.avatarImagePath : ""

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Avatar alt="" src={imagePath} />
        }
        title={`${props.firstName} ${props.lastName} (${props.userType})`}
        subheader={props.email}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
      >
      </CardHeader>
    </Card>
  )
}

export default UserCard


