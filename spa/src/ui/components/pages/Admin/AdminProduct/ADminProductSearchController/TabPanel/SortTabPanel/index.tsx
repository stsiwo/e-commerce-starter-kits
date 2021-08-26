import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ProductSortEnum } from "domain/product/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { productQuerySortActions } from "reducers/slices/domain/product";
import { mSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(__filename);

//interface SortTabPanelPropsType {
//
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {},
  })
);

const productSortList = [
  {
    value: ProductSortEnum.DATE_DESC,
    label: "Recent",
  },
  {
    value: ProductSortEnum.DATE_ASC,
    label: "Old",
  },
  {
    value: ProductSortEnum.ALPHABETIC_ASC,
    label: "Alphabetical Asc",
  },
  {
    value: ProductSortEnum.ALPHABETIC_DESC,
    label: "Alphabetical Desc",
  },
  {
    value: ProductSortEnum.PRICE_ASC,
    label: "Cheap",
  },
  {
    value: ProductSortEnum.PRICE_DESC,
    label: "Expensive",
  },
];

const SortTabPanel: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const curSort = useSelector(mSelector.makeProductQuerySortSelector());

  const handleProductSortInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    dispatch(
      productQuerySortActions.update(e.currentTarget.value as ProductSortEnum)
    );
  };

  const renderProductSortRadioInputs: () => React.ReactNode = () => {
    log("renderProductSortRadioInputs updated");
    return productSortList.map((sort) => {
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
          aria-label="product-sort"
          name="product-sort"
          value={curSort}
          onChange={handleProductSortInputChangeEvent}
        >
          {renderProductSortRadioInputs()}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default SortTabPanel;
