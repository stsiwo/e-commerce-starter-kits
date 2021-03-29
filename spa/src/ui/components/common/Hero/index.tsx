import * as React from 'react';
import Box from '@material-ui/core/Box';
import HeroBCImage from 'static/sample-hero-background-19-7-overlay.jpg'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapperBox: {
      position: "relative",
    },
    heroImage: {
      width: "100%", 
      zIndex: -1,
    },
    textBox: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  }),
);

const Hero: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  return (
    <Box component="div" className={classes.wrapperBox}>
      <img src={HeroBCImage} className={classes.heroImage} alt="stsDev Hero Image" />
      <Box component="div" className={classes.textBox} >
        <Typography variant="h2" component="h2" align="center">
          {"stsDev"}
        </Typography>
      </Box>
    </Box>
  )
}

export default Hero


