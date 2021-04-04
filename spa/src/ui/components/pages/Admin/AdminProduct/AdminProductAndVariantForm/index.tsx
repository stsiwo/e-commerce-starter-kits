import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { CategoryType, defaultProductData, defaultProductValidationData, ProductDataType, ProductValidationDataType, ProductVariantSizeType } from 'domain/product/types';
import { useValidation } from 'hooks/validation';
import { productSchema } from 'hooks/validation/rules';
import * as React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { generateCategoryList, testProductVariantSizeObj } from 'tests/data/product';

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
const AdminProductAndVariantForm: React.FunctionComponent<{}> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // temp user account state
  const [curProductState, setProductState] = React.useState<ProductDataType>(defaultProductData);

  // validation logic (should move to hooks)
  const [curProductValidationState, setProductValidationState] = React.useState<ProductValidationDataType>(defaultProductValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curProductState,
    curValidationDomain: curProductValidationState,
    schema: productSchema,
    setValidationDomain: setProductValidationState
  })

  // test category list
  // #TODO: replace with real one when you are ready
  const testCategoryList = generateCategoryList(10)

  // test product variant size list
  // #TODO: replace with real one when you are ready
  const testProductVariantSizeList = Object.values(testProductVariantSizeObj)

  // event handlers
  const handleProductNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductName = e.currentTarget.value
    updateValidationAt("productName", e.currentTarget.value);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productName: nextProductName
    }));
  }

  const handleProductDescriptionInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductDescription = e.currentTarget.value
    updateValidationAt("productDescription", e.currentTarget.value);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productDescription: nextProductDescription
    }));
  }

  const handleProductPathInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductPath = e.currentTarget.value
    updateValidationAt("productPath", e.currentTarget.value);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productPath: nextProductPath
    }));
  }

  const handleProductCategoryInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextCategory = testCategoryList.find((category: CategoryType) => e.currentTarget.value === category.categoryId)
    // must not be null
    updateValidationAt("category", e.currentTarget.value);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      category: nextCategory
    }));
  }

  const handleProductBaseUnitPriceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductBaseUnitPrice = e.currentTarget.value
    console.log("product base unit price")
    updateValidationAt("productBaseUnitPrice", e.currentTarget.value);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productBaseUnitPrice: parseFloat(nextProductBaseUnitPrice)
    }));
  }

  const handleProductBaseDiscountChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductBaseDiscount: boolean = e.currentTarget.checked
    updateValidationAt("isDiscount", e.currentTarget.value);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      isDiscount: nextProductBaseDiscount,
    }));
  }

  const handleProductBaseDiscountPriceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductBaseDiscountPrice = e.currentTarget.value
    updateValidationAt("productBaseDiscountPrice", e.currentTarget.value);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productBaseDiscountPrice: parseFloat(nextProductBaseDiscountPrice)
    }));
  }

  const handleProductBaseDiscountStartDateChange = (date: Date | null) => {
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productBaseDiscountStartDate: date
    }));
  };

  const handleProductBaseDiscountEndDateChange = (date: Date | null) => {
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productBaseDiscountEndDate: date
    }));
  };

  const handleProductVariantSizeInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextVariantSize = testProductVariantSizeList.find((size: ProductVariantSizeType) => e.currentTarget.value === size.productSizeId)
    // must not be null
    updateValidationAt("productVariants[].variantSize", e.currentTarget.value);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productVariants: [
        {
          ...prev.productVariants[0],
          variantSize: nextVariantSize
        },
      ]
    }));
  }

  const handleProductVariantColorInputChangeEvent: (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => void = (color, event) => {
    updateValidationAt("productVariants[].variantColor", color.hex);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productVariants: [
        {
          ...prev.productVariants[0],
          variantColor: color.hex,
        },
      ]
    }));
  }

  const handleProductVariantDiscountChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductVariantDiscount: boolean = e.currentTarget.checked
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productVariants: [
        {
          ...prev.productVariants[0],
          isDiscount: nextProductVariantDiscount,
        },
      ]
    }));
  }

  const handleProductVariantDiscountPriceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductVariantDiscountPrice = e.currentTarget.value
    //updateValidationAt("productBaseDiscountPrice", e.currentTarget.value);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productVariants: [
        {
          ...prev.productVariants[0],
          variantDiscountPrice: parseFloat(nextProductVariantDiscountPrice),
        },
      ]
    }));
  }

  const handleProductVariantDiscountStartDateChange = (date: Date | null) => {
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productVariants: [
        {
          ...prev.productVariants[0],
          variantDiscountStartDate: date,
        },
      ]
    }));
  };

  const handleProductVariantDiscountEndDateChange = (date: Date | null) => {
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productVariants: [
        {
          ...prev.productVariants[0],
          variantDiscountEndDate: date,
        },
      ]
    }));
  };


//  const handleProductVariantColorInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>, color?: ColorResult) => {
//    const nextProductVariantColor = color.hex
//    //updateValidationAt("productBaseDiscountPrice", nextProductVariantColor);
//    setProductState((prev: ProductDataType) => ({
//      ...prev,
//      productVariants:[ 
//        {
//          ...prev.productVariants[0],
//          variantColor: nextProductVariantColor,
//        },
//      ],
//    }));
//  }

  // event handler to submit
  const handleProductSaveClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {

    const isValid: boolean = isValidSync(curProductState)

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
        id="product-name"
        label="Product Name"
        className={`${classes.txtFieldBase} ${classes.productNameInput}`}
        value={curProductState.productName}
        onChange={handleProductNameInputChangeEvent}
        helperText={curProductValidationState.productName}
        error={curProductValidationState.productName !== ""}
      />
      <TextField
        id="product-description"
        label="Product Description"
        multiline
        rows={2}
        className={`${classes.txtFieldBase}`}
        value={curProductState.productDescription}
        onChange={handleProductDescriptionInputChangeEvent}
        helperText={curProductValidationState.productDescription}
        error={curProductValidationState.productDescription !== ""}
      />
      <TextField
        id="product-path"
        label="Product Path"
        className={`${classes.txtFieldBase} ${classes.productNameInput}`}
        value={curProductState.productPath}
        onChange={handleProductPathInputChangeEvent}
        helperText={curProductValidationState.productPath}
        error={curProductValidationState.productPath !== ""}
      />
      <TextField
        id="product-category"
        label="Category"
        className={`${classes.txtFieldBase} ${classes.productNameInput}`}
        select
        value={curProductState.category ? curProductState.category.categoryId : "1"}
        onChange={handleProductCategoryInputChangeEvent}
        helperText={curProductValidationState.category}
        error={curProductValidationState.category !== ""}
      >
        {testCategoryList.map((category: CategoryType) => (
          <MenuItem key={category.categoryId} value={category.categoryId}>
            {category.categoryName}
          </MenuItem>
        ))}
      </TextField>
      <Typography variant="subtitle1" component="h6" align="left" className={classes.subtitle}>
        Base
      </Typography>
      <Typography variant="body2" component="p" color="textSecondary" align="left" className={classes.subtitle}>
        the base inforamtion takes over any variant informatiion if you don't specify these information on each variant.
      </Typography>
      <TextField
        id="product-base-unit-price"
        label="Product Base Unit Price"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productPriceInput}`}
        value={curProductState.productBaseUnitPrice}
        onChange={handleProductBaseUnitPriceInputChangeEvent}
        helperText={curProductValidationState.productBaseUnitPrice}
        error={curProductValidationState.productBaseUnitPrice !== ""}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      /><br />
      <FormControlLabel
        control={
          <Checkbox
            checked={curProductState.isDiscount}
            onChange={handleProductBaseDiscountChangeEvent}
            name="checkedB"
            color="primary"
          />
        }
        label="Discount?"
      /><br />
      <TextField
        id="product-base-discount-price"
        label="Product Base Discount Price"
        type="number"
        className={`${classes.txtFieldBase} ${classes.productPriceInput}`}
        value={curProductState.productBaseDiscountPrice}
        onChange={handleProductBaseDiscountPriceInputChangeEvent}
        helperText={curProductValidationState.productBaseDiscountPrice}
        error={curProductValidationState.productBaseDiscountPrice !== ""}
        disabled={!curProductState.isDiscount}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      /><br />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          id="product-base-discount-start-date"
          label="Base Discount Start Date"
          format="MM/dd/yyyy"
          value={curProductState.productBaseDiscountStartDate}
          onChange={handleProductBaseDiscountStartDateChange}
          disabled={!curProductState.isDiscount}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.productDateInput}
        />
        <KeyboardDatePicker
          margin="normal"
          id="product-base-discount-end-date"
          label="Base Discount End Date"
          format="MM/dd/yyyy"
          disabled={!curProductState.isDiscount}
          value={curProductState.productBaseDiscountEndDate}
          onChange={handleProductBaseDiscountEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.productDateInput}
        />
      </MuiPickersUtilsProvider>
      <Typography variant="subtitle1" component="h6" align="left" className={classes.subtitle}>
        Variant
      </Typography>
      <Typography variant="body2" component="p" color="textSecondary" align="left" className={classes.subtitle}>
        any information only applies to this variant. for example, you can make this varaint discount (but not the other variant) by checking 'Variant Discount'.  you can add as many variants as you want after creating one. 
      </Typography>
      <FormLabel>
        {"Variant Color"}
      </FormLabel>
      <ChromePicker
        color={curProductState.productVariants[0].variantColor}
        onChangeComplete={handleProductVariantColorInputChangeEvent}
      />
      <TextField
        id="product-variant-size"
        label="Variant Size"
        className={`${classes.txtFieldBase} ${classes.productSizeInput}`}
        select
        value={curProductState.productVariants[0].variantSize ? curProductState.productVariants[0].variantSize.productSizeId : "1"}
        onChange={handleProductVariantSizeInputChangeEvent}
        helperText={curProductValidationState.productVariants[0].variantSize}
        error={curProductValidationState.productVariants[0].variantSize !== ""}
      >
        {testProductVariantSizeList.map((size: ProductVariantSizeType) => (
          <MenuItem key={size.productSizeId} value={size.productSizeId}>
            {size.productSizeName}
          </MenuItem>
        ))}
      </TextField><br />
      <FormControlLabel
        control={
          <Checkbox
            checked={curProductState.productVariants[0].isDiscount}
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
        value={curProductState.productVariants[0].variantDiscountPrice}
        onChange={handleProductVariantDiscountPriceInputChangeEvent}
        helperText={curProductValidationState.productVariants[0].variantDiscountPrice}
        error={curProductValidationState.productVariants[0].variantDiscountPrice !== ""}
        disabled={!curProductState.productVariants[0].isDiscount}
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
          value={curProductState.productVariants[0].variantDiscountStartDate}
          onChange={handleProductVariantDiscountStartDateChange}
          disabled={!curProductState.productVariants[0].isDiscount}
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
          value={curProductState.productVariants[0].variantDiscountEndDate}
          onChange={handleProductVariantDiscountEndDateChange}
          disabled={!curProductState.productVariants[0].isDiscount}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.productDateInput}
        />
      </MuiPickersUtilsProvider>
    {/**
      <TextField
        id="product-variant-color"
        label="Product Variant Color"
        className={`${classes.txtFieldBase} ${classes.productPriceInput}`}
        value={curProductState.productVariants[0].variantColor}
        onChange={handleProductVariantColorInputChangeEvent}
        helperText={curProductValidationState.productBaseDiscountPrice}
        error={curProductValidationState.productBaseDiscountPrice !== ""}
        disabled={!curProductState.isDiscount}
        InputProps={{
          inputComponent: ColorPickerInput as any
        }}
      /><br />
      **/}
      <Box component="div" className={classes.actionBox}>
        <Button onClick={handleProductSaveClickEvent}>
          Save
        </Button>
      </Box>
    </form>
  )
}

export default AdminProductAndVariantForm




