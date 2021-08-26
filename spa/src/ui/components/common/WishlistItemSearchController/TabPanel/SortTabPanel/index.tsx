import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { wishlistItemQuerySortActions } from "reducers/slices/domain/wishlistItem";
import { mSelector } from "src/selectors/selector";
import { WishlistItemSortEnum } from "domain/wishlist/types";
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

const wishlistItemSortList = [
  {
    value: WishlistItemSortEnum.DATE_DESC,
    label: "Recent",
  },
  {
    value: WishlistItemSortEnum.DATE_ASC,
    label: "Old",
  },
  {
    value: WishlistItemSortEnum.ALPHABETIC_ASC,
    label: "Alphabetical Asc",
  },
  {
    value: WishlistItemSortEnum.ALPHABETIC_DESC,
    label: "Alphabetical Desc",
  },
  {
    value: WishlistItemSortEnum.PRICE_ASC,
    label: "Cheap",
  },
  {
    value: WishlistItemSortEnum.PRICE_DESC,
    label: "Expensive",
  },
];

const SortTabPanel: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const curSort = useSelector(mSelector.makeWishlistItemQuerySortSelector());

  const handleWishlistItemSortInputChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    dispatch(
      wishlistItemQuerySortActions.update(
        e.currentTarget.value as WishlistItemSortEnum
      )
    );
  };

  const renderWishlistItemSortRadioInputs: () => React.ReactNode = () => {
    log("renderWishlistItemSortRadioInputs updated");
    return wishlistItemSortList.map((sort) => {
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
          aria-label="wishlistItem-sort"
          name="wishlistItem-sort"
          value={curSort}
          onChange={handleWishlistItemSortInputChangeEvent}
        >
          {renderWishlistItemSortRadioInputs()}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default SortTabPanel;
