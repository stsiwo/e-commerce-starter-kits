import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productQueryIsDiscountActions } from 'reducers/slices/domain/product';
import { mSelector } from 'src/selectors/selector';

//interface DiscountFilterTabPanelPropsType {
//  curDiscountCheck: boolean
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

const DiscountFilterTabPanel: React.FunctionComponent<{}> = ({
}) => {

  const classes = useStyles();

  const curIsDiscount = useSelector(mSelector.makeProductQueryIsDiscountSelector())

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
            checked={curIsDiscount}
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



