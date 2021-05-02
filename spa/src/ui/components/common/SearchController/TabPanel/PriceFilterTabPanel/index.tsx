import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { cadCurrencyFormat } from 'src/utils';
import { useDispatch } from 'react-redux';
import { productQueryMinPriceActions, productQueryMaxPriceActions } from 'reducers/slices/domain/product';

interface PriceFilterTabPanelPropsType {
  curMinPrice: number
  curMaxPrice: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

const PriceFilterTabPanel: React.FunctionComponent<PriceFilterTabPanelPropsType> = ({
  curMinPrice,
  curMaxPrice
}) => {

  const classes = useStyles();
  const dispatch = useDispatch();

  const handlePriceRangeChangeEvent = (event: any, newValue: number[]) => {
    
    /**
     * left slider piont and right slider point might be swapped each other.
     *
     * also, dispatch only when the value changes.
     *
     **/
    if (newValue[0] <= newValue[1]) {
      if (newValue[0] != curMinPrice) dispatch(productQueryMinPriceActions.update(newValue[0])) 
      if (newValue[1] != curMaxPrice) dispatch(productQueryMaxPriceActions.update(newValue[1])) 
    } else {
      if (newValue[1] != curMinPrice) dispatch(productQueryMinPriceActions.update(newValue[1])) 
      if (newValue[0] != curMaxPrice) dispatch(productQueryMaxPriceActions.update(newValue[0])) 
    }
  };

  const labelPrice = (value: number) => {
    return `$${cadCurrencyFormat(value)}`;
  }

  return (
    <Box p={3}>
      <Typography id="range-slider" gutterBottom>
        Price Range
      </Typography>
      <Slider
        value={[curMinPrice, curMaxPrice]}
        onChange={handlePriceRangeChangeEvent}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={labelPrice}
        max={1000}
      />
    </Box>
  )
}

export default PriceFilterTabPanel


