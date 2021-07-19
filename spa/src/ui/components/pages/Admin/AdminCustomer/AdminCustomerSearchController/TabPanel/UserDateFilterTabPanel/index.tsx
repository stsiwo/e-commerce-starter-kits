import DateFnsUtils from "@date-io/date-fns";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  userQueryEndDateActions,
  userQueryStartDateActions,
} from "reducers/slices/domain/user";
import { mSelector } from "src/selectors/selector";

//interface ReleaseDateFilterTabPanelPropsType {
//  curStartDate: Date
//  curEndDate: Date
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {},
  })
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

const UserDateFilterTabPanel: React.FunctionComponent<{}> = ({}) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const curStartDate = useSelector(mSelector.makeUserQueryStartDateSelector());
  const curEndDate = useSelector(mSelector.makeUserQueryEndDateSelector());

  const handleStartDateChange = (date: Date | null) => {
    dispatch(userQueryStartDateActions.update(date));
  };

  const handleEndDateChange = (date: Date | null) => {
    dispatch(userQueryEndDateActions.update(date));
  };
  const handleReset: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (
    e
  ) => {
    dispatch(userQueryStartDateActions.clear());
    dispatch(userQueryEndDateActions.clear());
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
              "aria-label": "change date",
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
              "aria-label": "change date",
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <Button onClick={handleReset} variant="contained">
        Reset
      </Button>
    </Box>
  );
};

export default UserDateFilterTabPanel;
