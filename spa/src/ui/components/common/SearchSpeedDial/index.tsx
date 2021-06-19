import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';

interface SearchSpeedDialFormPropsType {
  searchQuery: string,
  onChange: (searchQuery: string) => void,
  label: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 380,
      transform: 'translateZ(0px)',
      flexGrow: 1,
    },
    speedDial: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);

/**
 * member or admin account management component
 **/
const SearchSpeedDial: React.FunctionComponent<SearchSpeedDialFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const handleVisibility = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  }

  return (
    <SpeedDial
      ariaLabel="SpeedDial tooltip example"
      className={classes.speedDial}
      hidden={hidden}
      icon={<SearchIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      <SpeedDialAction
        icon={
          <TextField
            type="search"
            label={props.label}
            margin="normal"
            value={props.searchQuery}
            onChange={handleSearchChange}
          />
        }
        tooltipTitle={"search"}
        tooltipOpen
        onClick={handleClose}
      />

    </SpeedDial>
  )

}

export default SearchSpeedDial




