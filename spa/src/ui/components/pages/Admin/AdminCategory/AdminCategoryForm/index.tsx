import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {
  CategoryDataType,
  CategoryType,
  CategoryValidationDataType,
  defaultCategoryValidationData,
  generateDefaultCategoryData,
} from "domain/product/types";
import { useValidation } from "hooks/validation";
import { categorySchema } from "hooks/validation/rules";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postCategoryActionCreator,
  putCategoryActionCreator,
} from "reducers/slices/domain/category";
import { mSelector } from "src/selectors/selector";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

interface AdminCategoryFormPropsType {
  category: CategoryType;
  ref: React.MutableRefObject<any>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      margin: theme.spacing(1),
    },
    subtitle: {
      margin: theme.spacing(1, 0),
      fontWeight: theme.typography.fontWeightBold,
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
    productDateInput: {},
    actionBox: {},
  })
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
const AdminCategoryForm = React.forwardRef<any, AdminCategoryFormPropsType>(
  (props, ref) => {
    // mui: makeStyles
    const classes = useStyles();

    // auth
    const auth = useSelector(mSelector.makeAuthSelector());

    const dispatch = useDispatch();

    // temp user account state
    const [curCategoryState, setCategoryState] =
      React.useState<CategoryDataType>(
        props.category ? props.category : generateDefaultCategoryData()
      );

    // update/create logic for product
    //  - true: create
    //  - false: update
    // if props.product exists, it updates, otherwise, new
    const [isNew, setNew] = React.useState<boolean>(
      props.category ? false : true
    );

    // validation logic (should move to hooks)
    const [curCategoryValidationState, setCategoryValidationState] =
      React.useState<CategoryValidationDataType>(defaultCategoryValidationData);

    const { updateValidationAt, updateAllValidation, isValidSync } =
      useValidation({
        curDomain: curCategoryState,
        curValidationDomain: curCategoryValidationState,
        schema: categorySchema,
        setValidationDomain: setCategoryValidationState,
        defaultValidationDomain: defaultCategoryValidationData,
      });

    // event handlers
    const handleCategoryNameInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextCategoryName = e.currentTarget.value;
      updateValidationAt("categoryName", e.currentTarget.value);
      setCategoryState((prev: CategoryDataType) => ({
        ...prev,
        categoryName: nextCategoryName,
      }));
    };

    const handleCategoryDescriptionInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextCategoryDescription = e.currentTarget.value;
      updateValidationAt("categoryDescription", e.currentTarget.value);
      setCategoryState((prev: CategoryDataType) => ({
        ...prev,
        categoryDescription: nextCategoryDescription,
      }));
    };

    const handleCategoryPathInputChangeEvent: React.EventHandler<
      React.ChangeEvent<HTMLInputElement>
    > = (e) => {
      const nextCategoryPath = e.currentTarget.value;
      updateValidationAt("categoryPath", e.currentTarget.value);
      setCategoryState((prev: CategoryDataType) => ({
        ...prev,
        categoryPath: nextCategoryPath,
      }));
    };

    /**
     * call child function from parent
     *
     * ref: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
     *
     **/
    React.useImperativeHandle(ref, () => ({
      // event handler to submit
      handleSaveClickEvent: (e: React.MouseEvent<HTMLButtonElement>) => {
        const isValid: boolean = isValidSync(curCategoryState);

        log(isValid);

        if (isValid) {
          // pass
          log("passed");
          if (isNew) {
            log("new category creation");
            // request
            dispatch(postCategoryActionCreator(curCategoryState));
          } else {
            log("update category");
            // request
            dispatch(putCategoryActionCreator(curCategoryState));
          }
        } else {
          log("failed");
          updateAllValidation();
        }
      },
    }));

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
          // want to disable auto-capitalization
          type="email"
          className={`${classes.txtFieldBase}`}
          value={curCategoryState.categoryPath}
          onChange={handleCategoryPathInputChangeEvent}
          helperText={curCategoryValidationState.categoryPath}
          error={curCategoryValidationState.categoryPath !== ""}
        />
      </form>
    );
  }
);

export default AdminCategoryForm;
