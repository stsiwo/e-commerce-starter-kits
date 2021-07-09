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
import { useLocation } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(10),
    },
    title: {
      margin: `${theme.spacing(5)}px 0`,
    },
    actionBox: {
      textAlign: "center",
      margin: theme.spacing(2, 0, 2, 0),
    },
  }),
);


const TechnicalError: React.FunctionComponent<{}> = (props) => {

  const auth: AuthType = useSelector(mSelector.makeAuthSelector())
  const classes = useStyles();

  const location = useLocation();

  /**
   * need to force reload otherwise, it does not properly href to the destination of the links.
   *  - when React app crashed, it becomes unresponsive. so force to reload using the below:
   **/
  const handleReload = (link: string) => {
    window.location.href = link
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h4" component="h4" align="center" className={classes.title}>
        Internal Server Error
     </Typography>
      <Typography variant="body2" component="p" align="center" className={classes.title}>
        Oops. We got unexpected error. Please come back later.
     </Typography>
      <Box component="div" className={classes.actionBox}>
        {(auth.userType === UserTypeEnum.GUEST &&
          <React.Fragment>
            <Button variant="contained" onClick={(e) => handleReload("/")}>
              Home
            </Button>
            <Button variant="contained" onClick={(e) => handleReload("/login")}>
              Member Login
            </Button>
            <Button variant="contained" onClick={(e) => handleReload("/admin/login")}>
              Admin Login
            </Button>
          </React.Fragment>
        )}
        {(auth.userType === UserTypeEnum.MEMBER &&
          <React.Fragment>
            <Button variant="contained" onClick={(e) => handleReload("/")}>
              Home
            </Button>
          </React.Fragment>
        )}
        {(auth.userType === UserTypeEnum.ADMIN &&
          <React.Fragment>
            <Button variant="contained" onClick={(e) => handleReload("/admin")}>
              Dashboard
            </Button>
          </React.Fragment>
        )}
      </Box>
    </Container>
  )
}

export default TechnicalError
