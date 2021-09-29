import { createStyles, Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import BgImg from "static/bg-1.jpg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bg: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url('${BgImg}') no-repeat center center fixed`,
    },
  })
);

const StaticBackground: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  return <div className={classes.bg}> </div>;
};

export default StaticBackground;
