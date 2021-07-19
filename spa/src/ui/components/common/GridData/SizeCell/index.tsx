import Avatar from "@material-ui/core/Avatar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";

interface SizeCellPropsType {
  value: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: theme.shadows[3],
      width: 25,
      height: 25,
      margin: theme.spacing(0, 1),
      fontSize: "15px",
      color: theme.palette.fifth.main,
    },
  })
);

/**
 * admin account management page
 *
 **/
const SizeCell: React.FunctionComponent<SizeCellPropsType> = (props) => {
  const classes = useStyles();

  return <Avatar className={classes.root}>{props.value}</Avatar>;
};

export default SizeCell;
