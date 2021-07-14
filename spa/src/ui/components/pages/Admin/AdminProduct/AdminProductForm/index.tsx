import DateFnsUtils from '@date-io/date-fns';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { CategoryType, defaultProductValidationData, generateDefaultProductOnlyData, ProductDataType, ProductType, ProductValidationDataType } from 'domain/product/types';
import { useValidation } from 'hooks/validation';
import { productSchema } from 'hooks/validation/rules';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryActionCreator } from 'reducers/slices/domain/category';
import { postProductActionCreator, putProductActionCreator } from 'reducers/slices/domain/product';
import { FetchStatusEnum } from 'src/app';
import { mSelector, rsSelector } from 'src/selectors/selector';
import { renameFile } from 'src/utils';
import ProductImagesForm from './ProductImagesForm';

interface AdminProductFormPropsType {
  product: ProductType
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
    errorMsg: {
      color: theme.palette.error.main,
      fontSize: theme.typography.subtitle2.fontSize,
    },
    txtFieldBase: {
      width: "80%",
      margin: theme.spacing(1, 0, 1, 0),
    },
    productNameInput: {
      minWidth: 280,
      maxWidth: 600,
    },
    productDescriptionInput: {
      minWidth: 280,
      width: "100%",
      margin: theme.spacing(1, 0, 1, 0),
    },
    productPathInput: {
      maxWidth: 600,
      minWidth: 280,
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
    productNoteInput: {
      minWidth: 280,
      width: "100%",
      margin: theme.spacing(1, 0, 1, 0),
    },
    actionBox: {
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
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
const AdminProductForm = React.forwardRef<any, AdminProductFormPropsType>((props, ref) => {

  // mui: makeStyles
  const classes = useStyles();

  const dispatch = useDispatch()

  /**
   *
   * need to do 'merge({}, defaultProductOnlyData, props.product)' since props.product does not include 'productImageFiles'.
   * 
   **/
  const [curProductState, setProductState] = React.useState<ProductDataType>(props.product ? merge({}, generateDefaultProductOnlyData(), props.product) : generateDefaultProductOnlyData());

  // update/create logic for product
  //  - true: create
  //  - false: update
  // if props.product exists, it updates, otherwise, new
  const [isNew, setNew] = React.useState<boolean>(props.product ? false : true);

  // validation logic (should move to hooks)
  const [curProductValidationState, setProductValidationState] = React.useState<ProductValidationDataType>(defaultProductValidationData);

  const { updateValidationAt, updateAllValidation, isValidSync } = useValidation({
    curDomain: curProductState,
    curValidationDomain: curProductValidationState,
    schema: productSchema,
    setValidationDomain: setProductValidationState,
    defaultValidationDomain: defaultProductValidationData,
  })

  // test category list
  const categoryList = useSelector(mSelector.makeCategorySelector())

  // category if not store in redux store
  React.useEffect(() => {
    dispatch(fetchCategoryActionCreator());
  }, [])

  // set default category after category list is filled
  React.useEffect(() => {

    if (!curProductState.category && categoryList.length > 0) {
      setProductState((prev: ProductDataType) => ({
        ...prev,
        category: categoryList[0],
      }))
    }

  }, [
      categoryList.length
    ])

  // event handlers
  const handleProductNameInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductName = e.currentTarget.value
    updateValidationAt("productName", nextProductName);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productName: nextProductName
    }));
  }

  const handleProductDescriptionInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductDescription = e.currentTarget.value
    updateValidationAt("productDescription", nextProductDescription);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productDescription: nextProductDescription
    }));
  }

  const handleProductPathInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductPath = e.currentTarget.value
    updateValidationAt("productPath", nextProductPath);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productPath: nextProductPath
    }));
  }

  const handleProductCategoryInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {

    // DON'T USE 'e.currentTarget.value' for select input (material-ui)
    const nextCategoryId = e.target.value;

    const nextCategory = categoryList.find((category: CategoryType) => nextCategoryId === category.categoryId)
    // must not be null
    updateValidationAt("category", nextCategory);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      category: nextCategory
    }));
  }

  const handleProductReleaseDateChange = (date: Date | null) => {
    updateValidationAt("releaseDate", date);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      releaseDate: date
    }));
  };

  const handleProductBaseUnitPriceInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductBaseUnitPrice = e.target.value
    console.log("product base unit price")
    updateValidationAt("productBaseUnitPrice", nextProductBaseUnitPrice);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      productBaseUnitPrice: parseFloat(nextProductBaseUnitPrice)
    }));
  }

  const handleProductNoteInputChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductNote = e.currentTarget.value
    updateValidationAt("note", nextProductNote);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      note: nextProductNote
    }));
  }

  const handleProductPublicChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextProductPublic: boolean = e.currentTarget.checked
    updateValidationAt("isPublic", nextProductPublic);
    setProductState((prev: ProductDataType) => ({
      ...prev,
      isPublic: nextProductPublic,
    }));
  }

  // product image state update
  const updateProductImage = (file: File, path: string, index: number) => {

    const nextState = cloneDeep(curProductState)
    const renamedFile = renameFile(file, curProductState.productImages[index].productImageName);
    nextState.productImageFiles[index] = renamedFile
    nextState.productImages[index].productImagePath = path
    nextState.productImages[index].isChange = true


    updateValidationAt("productImages", nextState.productImages);
    setProductState(nextState)
  }

  const removeProductImage = (index: number) => {

    const nextState = cloneDeep(curProductState)
    nextState.productImageFiles[index] = null
    nextState.productImages[index].productImagePath = ""
    nextState.productImages[index].isChange = true

    updateValidationAt("productImages", nextState.productImages);
    setProductState(nextState)
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

      const isValid: boolean = isValidSync(curProductState)

      console.log(isValid);

      /**
       * product images uploading logic.
       *
       * - productImages: an object include image public path to the image.
       *
       *  - this does not used as request body. even if it is included in the request body, it is not processed at backend.
       *
       * - productImageFiles: File[]
       *
       *  - this is used to upload the iamges to the api.
       *
       *  - need validation.
       *
       *  - this is processed at the backend to store the image and generate public path.
       *
       *
       **/

      if (isValid) {

        // pass 
        console.log("passed")
        if (isNew) {
          console.log("new product creation")
          // request
          dispatch(
            postProductActionCreator({
              productName: curProductState.productName,
              productDescription: curProductState.productDescription,
              productPath: curProductState.productPath,
              productBaseUnitPrice: curProductState.productBaseUnitPrice,
              isPublic: curProductState.isPublic,
              category: curProductState.category,
              releaseDate: curProductState.releaseDate,
              note: curProductState.note,
              productImageFiles: curProductState.productImageFiles,
              productImages: curProductState.productImages,
            })
          )

        } else {
          console.log("new product creation")
          // request
          dispatch(
            putProductActionCreator({
              productId: curProductState.productId,
              productName: curProductState.productName,
              productDescription: curProductState.productDescription,
              productPath: curProductState.productPath,
              productBaseUnitPrice: curProductState.productBaseUnitPrice,
              isPublic: curProductState.isPublic,
              category: curProductState.category,
              releaseDate: curProductState.releaseDate,
              note: curProductState.note,
              productImageFiles: curProductState.productImageFiles,
              productImages: curProductState.productImages,
            })
          )

        }
      } else {
        console.log("failed")
        updateAllValidation()
      }
    }
  }));

  // backdrop & spinner to prevent users to click 'save' again
  const curPostFetchStatus = useSelector(rsSelector.app.getPostProductFetchStatus); 
  const curPutFetchStatus = useSelector(rsSelector.app.getPutProductFetchStatus); 
  const [curBackdropOpen, setBackdropOpen] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (curPostFetchStatus === FetchStatusEnum.FETCHING || curPutFetchStatus === FetchStatusEnum.FETCHING) {
      setBackdropOpen(true);
    } else {
      setBackdropOpen(false);
    }
  }, [
    curPostFetchStatus,
    curPutFetchStatus,
  ])

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <TextField
        id="product-name"
        label="Name"
        className={`${classes.txtFieldBase} ${classes.productNameInput}`}
        value={curProductState.productName}
        onChange={handleProductNameInputChangeEvent}
        helperText={curProductValidationState.productName}
        error={curProductValidationState.productName !== ""}
      />
      <TextField
        id="product-description"
        label="Description"
        multiline
        rows={4}
        className={`${classes.productDescriptionInput}`}
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
        {categoryList.map((category: CategoryType) => (
          <MenuItem key={category.categoryId} value={category.categoryId}>
            {category.categoryName}
          </MenuItem>
        ))}
      </TextField>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          id="product-release-date"
          label="Release Date"
          format="MM/dd/yyyy"
          value={curProductState.releaseDate}
          onChange={handleProductReleaseDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change release date',
          }}
          className={classes.productDateInput}
        />
      </MuiPickersUtilsProvider>
      {/** Base **/}
      <Typography variant="subtitle1" component="h6" align="left" className={classes.subtitle}>
        Base
      </Typography>
      <Typography variant="body2" component="p" color="textSecondary" align="left" className={classes.subtitle}>
        the base inforamtion takes over any variant informatiion if you don't specify these information on each variant.
      </Typography>
      <TextField
        id="product-base-unit-price"
        label="Unit Price"
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
      {/** images **/}
      <Typography variant="subtitle1" component="h6" align="left" className={classes.subtitle}>
        Images
      </Typography>
      <Typography variant="body2" component="p" color="textSecondary" align="left" className={classes.subtitle}>
        You can upload up to 5 images and the first image is used as primary one.
      </Typography>
      <Box className={classes.errorMsg}>
        {curProductValidationState.productImages}
      </Box>
      <ProductImagesForm
        productImages={curProductState.productImages}
        productImageFiles={curProductState.productImageFiles}
        onUpdate={updateProductImage}
        onRemove={removeProductImage}
      />
      {/** note **/}
      <TextField
        id="product-note"
        label="Product Note"
        multiline
        rows={8}
        className={`${classes.productNoteInput}`}
        value={curProductState.note}
        onChange={handleProductNoteInputChangeEvent}
        helperText={curProductValidationState.note}
        error={curProductValidationState.note !== ""}
      />
      {/** PUblish **/}
      <Typography variant="subtitle1" component="h6" align="left" className={classes.subtitle}>
        Publish
      </Typography>
      <Typography variant="body2" component="p" color="textSecondary" align="left" className={classes.subtitle}>
        To publish this product, you need to add at least one variant. You can add as many variants as you want at its management page. Click the link at 'Variants' column of your target product.
      </Typography>
      <Box className={classes.errorMsg}>
        {curProductValidationState.isPublic}
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            checked={curProductState.isPublic}
            onChange={handleProductPublicChangeEvent}
            name="checkedB"
            color="primary"
          />
        }
        label="Ready to Publish?"
      /><br />
      <Backdrop className={classes.backdrop} open={curBackdropOpen} >
        <CircularProgress color="inherit" />
      </Backdrop>
    </form>
  )
});

export default AdminProductForm



