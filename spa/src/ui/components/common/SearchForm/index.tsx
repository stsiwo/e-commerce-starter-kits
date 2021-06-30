import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as React from 'react';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';

interface SearchFormPropsType {
  searchQuery: string,
  onChange: (searchQuery: string) => void,
  onClick?: () => void,
  label: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "transparent",
      display: "flex",
      flexWrap: "nowrap",
      width: 300,
      paddingLeft: theme.spacing(2),
      boxShadow: "none",
      justifyContent: "flex-end",
      borderRadius: "none",
    },
    searchInput: {
      flexBasis: "80%",
    },
    btnBox: {
      flexBasis: "20%",
    }
  }),
);

/**
 * member or admin account management component
 **/
const SearchForm: React.FunctionComponent<SearchFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // sample autocomplete list 
  //const testItemList = [
  //  "aaa",
  //  "bbb",
  //  "ccc",
  //  "ddd",
  //  "eee",
  //  "fff",
  //  "ggg",
  //  "hhh",
  //];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  }

  const handleSearchClick = (e: React.MouseEvent<HTMLElement>) => {
    if (props.onClick)
      props.onClick();
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      if (props.onClick)
        props.onClick();
    }
  }

  return (
    <Paper
      component="form"
      className={classes.root}
      classes={{
        root: classes.root
      }}>
      {/**
      <Autocomplete
        color={"secondary"}
        className={classes.searchInput}
        freeSolo
        id="product-search-autocomplete-input"
        disableClearable
        options={testItemList}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Your Products"
            margin="normal"
            value={props.searchQuery}
            onChange={handleSearchChange}
            InputProps={{ ...params.InputProps, type: 'search' }}
          />
        )}
      />**/}
      <TextField
        type="search"
        label={props.label}
        margin="normal"
        value={props.searchQuery}
        onChange={handleSearchChange}
        onKeyPress={handleSearchKeyPress}
      />
      <IconButton className={classes.btnBox} onClick={handleSearchClick}>
        <SearchIcon fontSize={"default"} />
      </IconButton>
    </Paper>
  )
}

export default SearchForm



