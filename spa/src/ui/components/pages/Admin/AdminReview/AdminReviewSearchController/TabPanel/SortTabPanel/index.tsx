import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { reviewQuerySortActions } from "reducers/slices/domain/review";
import { mSelector } from "src/selectors/selector";
import { ReviewSortEnum } from "domain/review/type";
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

const reviewSortList = [
  {
    value: ReviewSortEnum.DATE_DESC,
    label: "Recent",
  },
  {
    value: ReviewSortEnum.DATE_ASC,
    label: "Old",
  },
  {
    value: ReviewSortEnum.REVIEW_POINT_ASC,
    label: "Lower Point",
  },
  {
    value: ReviewSortEnum.REVIEW_POINT_DESC,
    label: "Higher Point",
  },
];

const SortTabPanel: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const curSort = useSelector(mSelector.makeReviewQuerySortSelector());

  const handleReviewSortInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    dispatch(
      reviewQuerySortActions.update(e.currentTarget.value as ReviewSortEnum)
    );
  };

  const renderReviewSortRadioInputs: () => React.ReactNode = () => {
    log("renderReviewSortRadioInputs updated");
    return reviewSortList.map((sort) => {
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
          aria-label="review-sort"
          name="review-sort"
          value={curSort}
          onChange={handleReviewSortInputChangeEvent}
        >
          {renderReviewSortRadioInputs()}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default SortTabPanel;
