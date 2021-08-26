import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CategoryType } from "domain/product/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryWithCacheActionCreator } from "reducers/slices/domain/category";
import { productQueryCategoryIdActions } from "reducers/slices/domain/product";
import { mSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(__filename);

//interface CategoryFilterTabPanelPropsType {
//  curCategoryId: string
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {},
  })
);

const CategoryFilterTabPanel: React.FunctionComponent<{}> = ({}) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  // categories option
  const curCategoryList = useSelector(mSelector.makeCategorySelector());

  // cur query category id
  const curCategoryId = useSelector(
    mSelector.makeProductQueryCategoryIdSelector()
  );

  // fetch categories if not fetched before
  React.useEffect(() => {
    dispatch(fetchCategoryWithCacheActionCreator());
  }, []);

  // event handler change
  const handleCategoryInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    dispatch(productQueryCategoryIdActions.update(e.currentTarget.value));
  };

  const renderCategoryRadioInputs: () => React.ReactNode = () => {
    return curCategoryList.map((category: CategoryType) => {
      return (
        <FormControlLabel
          value={category.categoryId.toString()}
          control={<Radio />}
          label={category.categoryName}
          key={category.categoryId}
        />
      );
    });
  };

  log("cur category id (query string)");
  log(curCategoryId);

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
        aria-label="product-category"
        name="product-category-filter-radio"
        value={curCategoryId.toString()}
        onChange={handleCategoryInputChangeEvent}
      >
        <FormControlLabel
          value={"0"}
          control={<Radio />}
          label={"All"}
          key={"0"}
        />
        {renderCategoryRadioInputs()}
      </RadioGroup>
    </Box>
  );
};

export default CategoryFilterTabPanel;
