import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import HeroTitle from "./HeroTitle";

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
      margin: "40vh 0",
    },
  })
);

const Hero: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  return (
    <Box component="div" className={classes.wrapperBox}>
      {/**<img src={HeroBCImage} className={classes.heroImage} alt="stsDev Hero Image" />**/}
      <Box component="div" className={classes.textBox}>
        <HeroTitle />
      </Box>
    </Box>
  );
};

export default Hero;
