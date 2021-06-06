import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { UserType, defaultUser } from 'domain/user/types';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from 'reducers/slices/app';
import { AuthType, UserTypeEnum } from 'src/app';
import { testAdminUser, testMemberUser } from 'tests/data/user';

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

//const mockUserGenerator: (userType: UserTypeEnum, user?: UserType) => AuthType = (userType, user?) => {
//  return {
//    isLoggedIn: userType !== UserTypeEnum.GUEST ? true : false, 
//    ...(userType !== UserTypeEnum.GUEST && {user: user}),
//    userType: userType
//  } as AuthType
//}
//
//const RoleSwitch: React.FunctionComponent<{}> = (props) => {
//
//  const dispatch = useDispatch()
//
//  const classes = useStyles();
//
//  const handleGuestRoleClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
//    dispatch(authActions.login(mockUserGenerator(UserTypeEnum.GUEST, defaultUser)))
//  }
//
//  const handleMemberRoleClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
//    dispatch(authActions.login(mockUserGenerator(UserTypeEnum.MEMBER, testMemberUser )))
//  }
//  
//  const handleAdminRoleClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
//    dispatch(authActions.login(mockUserGenerator(UserTypeEnum.ADMIN, testAdminUser)))
//  }
//
//  return (
//    <Box component="div" className={classes.box}>
//      <Button onClick={handleGuestRoleClickEvent}>Guest</Button>
//      <Button onClick={handleMemberRoleClickEvent}>Member</Button>
//      <Button onClick={handleAdminRoleClickEvent}>Admin</Button>
//    </Box>
//  )
//}
//
//export default RoleSwitch
