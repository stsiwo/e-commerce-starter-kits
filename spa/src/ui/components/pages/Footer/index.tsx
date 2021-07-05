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
import ContactMailIcon from '@material-ui/icons/ContactMail';
import FacebookIcon from '@material-ui/icons/Facebook';
import HomeIcon from '@material-ui/icons/Home';
import InstagramIcon from '@material-ui/icons/Instagram';
import SearchIcon from '@material-ui/icons/Search';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RRLink } from "react-router-dom";
import { fetchCompanyActionCreator } from 'reducers/slices/domain/company';
import { rsSelector } from 'src/selectors/selector';
import SearchForm from 'components/common/SearchForm';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      //backgroundColor: theme.palette.secondary.main,
      //color: "#FFF",
      textAlign: "center",
      paddingTop: theme.spacing(20),
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
    },
    searchBox: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
      margin: theme.spacing(1)
    },
  }),
);
const Footer: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const dispatch = useDispatch()

  const history = useHistory();
  
  /**
   * company stuff
   **/
  const curCompany = useSelector(rsSelector.domain.getCompany)
  React.useEffect(() => {

    if (!curCompany) {
      dispatch(
        fetchCompanyActionCreator()
      )
    }
  }, [
    ])

  /**
   * search query stuffs
   **/
  const [curSearchQuery, setSearchQuery] = React.useState<string>("");
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  }

  const handleSearchClick = () => {
    history.push("/search?searchQuery=" + curSearchQuery);
  }


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
            {curCompany ? curCompany.companyName : ""}
          </Typography>
          <Typography variant="body2" component="p" className={classes.parag} >
            {curCompany ? curCompany.companyDescription : ""}
          </Typography>
          <Box className={classes.linkBox}>
            <Link href={curCompany ? curCompany.facebookLink : ""} target="_blank">
              <FacebookIcon fontSize="large" />
            </Link>
            <Link href={curCompany ? curCompany.instagramLink : ""} target="_blank">
              <InstagramIcon fontSize="large" />
            </Link>
            <Link href={curCompany ? curCompany.twitterLink : ""} target="_blank">
              <TwitterIcon fontSize="large" />
            </Link>
            <Link href={curCompany ? curCompany.youtubeLink : ""} target="_blank">
              <YouTubeIcon fontSize="large" />
            </Link>
            <Link component={RRLink} to="/contact">
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
            <ListItem button component={RRLink} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={RRLink} to="/">
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Product Search" />
            </ListItem>
            <ListItem button component={RRLink} to="/contact">
              <ListItemIcon>
                <ContactMailIcon />
              </ListItemIcon>
              <ListItemText primary="Contact" />
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
          <Box className={classes.searchBox}>
            <SearchForm searchQuery={curSearchQuery} onChange={handleSearchChange} label={"search..."} onClick={handleSearchClick} />
          </Box>
        </Grid>
      </Grid>
      <Box className={classes.bottom}>
        <Box className={classes.policyLinkBox}>
          {/** might use this dialog rather than page **/}
          <Link className={classes.policyLink} component={RRLink} to="/return-policy">
            {"Return Policy"}
          </Link>
          <Link className={classes.policyLink} component={RRLink} to="/privacy-policy">
            {"Privacy Policy"}
          </Link>
          <Link className={classes.policyLink} component={RRLink} to="/terms-and-conditions">
            {"Terms and Conditions"}
          </Link>
        </Box>
        <Typography variant="body2" component="p" className={classes.title} >
          {`All Right Reserved by @${curCompany ? curCompany.companyName : ""} ${new Date().getFullYear()}`}
        </Typography>
      </Box>
    </footer>
  )
}

export default Footer


