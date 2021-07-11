import DateFnsUtils from '@date-io/date-fns';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { defaultProductVariantData, defaultProductVariantValidationData, ProductVariantDataType, ProductVariantSizeType, ProductVariantType, ProductVariantValidationDataType, productVariantSizeObj, generateDefaultProductVariantData } from 'domain/product/types';
import { useValidation } from 'hooks/validation';
import { productVariantSchema } from 'hooks/validation/rules';
import * as React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { postProductVariantActionCreator, putProductVariantActionCreator } from 'reducers/slices/domain/product';
import { mSelector } from 'src/selectors/selector';

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

  const dispatch = useDispatch()

  // update/create logic for product
  //  - true: create
  //  - false: update
  // if props.product exists, it updates, otherwise, new
  const [isNew, setNew] = React.useState<boolean>(props.productVariant ? false : true);

  // temp user account state
  const [curProductVariantState, setProductVariantState] = React.useState<ProductVariantDataType>(props.productVariant ? props.productVariant : generateDefaultProductVariantData());

  // validation logic (should move to hooks)
  const [curProductVariantValidationState, setProductVariantValidationState] = React.useState<ProductVariantValidationDataType>(defaultProductVariantValidationData);

  const { updateValidationAt, updateAllValidation, updateValidationAtMultiple, isValidSync } = useValidation({
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
  const productVariantSizeList = Object.values(productVariantSizeObj)

  // event handlers
  const handleProductVariantUnitPriceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantUnitPrice = e.target.value
    // must not be null
    updateValidationAt("variantUnitPrice", nextVariantUnitPrice);
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
    const nextVariantSize = productVariantSizeList.find((size: ProductVariantSizeType) => e.target.value === size.productSizeId)
    // must not be null
    updateValidationAt("productSize", e.target.value);
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
    const nextVariantStock = e.target.value
    // must not be null
    updateValidationAt("variantStock", nextVariantStock);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantStock: parseInt(nextVariantStock)
    }));
  }

  const handleProductVariantWeightInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantWeight = e.target.value
    // must not be null
    updateValidationAt("variantWeight", nextVariantWeight);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantWeight: parseFloat(nextVariantWeight)
    }));
  }

  const handleProductVariantLengthInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantLength = e.target.value
    // must not be null
    updateValidationAt("variantLength", nextVariantLength);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantLength: parseFloat(nextVariantLength)
    }));
  }

  const handleProductVariantWidthInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantWidth = e.target.value
    // must not be null
    updateValidationAt("variantWidth", nextVariantWidth);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantWidth: parseFloat(nextVariantWidth)
    }));
  }

  const handleProductVariantHeightInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantHeight = e.target.value
    // must not be null
    updateValidationAt("variantHeight", nextVariantHeight);
    setProductVariantState((prev: ProductVariantDataType) => ({
      ...prev,
      variantHeight: parseFloat(nextVariantHeight)
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
    const nextProductVariantDiscountPrice = e.target.value
    updateValidationAt("variantDiscountPrice", nextProductVariantDiscountPrice);
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
   * validation for multiple fields together
   **/
  React.useEffect(() => {

    updateValidationAtMultiple([
      {
        key: "variantDiscountStartDate",
        value: curProductVariantState.variantDiscountStartDate
      },
      {
        key: "variantDiscountEndDate",
        value: curProductVariantState.variantDiscountEndDate
      },
    ])
  }, [
    curProductVariantState.variantDiscountStartDate,
    curProductVariantState.variantDiscountEndDate
  ])

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
              // if user check 'same of product unit price', don't send variant unit price. instead send null.
              variantUnitPrice: curUnitPriceDisable ? null : curProductVariantState.variantUnitPrice, 
              // if isDiscount = false, don't send variant discount price.
              variantDiscountPrice: curProductVariantState.isDiscount ? curProductVariantState.variantDiscountPrice : null, 
              productId: targetProductId,
            })
          )

        } else {
          console.log("new product creation")
          // request
          dispatch(
            putProductVariantActionCreator({
              ...curProductVariantState,
              // if user check 'same of product unit price', don't send variant unit price. instead send null.
              variantUnitPrice: curUnitPriceDisable ? null : curProductVariantState.variantUnitPrice, 
              // if isDiscount = false, don't send variant discount price.
              variantDiscountPrice: curProductVariantState.isDiscount ? curProductVariantState.variantDiscountPrice : null, 
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
        {productVariantSizeList.map((size: ProductVariantSizeType) => (
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
          helperText={curProductVariantValidationState.variantDiscountStartDate}
          error={curProductVariantValidationState.variantDiscountStartDate !== ""}
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
          helperText={curProductVariantValidationState.variantDiscountEndDate}
          error={curProductVariantValidationState.variantDiscountEndDate !== ""}
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
