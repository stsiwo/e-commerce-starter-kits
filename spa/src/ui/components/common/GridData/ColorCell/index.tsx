import Avatar from "@material-ui/core/Avatar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import Badge from "@material-ui/core/Badge";

interface ColorCellPropsType {
  value: string;
  checked?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "inline-block",
      boxShadow: theme.shadows[3],
      width: 25,
      height: 25,
      margin: theme.spacing(0, 1),
    },
  })
);

/**
 * admin account management page
 *
 **/
const ColorCell: React.FunctionComponent<ColorCellPropsType> = (props) => {
  const classes = useStyles();

  if (props.checked) {
    return (
      <Badge color="secondary" variant="dot">
        <Avatar
          className={classes.root}
          style={{
            backgroundColor: props.value,
          }}
        >
          {""}
        </Avatar>
      </Badge>
    );
  }

  return (
    <Avatar
      className={classes.root}
      style={{
        backgroundColor: props.value,
      }}
    >
      {""}
    </Avatar>
  );
};

export default ColorCell;
