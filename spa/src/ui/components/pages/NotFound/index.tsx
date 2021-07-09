import * as React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link as RRLink } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';
import { AuthType, UserTypeEnum } from 'src/app';
import { mSelector } from 'src/selectors/selector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: `${theme.spacing(5)}px 0`,
    },
    actionBox: {
      textAlign: "center",
      margin: theme.spacing(2, 0, 2, 0),
    },
  }),
);

const NotFound: React.FunctionComponent<{}> = (props) => {

  const auth: AuthType = useSelector(mSelector.makeAuthSelector())
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h4" align="center" className={classes.title}>
        Page Not Found
     </Typography>
      <Box component="div" className={classes.actionBox}>
        {(auth.userType === UserTypeEnum.GUEST &&
          <React.Fragment>
            <Button variant="contained" component={RRLink} to={"/"}>
              Home
            </Button>
            <Button variant="contained" component={RRLink} to={"/login"}>
              Member Login
            </Button>
            <Button variant="contained" component={RRLink} to={"/admin/login"}>
              Admin Login
            </Button>
          </React.Fragment>
        )}
        {(auth.userType === UserTypeEnum.MEMBER &&
          <React.Fragment>
            <Button variant="contained" component={RRLink} to={"/"}>
              Home
            </Button>
          </React.Fragment>
        )}
        {(auth.userType === UserTypeEnum.ADMIN &&
          <React.Fragment>
            <Button variant="contained" component={RRLink} to={"/admin"}>
              Dashboard
            </Button>
          </React.Fragment>
        )}
      </Box>
    </Container>
  )
}

export default NotFound


