import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { UserActiveEnum, userActiveLabelList } from 'domain/user/types';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userQueryActiveActions } from 'reducers/slices/domain/user';
import { mSelector } from 'src/selectors/selector';
import Button from '@material-ui/core/Button';

//interface ActiveTabPanelPropsType {
//  
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

const userActiveList = [
  {
    value: UserActiveEnum.ACTIVE,
    label: userActiveLabelList.ACTIVE, 
  },
  {
    value: UserActiveEnum.BLACKLIST,
    label: userActiveLabelList.BLACKLIST, 
  },
  {
    value: UserActiveEnum.CUSTOMER_DELETED,
    label: userActiveLabelList.CUSTOMER_DELETED, 
  },
  {
    value: UserActiveEnum.TEMP,
    label: userActiveLabelList.TEMP, 
  },
]


const UserActiveTabPanel: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const dispatch = useDispatch();

  const curActive = useSelector(mSelector.makeUserQueryEndDateSelector())

  const handleUserActiveInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    dispatch(userQueryActiveActions.update(e.currentTarget.value as UserActiveEnum))
  }

  const renderUserActiveRadioInputs: () => React.ReactNode = () => {
    return userActiveList.map((active) => {
      return (
        <FormControlLabel value={active.value.toString()} control={<Radio />} label={active.label} key={active.value} />
      )
    })
  }

  const handleReset: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    dispatch(userQueryActiveActions.clear())
  }

  return (
    <Box p={3}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select Active Status</FormLabel>
        <RadioGroup aria-label="user-active" name="user-active" value={curActive} onChange={handleUserActiveInputChangeEvent}>
          {renderUserActiveRadioInputs()}
        </RadioGroup>
      </FormControl>
        <Button onClick={handleReset}>
          Reset
      </Button>
    </Box>
  )
}

export default UserActiveTabPanel
