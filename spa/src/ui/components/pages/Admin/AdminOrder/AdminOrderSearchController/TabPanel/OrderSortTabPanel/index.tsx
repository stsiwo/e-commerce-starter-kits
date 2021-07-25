import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { OrderSortEnum } from "domain/order/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderQuerySortActions } from "reducers/slices/domain/order";
import { mSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

//interface SortTabPanelPropsType {
//
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {},
  })
);

const orderSortList = [
  {
    value: OrderSortEnum.DATE_DESC,
    label: "Recent",
  },
  {
    value: OrderSortEnum.DATE_ASC,
    label: "Old",
  },
];

const OrderSortTabPanel: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const curSort = useSelector(mSelector.makeOrderQuerySortSelector());

  const handleOrderSortInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    dispatch(
      orderQuerySortActions.update(e.currentTarget.value as OrderSortEnum)
    );
  };

  const renderOrderSortRadioInputs: () => React.ReactNode = () => {
    log("renderOrderSortRadioInputs updated");
    return orderSortList.map((sort) => {
      return (
        <FormControlLabel
          value={sort.value.toString()}
          control={<Radio />}
          label={sort.label}
          key={sort.value}
        />
      );
    });
  };

  return (
    <Box p={3}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select Sort</FormLabel>
        <RadioGroup
          aria-label="order-sort"
          name="order-sort"
          value={curSort}
          onChange={handleOrderSortInputChangeEvent}
        >
          {renderOrderSortRadioInputs()}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default OrderSortTabPanel;
