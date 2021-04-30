import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { UserType } from 'domain/user/types';
import * as React from 'react';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
    },
    btnBox: {
      position: "absolute",
      top: "50%",
      right: 0,
      // '-50%' is not really center vertically
      transform: 'translateY(-40%)',
    }
  }),
);

/**
 * member or admin account management component
 **/
const SearchForm: React.FunctionComponent<{}> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // sample autocomplete list 
  const testItemList = [
    "aaa",
    "bbb",
    "ccc",
    "ddd",
    "eee",
    "fff",
    "ggg",
    "hhh",
  ];

  return (
    <Box className={classes.root}>
      <Autocomplete
        color={"secondary"}
        freeSolo
        id="product-search-autocomplete-input"
        disableClearable
        options={testItemList}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Your Products"
            margin="normal"
            variant="outlined"
            InputProps={{ ...params.InputProps, type: 'search' }}
          />
        )}
      />
      <IconButton className={classes.btnBox}>
        <SearchIcon fontSize={"large"}/>        
      </IconButton>
    </Box>
  )
}

export default SearchForm



