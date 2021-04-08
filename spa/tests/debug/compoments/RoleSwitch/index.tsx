import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import TestAvatarImg from 'static/self.jpeg';
import { UserTypeEnum, AuthType } from 'src/app';
import { authActions } from 'reducers/slices/app';
import { UserType } from 'domain/user/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      position: 'fixed',
      left: '75%',
      bottom: '0',
      transform: 'translateX(-50%)',
      backgroundColor: "#b3d9ff",
      zIndex: 10,
    },
  }),
);

const mockUserGenerator: (userType: UserTypeEnum, user?: UserType) => AuthType = (userType, user?) => {
  return {
    isLoggedIn: userType !== UserTypeEnum.GUEST ? true : false, 
    ...(userType !== UserTypeEnum.GUEST && {user: user}),
    userType: userType
  } as AuthType
}

const RoleSwitch: React.FunctionComponent<{}> = (props) => {

  const testUserData: UserType = React.useMemo(() => ({
    firstName: "satoshi", 
    lastName: "iwao",
    email: "satoshi@test.com",
    avatarImagePath: TestAvatarImg 
  }), [])

  const dispatch = useDispatch()

  const classes = useStyles();

  const handleGuestRoleClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    dispatch(authActions.login(mockUserGenerator(UserTypeEnum.GUEST)))
  }

  const handleMemberRoleClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    dispatch(authActions.login(mockUserGenerator(UserTypeEnum.MEMBER, testUserData)))
  }
  
  const handleAdminRoleClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    dispatch(authActions.login(mockUserGenerator(UserTypeEnum.ADMIN, testUserData)))
  }

  return (
    <Box component="div" className={classes.box}>
      <Button onClick={handleGuestRoleClickEvent}>Guest</Button>
      <Button onClick={handleMemberRoleClickEvent}>Member</Button>
      <Button onClick={handleAdminRoleClickEvent}>Admin</Button>
    </Box>
  )
}

export default RoleSwitch
