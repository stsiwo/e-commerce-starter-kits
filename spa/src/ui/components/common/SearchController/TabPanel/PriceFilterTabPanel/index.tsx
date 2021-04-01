import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

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

  const [curPriceRange, setPriceRange] = React.useState<number[]>([0, 5000]);

  const handlePriceRangeChangeEvent = (event: any, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const labelPrice = (value: number) => {
    return `$${value}`;
  }


  return (
    <Box p={3}>
      <Typography id="range-slider" gutterBottom>
        Price Range
      </Typography>
      <Slider
        value={curPriceRange}
        onChange={handlePriceRangeChangeEvent}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={labelPrice}
        max={5000}
      />
    </Box>
  )
}

export default PriceFilterTabPanel


