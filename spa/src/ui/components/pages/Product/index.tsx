import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { generateProductList } from 'tests/data/product';
import { useParams } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Carousel from 'components/common/Carousel';
import { ProductType, ProductVariantType, ProductVariantSizeType } from 'domain/product/types';
import uniq from 'lodash/uniq';
import ColorCell from 'components/common/GridData/ColorCell';
import Box from '@material-ui/core/Box';
import SizeCell from 'components/common/GridData/SizeCell';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import ColorRadio from 'components/common/ColorRadio';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating/Rating';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center"
    },
    productName: {
      fontWeight: theme.typography.fontWeightBold,
    },
    productDesc: {
    },
    productColorTitle: {
      fontWeight: theme.typography.fontWeightBold,
    },
    productColorBox: {
      display: "flex",
      alignItems: "center",
    },
    colorRadioGroup: {
      display: "flex",
      flexDirection: 'row',
    },
    colorFormLabel: {
      margin: 0,
    },
    sizeInput: {
      margin: theme.spacing(0, 1, 0, 1),
    },
    gridItem: {
      padding: theme.spacing(1)
    },
  }),
);

interface ColorSizeSelectionType {
  color: string
  size: ProductVariantSizeType
}

/**
 * product page 
 *
 *  - steps
 *
 *    0: fetch the product detail from api
 *
 *    1: display a given product detail including its variants
 *
 *    2: a user select a specific variant (color, size) and its quantity
 *
 *    3: add to cart / checkout
 *
 *  - color & size picking logic
 *
 *    - display all colors (default selection: the 1st color)
 *
 *    - every time a user change the color, it also causes changing the sizes, means that display only available sizes for selected color.
 *
 **/
const Product: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const dispatch = useDispatch()

  const { productPath } = useParams();

  // fetch product detail by productPath

  const testProduct = React.useMemo(() => generateProductList(1)[0], []);

  console.log("test product object")
  console.log(testProduct)

  // state for color & size & quantity
  const [curSelectedColor, setSelectedColor] = React.useState<string>(testProduct.productVariants[0].variantColor)
  const [curSelectedSize, setSelectedSize] = React.useState<ProductVariantSizeType>(testProduct.productVariants[0].variantSize)

  const [curVariant, setVariant] = React.useState<ProductVariantType>(testProduct.productVariants[0]);

  const [curQty, setQty] = React.useState<number>(1);

  // cur available colors and sizes
  const [curAvailableColors, setAvailableColors] = React.useState<string[]>(
    uniq(testProduct.productVariants.map((variant: ProductVariantType) => {
      return variant.variantColor
    }))
  )

  const [curAvailableSizes, setAvailableSizes] = React.useState<ProductVariantSizeType[]>(
    uniq(testProduct.productVariants.map((variant: ProductVariantType) => {
      return variant.variantSize
    }))
  )

  // event handlers
  const handleSizeSelectionChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    // value = productSizeId
    const nextProductSize = curAvailableSizes.find((size: ProductVariantSizeType) => size.productSizeId === e.currentTarget.value)
    setSelectedSize(nextProductSize)
  }

  const handleColorSelectionChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextColor = e.currentTarget.value
    setSelectedColor(nextColor)
  }

  // use effect to update available size when curColor change
  //  - if a user change the color, need to display only available sizes based on the change
  React.useEffect(() => {
    const nextAvailableVariants = testProduct.productVariants.filter((variant: ProductVariantType) => variant.variantColor == curSelectedColor);
    const nextAvailableSizes = uniq(nextAvailableVariants.map((variant: ProductVariantType) => variant.variantSize))

    // if there is no cur size in the next available sizes, need to change it to the one in the available sizes
    if (!nextAvailableSizes.find((size: ProductVariantSizeType) => size.productSizeId == curSelectedSize.productSizeId)) {

      const nextSize = nextAvailableSizes[0]

      // if does not exists, pick the first one
      setSelectedSize(nextSize)

      // -- curVariant --

      // update curVariant based on the change of this
      const nextVariant = testProduct.productVariants.find((variant: ProductVariantType) => variant.variantColor == curSelectedColor && variant.variantSize.productSizeId == nextSize.productSizeId)
      setVariant(nextVariant)
    } else {
      // -- curVariant --
      const nextVariant = testProduct.productVariants.find((variant: ProductVariantType) => variant.variantColor == curSelectedColor && variant.variantSize.productSizeId == curSelectedSize.productSizeId)
      setVariant(nextVariant)
    }

    setAvailableSizes(nextAvailableSizes)
  }, [
      curSelectedColor
    ])

  // use effect to udpate curVariant when curSize change
  //  - you don't need to update color stuff.
  React.useEffect(() => {

    // update curVariant based on the change of this
    const nextVariant = testProduct.productVariants.find((variant: ProductVariantType) => variant.variantColor == curSelectedColor && variant.variantSize.productSizeId == curSelectedSize.productSizeId)
    setVariant(nextVariant)
  }, [
      curSelectedSize.productSizeId
    ])

  // render function
  //      <ColorCell value={color} />
  const renderAvailableColors: () => React.ReactNode = () => {
    return curAvailableColors.map((color: string) => {
      return (
        <FormControlLabel value={color} control={<ColorRadio />} label="" className={classes.colorFormLabel} key={color} />
      )
    })
  }

  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {testProduct.productName}
      </Typography>
      <Grid
        container
        justify="center"
      >
        {/** image carousel **/}
        <Grid
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <Carousel items={testProduct.productImages} />
        </Grid>
        {/** detail info **/}
        <Grid
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <Typography variant="body1" component="p" align="left" className={classes.productDesc}>
            {testProduct.productDescription}
          </Typography>
          <Box component="div" className={classes.productColorBox}>
            <Typography variant="body1" component="p" align="left" className={classes.productColorTitle}>
              Color:
            </Typography>
            <RadioGroup
              value={curSelectedColor}
              aria-label="product-variant-color"
              name="product-variant-color"
              onChange={handleColorSelectionChangeEvent}
              className={classes.colorRadioGroup}
            >
              {renderAvailableColors()}
            </RadioGroup>
          </Box>
          <Box component="div" className={classes.productColorBox}>
            <Typography variant="body1" component="p" align="left" className={classes.productColorTitle}>
              Size:
            </Typography>
            <TextField
              id="product-size"
              label=""
              select
              value={curSelectedSize.productSizeId}
              onChange={handleSizeSelectionChangeEvent}
              className={classes.sizeInput}
            >
              {curAvailableSizes.map((size: ProductVariantSizeType) => (
                <MenuItem key={size.productSizeId} value={size.productSizeId}>
                  {size.productSizeName}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box component="div" className={classes.productColorBox}>
            <Typography variant="body1" component="p" align="left" className={classes.productColorTitle}>
              Qty:
            </Typography>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <IconButton>
                <AddCircleIcon />
              </IconButton>
              <Button disabled>{curQty}</Button>
              <IconButton>
                <RemoveCircleIcon />
              </IconButton>
            </ButtonGroup>
          </Box>
          <Box component="div" className={classes.productColorBox}>
            <Typography variant="body1" component="p" align="left" className={classes.productColorTitle}>
              Review Point:
            </Typography>
            <Rating
              disabled
              name="product-review-point"
              precision={0.1}
              value={testProduct.averageReviewPoint}
              size="small"
            /><br />
          </Box>
          <Box component="div" >
            <Typography variant="body1" component="p" align="left" className={classes.productColorTitle}>
              Price: <b>$ {`${curVariant.variantUnitPrice ? curVariant.variantUnitPrice * curQty : testProduct.productBaseUnitPrice * curQty}`}</b>
            </Typography>
            <Typography variant="body2" component="p" align="left" color="textSecondary">
              * this does not include tax and shipping fee
            </Typography>
          </Box>
          <Box component="div" className={classes.controllerBox}>
            <Button>
              {"Add to Cart"}
            </Button>
            <Button>
              {"save to Wishlist"}
            </Button>
            <Button>
              {"buy now"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Product



