import Avatar from '@material-ui/core/Avatar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';

interface ColorCellPropsType {
  value: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: theme.shadows[3],
      width: 25,
      height: 25,
      margin: theme.spacing(0, 1),
    },
  }),
);

/**
 * admin account management page
 *
 **/
const ColorCell: React.FunctionComponent<ColorCellPropsType> = (props) => {

  const classes = useStyles();

  return (
    <Avatar
      className={classes.root}
      style={{
        backgroundColor: props.value 
      }}
    >
      {""}
    </Avatar>
  )
}

export default ColorCell



