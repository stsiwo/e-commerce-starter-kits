import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CategoryType } from 'domain/product/types';
import * as React from 'react';
import { generateCategoryList } from 'tests/data/product';

interface CategoryFilterTabPanelPropsType {
  curCategoryId: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

const CategoryFilterTabPanel: React.FunctionComponent<CategoryFilterTabPanelPropsType> = ({
  curCategoryId
}) => {

  const testCategoryList = generateCategoryList(6);

  const classes = useStyles();

  const handleCategoryInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    return
  }

  const renderCategoryRadioInputs: () => React.ReactNode = () => {
    return testCategoryList.map((category: CategoryType) => {
      return (
        <FormControlLabel value={category.categoryId} control={<Radio />} label={category.categoryName} />
      )
    })
  }

  return (
    <Box p={3}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select Category</FormLabel>
        <RadioGroup aria-label="gender" name="gender1" value={curCategoryId} onChange={handleCategoryInputChangeEvent}>
          {renderCategoryRadioInputs()}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export default CategoryFilterTabPanel

