import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { OrderStatusEnum, orderStatusLabelList } from "domain/order/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderQueryOrderStatusActions } from "reducers/slices/domain/order";
import { mSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(__filename);

//interface OrderStatusFilterTabPanelPropsType {
//  curOrderStatusId: string
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {},
  })
);

const OrderStatusFilterTabPanel: React.FunctionComponent<{}> = ({}) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  // categories option
  const curOrderStatusList = Object.values(OrderStatusEnum);

  // cur query orderstatus id
  const curOrderStatus = useSelector(
    mSelector.makeOrderQueryOrderStatusSelector()
  );

  // event handler change
  const handleOrderStatusInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    dispatch(orderQueryOrderStatusActions.update(e.currentTarget.value));
  };

  const renderOrderStatusRadioInputs: () => React.ReactNode = () => {
    return curOrderStatusList.map((orderStatus: OrderStatusEnum) => {
      return (
        <FormControlLabel
          value={orderStatus}
          control={<Radio />}
          label={orderStatusLabelList[orderStatus]}
          key={orderStatus}
        />
      );
    });
  };

  log("cur orderStatus id (query string)");
  log(curOrderStatus);

  /**
   *
   * bug?: https://stackoverflow.com/questions/58952742/how-can-i-control-a-radiogroup-from-material-ui
   *
   *  - 'value' should not be null/undefined at RadioGroup otherwise, it won't check even if you clicked.
   *
   * solution: data type inconsistency
   *
   *  when adding 'toString()' to 'value', it solved this problem.
   *
   *  - https://github.com/mui-org/material-ui/issues/16272
   *
   **/
  return (
    <Box p={3}>
      <RadioGroup
        aria-label="product-orderStatus"
        name="product-orderStatus-filter-radio"
        value={curOrderStatus}
        onChange={handleOrderStatusInputChangeEvent}
      >
        <FormControlLabel
          value={null}
          control={<Radio />}
          label={"All"}
          key={null}
        />
        {renderOrderStatusRadioInputs()}
      </RadioGroup>
    </Box>
  );
};

export default OrderStatusFilterTabPanel;
