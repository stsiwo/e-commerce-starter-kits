import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { cadCurrencyFormat } from 'src/utils';
import { useDispatch, useSelector } from 'react-redux';
import { productQueryMinPriceActions, productQueryMaxPriceActions } from 'reducers/slices/domain/product';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { mSelector } from 'src/selectors/selector';

//interface PriceFilterTabPanelPropsType {
//  curMinPrice: number
//  curMaxPrice: number
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
    margin: {
      margin: theme.spacing(1),
    },
    contentBox: {
      display: "flex",
      alignItems: "center",
    }
  }),
);

const PriceFilterTabPanel: React.FunctionComponent<{}> = ({
}) => {

  const classes = useStyles();
  const dispatch = useDispatch();

  const curMinPrice = useSelector(mSelector.makeProductQueryMinPriceSelector());
  const curMaxPrice = useSelector(mSelector.makeProductQueryMaxPriceSelector());

  const handleMinChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPrice = parseInt(e.currentTarget.value);
    dispatch(productQueryMinPriceActions.update(nextPrice));
  }

  const handleMaxChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextPrice = parseInt(e.currentTarget.value);
    dispatch(productQueryMaxPriceActions.update(nextPrice))
  }

  return (
    <Box p={3}>
      <Typography id="range-slider" gutterBottom>
        Price Range
      </Typography>
      <Box className={classes.contentBox}>
        <FormControl className={classes.margin}>
          <InputLabel htmlFor="standard-adornment-amount">Minimum Price</InputLabel>
          <Input
            id="min-price"
            value={curMinPrice}
            onChange={handleMinChange}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
        <FormControl className={classes.margin}>
          <InputLabel htmlFor="standard-adornment-amount">Maximum Price</InputLabel>
          <Input
            id="max-price"
            value={curMaxPrice}
            onChange={handleMaxChange}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
      </Box>
    </Box>
  )
}

export default PriceFilterTabPanel


