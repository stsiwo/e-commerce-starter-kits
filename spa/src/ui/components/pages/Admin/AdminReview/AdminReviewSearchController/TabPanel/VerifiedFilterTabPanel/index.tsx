import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reviewQueryIsVerifiedActions } from 'reducers/slices/domain/review';
import { mSelector } from 'src/selectors/selector';

//interface VerifiedFilterTabPanelPropsType {
//  curVerifiedCheck: boolean
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

const VerifiedFilterTabPanel: React.FunctionComponent<{}> = ({
}) => {

  const classes = useStyles();

  const curIsVerified = useSelector(mSelector.makeReviewQueryIsVerifiedSelector())

  const dispatch = useDispatch();
  const handleVerifiedCheckChangeEvent = (event: any, newValue: boolean) => {
    dispatch(reviewQueryIsVerifiedActions.update(newValue))
  };

  return (
    <Box p={3}>
      <Typography id="range-slider" gutterBottom>
        Verified
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={curIsVerified}
            onChange={handleVerifiedCheckChangeEvent}
            name="checkedB"
            color="primary"
          />
        }
        label="Verified Only"
      />
    </Box>
  )
}

export default VerifiedFilterTabPanel



