import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  wishlistItemQueryMaxPriceActions,
  wishlistItemQueryMinPriceActions,
} from "reducers/slices/domain/wishlistItem";
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

const PriceFilterTabPanel: React.FunctionComponent<{}> = ({}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const curMinPrice = useSelector(
    mSelector.makeWishlistItemQueryMinPriceSelector()
  );
  const curMaxPrice = useSelector(
    mSelector.makeWishlistItemQueryMaxPriceSelector()
  );

  const [curPrices, setPrices] = React.useState<number[]>([
    curMinPrice,
    curMaxPrice,
  ]);

  const handleMinChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextPrice = parseInt(e.currentTarget.value);
    dispatch(wishlistItemQueryMinPriceActions.update(nextPrice));
  };

  const handleMaxChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextPrice = parseInt(e.currentTarget.value);
    dispatch(wishlistItemQueryMaxPriceActions.update(nextPrice));
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

    dispatch(wishlistItemQueryMinPriceActions.update(nextMinPrice));
    dispatch(wishlistItemQueryMaxPriceActions.update(nextMaxPrice));

    setPrices([nextMinPrice, nextMaxPrice]);
  };

  const handleReset: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (
    e
  ) => {
    dispatch(wishlistItemQueryMinPriceActions.clear());
    dispatch(wishlistItemQueryMaxPriceActions.clear());
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
