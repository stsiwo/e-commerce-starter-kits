import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import BgImg2 from "static/sample-hero-background-original-overlay.jpg";
import HeroTitle from "./HeroTitle";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapperBox: {},
    heroImgBox: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url(${BgImg2}) no-repeat center center scroll`,
      zIndex: -1,
    },
    heroImage: {
      width: "100%",
      height: "auto",
    },
    textBox: {
      margin: "40vh 0",
    },
  })
);

const Hero: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  return (
    <Box component="div" className={classes.wrapperBox}>
      <Box component="div" className={classes.heroImgBox}>
        {/**
         *
        <img
          src={BgImg2}
          className={classes.heroImage}
          alt="stsDev Hero Image"
        />
         */}
      </Box>
      <Box component="div" className={classes.textBox}>
        <HeroTitle />
        {/**
        <Typography variant="h3" component="h3" align="center" className={""}>
          {"Buy What You Love"}
        </Typography>
 */}
      </Box>
    </Box>
  );
};

export default Hero;
