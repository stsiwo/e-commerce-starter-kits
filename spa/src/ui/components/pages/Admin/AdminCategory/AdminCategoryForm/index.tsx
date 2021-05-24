import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { CategoryDataType, CategoryType, CategoryValidationDataType, defaultCategoryData, defaultCategoryValidationData } from 'domain/product/types';
import { useValidation } from 'hooks/validation';
import { categorySchema } from 'hooks/validation/rules';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryActionCreator } from 'reducers/slices/domain/category';
import { mSelector } from 'src/selectors/selector';

interface AdminCategoryFormPropsType {
  category: CategoryType
  ref: React.MutableRefObject<any>
}

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
      minWidth: 280,
      maxWidth: 600,
    },
    descriptionInput: {
      minWidth: 280,
      width: "100%",
      margin: theme.spacing(1, 0, 1, 0),
    },
    pathInput: {
      maxWidth: 600,
      minWidth: 280,
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
const AdminCategoryForm = React.forwardRef<any, AdminCategoryFormPropsType>((props, ref) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch()

  // temp user account state
  const [curCategoryState, setCategoryState] = React.useState<CategoryDataType>(props.category ? props.category : defaultCategoryData);

  // update/create logic for product
  //  - true: create
  //  - false: update
  // if props.product exists, it updates, otherwise, new
  const [isNew, setNew] = React.useState<boolean>(props.category ? false : true);

  // validation logic (should move to hooks)
  const [curCategoryValidationState, setCategoryValidationState] = React.useState<CategoryValidationDataType>(defaultCategoryValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curCategoryState,
    curValidationDomain: curCategoryValidationState,
    schema: categorySchema,
    setValidationDomain: setCategoryValidationState,
    defaultValidationDomain: defaultCategoryValidationData,
  })

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


  /**
   * call child function from parent 
   *
   * ref: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
   *
   **/
  React.useImperativeHandle(ref, () => ({

    // event handler to submit
    handleSaveClickEvent: (e: React.MouseEvent<HTMLButtonElement>) => {

      const isValid: boolean = isValidSync(curCategoryState)

      console.log(isValid);

      if (isValid) {
        // pass 
        console.log("passed")
        if (isNew) {
          console.log("new category creation")
          // request
          api.request({
            method: 'POST',
            url: API1_URL + `/categories`,
            data: curCategoryState,
          }).then((data) => {

            // fetch again
            dispatch(fetchCategoryActionCreator())

            enqueueSnackbar("updated successfully.", { variant: "success" })
          }).catch((error: AxiosError) => {
            enqueueSnackbar(error.message, { variant: "error" })
          })

        } else {
          console.log("update category")
          // request
          api.request({
            method: 'PUT',
            url: API1_URL + `/categories/${curCategoryState.categoryId}`,
            data: curCategoryState,
          }).then((data) => {

            // fetch again
            dispatch(fetchCategoryActionCreator())

            enqueueSnackbar("updated successfully.", { variant: "success" })
          }).catch((error: AxiosError) => {
            enqueueSnackbar(error.message, { variant: "error" })
          })
        }
      } else {
        console.log("failed")
        updateAllValidation()
      }
    }

  }))

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <TextField
        id="category-name"
        label="Name"
        className={`${classes.txtFieldBase}`}
        value={curCategoryState.categoryName}
        onChange={handleCategoryNameInputChangeEvent}
        helperText={curCategoryValidationState.categoryName}
        error={curCategoryValidationState.categoryName !== ""}
      />
      <TextField
        id="category-description"
        label="Description"
        multiline
        rows={4}
        className={`${classes.descriptionInput}`}
        value={curCategoryState.categoryDescription}
        onChange={handleCategoryDescriptionInputChangeEvent}
        helperText={curCategoryValidationState.categoryDescription}
        error={curCategoryValidationState.categoryDescription !== ""}
      />
      <TextField
        id="category-path"
        label="Path"
        className={`${classes.txtFieldBase}`}
        value={curCategoryState.categoryPath}
        onChange={handleCategoryPathInputChangeEvent}
        helperText={curCategoryValidationState.categoryPath}
        error={curCategoryValidationState.categoryPath !== ""}
      />
    </form>
  )
})

export default AdminCategoryForm
