import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  productQueryMaxPriceActions,
  productQueryMinPriceActions,
} from "reducers/slices/domain/product";
import { mSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(__filename);

//interface PriceFilterTabPanelPropsType {
//  curMinPrice: number
//  curMaxPrice: number
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {},
    margin: {
      margin: theme.spacing(1),
    },
    contentBox: {
      display: "flex",
      alignItems: "center",
    },
  })
);

const marks = [
  {
    value: 0,
    label: "$0",
  },
  {
    value: 10,
    label: "$10",
  },
  {
    value: 20,
    label: "$20",
  },
  {
    value: 50,
    label: "$50",
  },
  {
    value: 100,
    label: "$100",
  },
  {
    value: 200,
    label: "$200",
  },
  {
    value: 300,
    label: "$300",
  },
  {
    value: 1000,
    label: "$1,000",
  },
];

/**
 * price filter component
 *
 * logic:
 *  a product has different price based on the its variants.
 *  for example, a product (called A) has three variants (called A_1, A_2, and A_3). each variant has a different price. it might be the same price as the product.
 *  it might be a different price than the product.
 *
 *  each product has properties called (highest price and cheapest price). the highest price is a highest price of the product including its variant prices.
 *
 *  for example:
 *    product A:
 *      base unit price: 300
 *    variant A_1:
 *      unit price: 200
 *    variant A_2:
 *      unit price: 250
 *    varinat A_3:
 *      unit price: 150
 *
 *    => highest price: 250
 *    => cheapest price: 150
 *
 *  filtering
 *    min price <
 *
 * @param param0
 * @returns
 */

const PriceFilterTabPanel: React.FunctionComponent<{}> = ({}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const curMinPrice = useSelector(mSelector.makeProductQueryMinPriceSelector());
  const curMaxPrice = useSelector(mSelector.makeProductQueryMaxPriceSelector());

  const [curPrices, setPrices] = React.useState<number[]>([
    curMinPrice,
    curMaxPrice,
  ]);

  const handleMinChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextPrice = parseInt(e.currentTarget.value);
    dispatch(productQueryMinPriceActions.update(nextPrice));
  };

  const handleMaxChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextPrice = parseInt(e.currentTarget.value);
    dispatch(productQueryMaxPriceActions.update(nextPrice));
  };

  function valuetext(value: number) {
    return `$${value}`;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    newValue: number[]
  ) => {
    let nextMinPrice;
    let nextMaxPrice;

    /**
     * if min value exceed the max value, switch it, and vice versa.
     **/

    if (newValue[0] <= newValue[1]) {
      nextMinPrice = newValue[0];
      nextMaxPrice = newValue[1];
    } else {
      nextMinPrice = newValue[1];
      nextMaxPrice = newValue[0];
    }

    log("next min price: " + nextMinPrice);
    log("next max price: " + nextMaxPrice);

    dispatch(productQueryMinPriceActions.update(nextMinPrice));
    dispatch(productQueryMaxPriceActions.update(nextMaxPrice));

    setPrices([nextMinPrice, nextMaxPrice]);
  };

  const handleReset: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (
    e
  ) => {
    dispatch(productQueryMinPriceActions.clear());
    dispatch(productQueryMaxPriceActions.clear());
  };
  return (
    <Box p={3}>
      <Typography id="range-slider" gutterBottom>
        Price Range
      </Typography>
      <Slider
        step={10}
        value={curPrices}
        onChange={handleChange}
        marks={marks}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
      <Button onClick={handleReset} variant="contained">
        Reset
      </Button>
    </Box>
  );
};

export default PriceFilterTabPanel;
