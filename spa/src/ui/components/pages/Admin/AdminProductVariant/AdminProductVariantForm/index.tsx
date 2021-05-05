import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { defaultProductVariantData, defaultProductVariantValidationData, ProductVariantDataType, ProductVariantSizeType, ProductVariantValidationDataType, ProductVariantType } from 'domain/product/types';
import { useValidation } from 'hooks/validation';
import { productVariantSchema } from 'hooks/validation/rules';
import * as React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { generateCategoryList, testProductVariantSizeObj } from 'tests/data/product';
import FormLabel from '@material-ui/core/FormLabel';
import { useSelector, useDispatch } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { useSnackbar } from 'notistack';
import { api } from 'configs/axiosConfig';
import { fetchProductActionCreator, productActions } from 'reducers/slices/domain/product';
import { AxiosError } from 'axios';
import { useLocation } from 'react-router';

interface AdminProductVariantFormPropsType {
  productVariant: ProductVariantType
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
    productNameInput: {
      minWidth: 300,
      maxWidth: 600,
    },
    productDescriptionInput: {
      minWidth: 300,
    },
    productPathInput: {
      maxWidth: 600,
      minWidth: 300,
    },
    productPriceInput: {
      maxWidth: 200,
      minWidth: 200,
    },
    productSizeInput: {
      maxWidth: 200,
      minWidth: 200,
    },
    productCategoryInput: {
      maxWidth: 200,
      minWidth: 200,
    },
    productDateInput: {
    },
    actionBox: {
    },
  }),
);

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * admin product variant management component
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
const AdminProductVariantForm: React.FunctionComponent<AdminProductVariantFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // query params
  const query = useQuery();
  const targetProductId = query.get("productId")

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch()

  // update/create logic for product
  //  - true: create
  //  - false: update
  // if props.product exists, it updates, otherwise, new
  const [isNew, setNew] = React.useState<boolean>(props.productVariant ? true : false);

  // temp user account state
  const [curProductVariantState, setProductVariantState] = React.useState<ProductVariantDataType>(props.productVariant ? props.productVariant : defaultProductVariantData);

  // validation logic (should move to hooks)
  const [curProductVariantValidationState, setProductVariantValidationState] = React.useState<ProductVariantValidationDataType>(defaultProductVariantValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curProductVariantState,
    curValidationDomain: curProductVariantValidationState,
    schema: productVariantSchema,
    setValidationDomain: setProductVariantValidationState
  })

  // test product variant size list
  // #TODO: replace with real one when you are ready
  const testProductVariantSizeList = Object.values(testProductVariantSizeObj)

  // event handlers
  const handleProductVariantSizeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantSize = testProductVariantSizeList.find((size: ProductVariantSizeType) => e.currentTarget.value === size.productSizeId)
    // must not be null
    updateValidationAt("productSize", e.currentTarget.value);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      productSize: nextVariantSize
    }));
  }

  const handleProductVariantColorInputChangeEvent: (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => void = (color, event) => {
    updateValidationAt("variantColor", color.hex);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantColor: color.hex,
    }));
  }

  // event handlers
  const handleProductVariantStockInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantStock = e.currentTarget.value 
    // must not be null
    updateValidationAt("variantStock", e.currentTarget.value);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantStock: parseInt(nextVariantStock)
    }));
  }

  const handleProductVariantDiscountChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductVariantDiscount: boolean = e.currentTarget.checked
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      isDiscount: nextProductVariantDiscount,
    }));
  }

  const handleProductVariantDiscountPriceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductVariantDiscountPrice = e.currentTarget.value
    //updateValidationAt("productBaseDiscountPrice", e.currentTarget.value);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantDiscountPrice: parseFloat(nextProductVariantDiscountPrice),
    }));
  }

  const handleProductVariantDiscountStartDateChange = (date: Date | null) => {
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantDiscountStartDate: date,
    }));
  };

  const handleProductVariantDiscountEndDateChange = (date: Date | null) => {
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantDiscountEndDate: date,
    }));
  };


  // event handler to submit
  const handleProductSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curProductVariantState)

    console.log(isValid);

    if (isValid) {
      // pass 
      console.log("passed")

      if (isNew) {
        console.log("new product creation")
        // request
        api.request({
          method: 'POST',
          url: API1_URL + `/products/${targetProductId}/variants`,
          data: JSON.stringify(curProductVariantState),
        }).then((data) => {

          const newVariant = data.data;

          // add this new one to redux store
          dispatch(productActions.appendVariant(newVariant))

          enqueueSnackbar("updated successfully.", { variant: "success" })
        }).catch((error: AxiosError) => {
          enqueueSnackbar(error.message, { variant: "error" })
        })

      } else {
        console.log("new product creation")
        // request
        api.request({
          method: 'PUT',
          url: API1_URL + `/products/${targetProductId}/variants/${curProductVariantState.variantId}`,
          data: JSON.stringify(curProductVariantState),
        }).then((data) => {

          const updatedVariant = data.data;

          // fetch again
          dispatch(productActions.updateVariant(updatedVariant))

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

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <FormLabel>
        {"Variant Color"}
      </FormLabel>
      <ChromePicker
        color={curProductVariantState.variantColor}
        onChangeComplete={handleProductVariantColorInputChangeEvent}
      />
      <TextField
        id="product-variant-size"
        label="Variant Size"
        className={`${classes.txtFieldBase} ${classes.productSizeInput}`}
        select
        value={curProductVariantState.productSize ? curProductVariantState.productSize.productSizeId : "1"}
        onChange={handleProductVariantSizeInputChangeEvent}
        helperText={curProductVariantValidationState.productSize}
        error={curProductVariantValidationState.productSize !== ""}
      >
        {testProductVariantSizeList.map((size: ProductVariantSizeType) => (
          <MenuItem key={size.productSizeId} value={size.productSizeId}>
            {size.productSizeName}
          </MenuItem>
        ))}
      </TextField><br />
      <TextField
        id="product-variant-stock"
        label="Product Variant Stock"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productSizeInput}`}
        value={curProductVariantState.variantStock}
        onChange={handleProductVariantStockInputChangeEvent}
        helperText={curProductVariantValidationState.variantStock}
        error={curProductVariantValidationState.variantStock !== ""}
      /><br />
      <FormControlLabel
        control={
          <Checkbox
            checked={curProductVariantState.isDiscount}
            onChange={handleProductVariantDiscountChangeEvent}
            name="checkedB"
            color="primary"
          />
        }
        label="Variant Discount?"
      /><br />
      <TextField
        id="product-variant-discount-price"
        label="Product Variant Discount Price"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productPriceInput}`}
        value={curProductVariantState.variantDiscountPrice}
        onChange={handleProductVariantDiscountPriceInputChangeEvent}
        helperText={curProductVariantValidationState.variantDiscountPrice}
        error={curProductVariantValidationState.variantDiscountPrice !== ""}
        disabled={!curProductVariantState.isDiscount}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      /><br />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          id="product-variant-discount-start-date"
          label="Variant Discount Start Date"
          format="MM/dd/yyyy"
          value={curProductVariantState.variantDiscountStartDate}
          onChange={handleProductVariantDiscountStartDateChange}
          disabled={!curProductVariantState.isDiscount}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.productDateInput}
        />
        <KeyboardDatePicker
          margin="normal"
          id="product-variant-discount-end-date"
          label="Variant Discount End Date"
          format="MM/dd/yyyy"
          value={curProductVariantState.variantDiscountEndDate}
          onChange={handleProductVariantDiscountEndDateChange}
          disabled={!curProductVariantState.isDiscount}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.productDateInput}
        />
      </MuiPickersUtilsProvider>
      <Box component="div" className={classes.actionBox}>
        <Button onClick={handleProductSaveClickEvent}>
          Save
        </Button>
      </Box>
    </form>
  )
}

export default AdminProductVariantForm
