import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { wishlistItemQueryStartDateActions, wishlistItemQueryEndDateActions } from 'reducers/slices/domain/wishlistItem';
import { mSelector } from 'src/selectors/selector';

//interface ReleaseDateFilterTabPanelPropsType {
//  curStartDate: Date
//  curEndDate: Date
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

/**
 * you need to install this dependency rather than material-ui
 *
 *  - https://material-ui-pickers.dev/getting-started/installation
 *  - https://material-ui.com/components/pickers/
 *
 *  - you also need to install @date-io/date-fns or other peer dependency
 *
 *  TODO: 
 *
 *    - disable the date before start date when updating end date
 *
 **/

const ReleaseDateFilterTabPanel: React.FunctionComponent<{}> = ({
}) => {

  const classes = useStyles();

  const dispatch = useDispatch();

  const curStartDate = useSelector(mSelector.makeWishlistItemQueryStartDateSelector())
  const curEndDate = useSelector(mSelector.makeWishlistItemQueryEndDateSelector())

  const handleStartDateChange = (date: Date | null) => {
    dispatch(wishlistItemQueryStartDateActions.update(date));
  };

  const handleEndDateChange = (date: Date | null) => {
    dispatch(wishlistItemQueryEndDateActions.update(date));
  };

  return (
    <Box p={3}>
      <Typography id="range-slider" gutterBottom>
        Release Date
      </Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Start Date"
            format="MM/dd/yyyy"
            value={curStartDate}
            onChange={handleStartDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="End Date"
            format="MM/dd/yyyy"
            value={curEndDate}
            onChange={handleEndDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </Box>
  )
}

export default ReleaseDateFilterTabPanel



