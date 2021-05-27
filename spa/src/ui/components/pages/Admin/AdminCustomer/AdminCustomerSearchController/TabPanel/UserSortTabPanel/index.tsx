import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { UserSortEnum } from 'domain/user/types';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userQuerySortActions } from 'reducers/slices/domain/user';
import { mSelector } from 'src/selectors/selector';

//interface SortTabPanelPropsType {
//  
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

const userSortList = [
  {
    value: UserSortEnum.DATE_DESC,
    label: "Recent",
  },
  {
    value: UserSortEnum.DATE_ASC,
    label: "Old",
  },
]


const UserSortTabPanel: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const dispatch = useDispatch();

  const curSort = useSelector(mSelector.makeUserQuerySortSelector())

  const handleUserSortInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    dispatch(userQuerySortActions.update(e.currentTarget.value as UserSortEnum))
  }

  const renderUserSortRadioInputs: () => React.ReactNode = () => {
    console.log("renderUserSortRadioInputs updated");
    return userSortList.map((sort) => {
      return (
        <FormControlLabel value={sort.value.toString()} control={<Radio />} label={sort.label} key={sort.value} />
      )
    })
  }

  return (
    <Box p={3}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select Sort</FormLabel>
        <RadioGroup aria-label="user-sort" name="user-sort" value={curSort} onChange={handleUserSortInputChangeEvent}>
          {renderUserSortRadioInputs()}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export default UserSortTabPanel
