import DateFnsUtils from '@date-io/date-fns';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { defaultProductVariantData, defaultProductVariantValidationData, ProductVariantDataType, ProductVariantSizeType, ProductVariantType, ProductVariantValidationDataType } from 'domain/product/types';
import { useValidation } from 'hooks/validation';
import { productVariantSchema } from 'hooks/validation/rules';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { productActions, postProductVariantActionCreator, putProductVariantActionCreator } from 'reducers/slices/domain/product';
import { mSelector } from 'src/selectors/selector';
import { testProductVariantSizeObj } from 'tests/data/product';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

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
    noteMsg: {
      color: theme.palette.secondary.main,
      fontSize: theme.typography.caption.fontSize,
    },
    smallCheckBox: {
      verticalAlign: "bottom",
      marginLeft: 0,
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
      marginRight: theme.spacing(3),
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
const AdminProductVariantForm = React.forwardRef<any, AdminProductVariantFormPropsType>((props, ref) => {

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
  const [isNew, setNew] = React.useState<boolean>(props.productVariant ? false : true);

  // temp user account state
  const [curProductVariantState, setProductVariantState] = React.useState<ProductVariantDataType>(props.productVariant ? props.productVariant : defaultProductVariantData);

  // validation logic (should move to hooks)
  const [curProductVariantValidationState, setProductVariantValidationState] = React.useState<ProductVariantValidationDataType>(defaultProductVariantValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curProductVariantState,
    curValidationDomain: curProductVariantValidationState,
    schema: productVariantSchema,
    setValidationDomain: setProductVariantValidationState,
    defaultValidationDomain: defaultProductVariantValidationData,
  })

  // unit price disable stuff
  const [curUnitPriceDisable, setUnitPriceDisable] = React.useState<boolean>(false);

  const handleUnitPriceDisable: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductVariantUnitPriceDisable: boolean = e.currentTarget.checked
    setUnitPriceDisable(nextProductVariantUnitPriceDisable)
    if (nextProductVariantUnitPriceDisable) {
      setProductVariantState((prev: ProductVariantDataType) => ({
        ...prev,
        variantUnitPrice: null,
      }))
    } else {
      setProductVariantState((prev: ProductVariantDataType) => ({
        ...prev,
        variantUnitPrice: 1,
      }))
    }
  }

  // test product variant size list
  // #TODO: replace with real one when you are ready
  const testProductVariantSizeList = Object.values(testProductVariantSizeObj)

  // event handlers
  const handleProductVariantUnitPriceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantUnitPrice = e.currentTarget.value
    // must not be null
    updateValidationAt("variantUnitPrice", e.currentTarget.value);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantUnitPrice: parseInt(nextVariantUnitPrice)
    }));
  }

  // event handlers
  const handleProductVariantSizeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    /**
     * DON'T user 'e.currentTarget' for select
     **/
    const nextVariantSize = testProductVariantSizeList.find((size: ProductVariantSizeType) => e.target.value === size.productSizeId)
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

  const handleProductVariantWeightInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantWeight = e.currentTarget.value
    // must not be null
    updateValidationAt("variantWeight", e.currentTarget.value);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantWeight: parseInt(nextVariantWeight)
    }));
  }

  const handleProductVariantLengthInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantLength = e.currentTarget.value
    // must not be null
    updateValidationAt("variantLength", e.currentTarget.value);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantLength: parseInt(nextVariantLength)
    }));
  }

  const handleProductVariantWidthInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantWidth = e.currentTarget.value
    // must not be null
    updateValidationAt("variantWidth", e.currentTarget.value);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantWidth: parseInt(nextVariantWidth)
    }));
  }

  const handleProductVariantHeightInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantHeight = e.currentTarget.value
    // must not be null
    updateValidationAt("variantHeight", e.currentTarget.value);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantHeight: parseInt(nextVariantHeight)
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

  /**
   * call child function from parent 
   *
   * ref: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
   *
   **/
  React.useImperativeHandle(ref, () => ({

    // event handler to submit
    handleSaveClickEvent: (e: React.MouseEvent<HTMLButtonElement>) => {

      const isValid: boolean = isValidSync(curProductVariantState)

      console.log(isValid);

      if (isValid) {
        // pass 
        console.log("passed")

        if (isNew) {
          console.log("new product creation")
          // request
          dispatch(
            postProductVariantActionCreator({
              ...curProductVariantState,
              productId: targetProductId,
            }) 
          )

        } else {
          console.log("new product creation")
          // request
          dispatch(
            putProductVariantActionCreator({
              ...curProductVariantState,
              productId: targetProductId,
            }) 
          )
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
        id="variant-unit-price"
        label="Unit Price"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productPriceInput}`}
        value={curProductVariantState.variantUnitPrice}
        onChange={handleProductVariantUnitPriceInputChangeEvent}
        helperText={curProductVariantValidationState.variantUnitPrice}
        error={curProductVariantValidationState.variantUnitPrice !== ""}
        disabled={curUnitPriceDisable}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      <FormControlLabel
        className={classes.smallCheckBox}
        control={
          <Checkbox
            checked={curUnitPriceDisable}
            onChange={handleUnitPriceDisable}
            name="checkedB"
            color="primary"
          />
        }
        label={
          <Typography variant="subtitle2" component="span" color="textSecondary">
            {"Same as Product Base?"}
          </Typography>
        }
      /><br />
      <FormLabel>
        {"Variant Color"}
      </FormLabel>
      <ChromePicker
        color={curProductVariantState.variantColor}
        onChangeComplete={handleProductVariantColorInputChangeEvent}
      />
      <TextField
        id="product-variant-size"
        label="Size"
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
        label="Stock"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productSizeInput}`}
        value={curProductVariantState.variantStock}
        onChange={handleProductVariantStockInputChangeEvent}
        helperText={curProductVariantValidationState.variantStock}
        error={curProductVariantValidationState.variantStock !== ""}
      /><br />
      <TextField
        id="product-variant-weight"
        label="Weight"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productSizeInput}`}
        value={curProductVariantState.variantWeight}
        onChange={handleProductVariantWeightInputChangeEvent}
        helperText={curProductVariantValidationState.variantWeight}
        error={curProductVariantValidationState.variantWeight !== ""}
        InputProps={{
          endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
        }}
      />
      <TextField
        id="product-variant-length"
        label="Length"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productSizeInput}`}
        value={curProductVariantState.variantLength}
        onChange={handleProductVariantLengthInputChangeEvent}
        helperText={curProductVariantValidationState.variantLength}
        error={curProductVariantValidationState.variantLength !== ""}
        InputProps={{
          endAdornment: <InputAdornment position="end">Cm</InputAdornment>,
        }}
      />
      <TextField
        id="product-variant-width"
        label="Width"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productSizeInput}`}
        value={curProductVariantState.variantWidth}
        onChange={handleProductVariantWidthInputChangeEvent}
        helperText={curProductVariantValidationState.variantWidth}
        error={curProductVariantValidationState.variantWidth !== ""}
        InputProps={{
          endAdornment: <InputAdornment position="end">Cm</InputAdornment>,
        }}
      />
      <TextField
        id="product-variant-height"
        label="Height"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productSizeInput}`}
        value={curProductVariantState.variantHeight}
        onChange={handleProductVariantHeightInputChangeEvent}
        helperText={curProductVariantValidationState.variantHeight}
        error={curProductVariantValidationState.variantHeight !== ""}
        InputProps={{
          endAdornment: <InputAdornment position="end">Cm</InputAdornment>,
        }}
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
        label="Discount Price"
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
          label="Discount Start Date"
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
          label="Discount End Date"
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
    </form>
  )
})

export default AdminProductVariantForm
