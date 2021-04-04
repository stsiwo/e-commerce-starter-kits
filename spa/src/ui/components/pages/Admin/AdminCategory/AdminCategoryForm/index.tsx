import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { CategoryDataType, CategoryValidationDataType, defaultCategoryData, defaultCategoryValidationData } from 'domain/product/types';
import { useValidation } from 'hooks/validation';
import { categorySchema } from 'hooks/validation/rules';
import * as React from 'react';
import { generateCategoryList } from 'tests/data/product';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      margin: theme.spacing(1),
    },
    subtitle: {
      margin: theme.spacing(1, 0),
      fontWeight: theme.typography.fontWeightBold
    },
    txtFieldBase: {
      width: "80%",
      margin: theme.spacing(1, 0, 1, 0),
    },
    nameInput: {
      minWidth: 300,
      maxWidth: 600,
    },
    descriptionInput: {
    },
    pathInput: {
      maxWidth: 600,
      minWidth: 300,
    },
    productDateInput: {
    },
    actionBox: {
    },
  }),
);

/**
 * member or admin account management component
 *
 * process:
 *
 *    - 1. request to grab information about this user
 *
 *    - 2. display the info to this component
 *
 *    - 3. the user modify the input
 *
 *    - 4. every time the user modify the input, validate each of them
 *
 *    - 5. the user click the save button
 *
 *    - 6. display result popup message
 **/
const AdminCategoryForm: React.FunctionComponent<{}> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // temp user account state
  const [curCategoryState, setCategoryState] = React.useState<CategoryDataType>(defaultCategoryData);

  // validation logic (should move to hooks)
  const [curCategoryValidationState, setCategoryValidationState] = React.useState<CategoryValidationDataType>(defaultCategoryValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curCategoryState,
    curValidationDomain: curCategoryValidationState,
    schema: categorySchema,
    setValidationDomain: setCategoryValidationState
  })

  // test category list
  // #TODO: replace with real one when you are ready
  const testCategoryList = generateCategoryList(10)

  // event handlers
  const handleCategoryNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCategoryName = e.currentTarget.value
    updateValidationAt("categoryName", e.currentTarget.value);
    setCategoryState((prev: CategoryDataType) => ({
      ...prev,
      categoryName: nextCategoryName
    }));
  }

  const handleCategoryDescriptionInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCategoryDescription = e.currentTarget.value
    updateValidationAt("categoryDescription", e.currentTarget.value);
    setCategoryState((prev: CategoryDataType) => ({
      ...prev,
      categoryDescription: nextCategoryDescription
    }));
  }

  const handleCategoryPathInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCategoryPath = e.currentTarget.value
    updateValidationAt("categoryPath", e.currentTarget.value);
    setCategoryState((prev: CategoryDataType) => ({
      ...prev,
      categoryPath: nextCategoryPath
    }));
  }



  // event handler to submit
  const handleProductSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curCategoryState)

    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")
    } else {
      console.log("failed")
      updateAllValidation()
    }
  }

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <TextField
        id="category-name"
        label="Category Name"
        className={`${classes.txtFieldBase}`}
        value={curCategoryState.categoryName}
        onChange={handleCategoryNameInputChangeEvent}
        helperText={curCategoryValidationState.categoryName}
        error={curCategoryValidationState.categoryName !== ""}
      />
      <TextField
        id="category-description"
        label="Category Description"
        multiline
        rows={4}
        className={`${classes.txtFieldBase} ${classes.descriptionInput}`}
        value={curCategoryState.categoryDescription}
        onChange={handleCategoryDescriptionInputChangeEvent}
        helperText={curCategoryValidationState.categoryDescription}
        error={curCategoryValidationState.categoryDescription !== ""}
      />
      <TextField
        id="category-path"
        label="Category Path"
        className={`${classes.txtFieldBase}`}
        value={curCategoryState.categoryPath}
        onChange={handleCategoryPathInputChangeEvent}
        helperText={curCategoryValidationState.categoryPath}
        error={curCategoryValidationState.categoryPath !== ""}
      />
      <Box component="div" className={classes.actionBox}>
        <Button onClick={handleProductSaveClickEvent}>
          Save
        </Button>
      </Box>
    </form>
  )
}

export default AdminCategoryForm




