import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { UserTypeEnum } from "src/app";
import { getApiUrl } from "src/utils";

interface UserCardPropsType {
  firstName: string;
  lastName: string;
  userType: UserTypeEnum;
  email: string;
  avatarImagePath: string;
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
      flexWrap: "nowrap",
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
    },
  })
);

/**
 * member or admin account management component
 **/
const UserCard: React.FunctionComponent<UserCardPropsType> = (props) => {
  // mui: makeStyles
  const classes = useStyles();

  // avatar image
  const curAvatarImageUrl = props.avatarImagePath
    ? getApiUrl(props.avatarImagePath)
    : null;

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Avatar alt="" src={curAvatarImageUrl} />}
        title={`${props.firstName} ${props.lastName} (${props.userType})`}
        subheader={props.email}
        /*
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        */
      ></CardHeader>
    </Card>
  );
};

export default UserCard;
