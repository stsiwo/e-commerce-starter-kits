import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import FacebookIcon from '@material-ui/icons/Facebook';
import HomeIcon from '@material-ui/icons/Home';
import InstagramIcon from '@material-ui/icons/Instagram';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import SearchForm from 'components/common/SearchForm';
import * as React from 'react';
import { Link as RRLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      backgroundColor: theme.palette.secondary.main,
      color: "#FFF",
      textAlign: "center",
    },
    gridBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      maxWidth: "1500px",
      margin: "0 auto",
    },
    columnOne: {
      padding: theme.spacing(2),
    },
    columnTwo: {
      padding: theme.spacing(2),
    },
    columnThree: {
      padding: theme.spacing(2),
    },
    bottom: {
      padding: theme.spacing(2),
    },
    title: {
      margin: `${theme.spacing(1)}px 0`,
    },
    parag: {
    },
    linkBox: {
      padding: theme.spacing(1),
    },
    policyLinkBox: {
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "center",
    },
    policyLink: {
      margin: `0 ${theme.spacing(2)}px`,
    }
  }),
);
const Footer: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Grid
        container
        className={classes.gridBox}
      >
        <Grid
          item
          className={classes.columnOne}
          xs={12}
          md={4}
        >
          <Typography variant="h6" component="h6" className={classes.title} >
            <SentimentSatisfiedOutlinedIcon />
            {"Compnay Name"}
          </Typography>
          <Typography variant="body2" component="p" className={classes.parag} >
            {"company description here. it might be a long sentense so should be do something different than the other component."}
          </Typography>
          <Box className={classes.linkBox}>
            <Link href="https://google.com" target="_blank">
              <FacebookIcon fontSize="large" />
            </Link>
            <Link href="https://google.com" target="_blank">
              <InstagramIcon fontSize="large" />
            </Link>
            <Link href="https://google.com" target="_blank">
              <TwitterIcon fontSize="large" />
            </Link>
            <Link href="https://google.com" target="_blank">
              <YouTubeIcon fontSize="large" />
            </Link>
            <Link component={props => <RRLink {...props} to="/contact" />}>
              <AlternateEmailIcon fontSize="large" />
            </Link>
          </Box>
        </Grid>
        <Grid
          item
          className={classes.columnTwo}
          xs={12}
          md={4}
        >
          <Typography variant="h6" component="h6" className={classes.title} >
            {"Links"}
          </Typography>
          <List>
            <ListItem button component={props => <RRLink {...props} to="/" />}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={props => <RRLink {...props} to="/" />}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={props => <RRLink {...props} to="/" />}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={props => <RRLink {...props} to="/" />}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </List>
        </Grid>
        <Grid
          item
          className={classes.columnThree}
          xs={12}
          md={4}
        >
          <Typography variant="h6" component="h6" className={classes.title} >
            {"Product Search"}
          </Typography>
          <Typography variant="body2" component="p" className={classes.parag} >
            {"Let's explore our products."}
          </Typography>
          <SearchForm />
        </Grid>
      </Grid>
      <Box className={classes.bottom}>
        <Box className={classes.policyLinkBox}>
          <Link className={classes.policyLink} component={props => <RRLink {...props} to="/return-policy" />}>
            {"Return Policy"}
          </Link>
          <Link className={classes.policyLink} component={props => <RRLink {...props} to="/privacy-policy" />}>
            {"Privacy Policy"}
          </Link>
          <Link className={classes.policyLink} component={props => <RRLink {...props} to="/terms-and-conditions" />}>
            {"Terms and Conditions"}
          </Link>
        </Box>
        <Typography variant="body2" component="p" className={classes.title} >
          {"All Right Reserved by @Company Name 2021"}
        </Typography>
      </Box>
    </footer>
  )
}

export default Footer


