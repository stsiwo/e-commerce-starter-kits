import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import * as React from 'react';
import SampleSelfImage from 'static/self.jpeg';
import { UserType } from 'domain/user/types';

interface UserCardPropsType {
  user: UserType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1)
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
const UserCard: React.FunctionComponent<UserCardPropsType> = ({ user }) => {

  // mui: makeStyles
  const classes = useStyles();

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Avatar alt="" src={SampleSelfImage} />}
        title={user.firstName + " " + user.lastName}
        subheader={user.userType}
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


