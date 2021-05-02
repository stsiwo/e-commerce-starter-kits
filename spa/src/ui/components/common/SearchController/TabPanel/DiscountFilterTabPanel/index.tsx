import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useDispatch } from 'react-redux';
import { productQueryIsDiscountActions } from 'reducers/slices/domain/product';

interface DiscountFilterTabPanelPropsType {
  curDiscountCheck: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

const DiscountFilterTabPanel: React.FunctionComponent<DiscountFilterTabPanelPropsType> = ({
  curDiscountCheck
}) => {

  const classes = useStyles();

  const dispatch = useDispatch();
  const handleDiscountCheckChangeEvent = (event: any, newValue: boolean) => {
    dispatch(productQueryIsDiscountActions.update(newValue))
  };

  return (
    <Box p={3}>
      <Typography id="range-slider" gutterBottom>
        Discount
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={curDiscountCheck}
            onChange={handleDiscountCheckChangeEvent}
            name="checkedB"
            color="primary"
          />
        }
        label="Discount Only"
      />
    </Box>
  )
}

export default DiscountFilterTabPanel



