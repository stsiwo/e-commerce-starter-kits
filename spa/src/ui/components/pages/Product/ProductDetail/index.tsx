import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Rating from '@material-ui/lab/Rating/Rating';
import Carousel from 'components/common/Carousel';
import ColorRadio from 'components/common/ColorRadio';
import { filterUniqueVariantColors, filterUniqueVariantSizes, isExceedStock, filterSingleVariant } from 'domain/product';
import { ProductType, ProductVariantSizeType, ProductVariantType } from 'domain/product/types';
import uniq from 'lodash/uniq';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { UserTypeEnum, MessageTypeEnum } from 'src/app';
import { cartItemActions } from 'reducers/slices/domain/cartItem';
import { api } from 'configs/axiosConfig';
import { AxiosError } from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import { getNanoId } from 'src/utils';
import { postWishlistItemFetchStatusActions } from 'reducers/slices/app/fetchStatus/wishlistItem';
import { postWishlistItemActionCreator } from 'reducers/slices/domain/wishlistItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    subtitle: {
      fontWeight: theme.typography.fontWeightBold,
      margin: `${theme.spacing(1)}px 0`,
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
    productDescTitle: {
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
      justifyContent: "center",

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
      padding: theme.spacing(1),
      textAlign: "center",

      "& > *": {
        margin: `${theme.spacing(2)}px 0`,
      },
    },
    detailNoteBox: {
      textAlign: "center",
    },
    detailNoteTitle: {
      fontWeight: theme.typography.fontWeightBold,
    },
    customBtnDisable: {
      color: "#000",
    },
    btnRoot: {
      "&:disabled": {
        color: "#000",
      }
    }
  }),
);

interface ProductDetailPropsType {
  product: ProductType
}

/**
 * product page 
 *
 *  - steps
 *
 *    0: fetch the product detail from api if redux store is empty
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
const ProductDetail: React.FunctionComponent<ProductDetailPropsType> = (props) => {

  const classes = useStyles();

  const dispatch = useDispatch()

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();
  // state for color & size & quantity
  const [curSelectedColor, setSelectedColor] = React.useState<string>(
    props.product.variants[0].variantColor
  )
  const [curSelectedSize, setSelectedSize] = React.useState<ProductVariantSizeType>(
    props.product.variants[0].productSize
  )

  const [curVariant, setVariant] = React.useState<ProductVariantType>(
    props.product.variants[0]
  );

  const [curQty, setQty] = React.useState<number>(1);

  // cur available colors and sizes
  const [curAvailableColors, setAvailableColors] = React.useState<string[]>(
    filterUniqueVariantColors(props.product)
  )

  const [curAvailableSizes, setAvailableSizes] = React.useState<ProductVariantSizeType[]>(
    filterUniqueVariantSizes(props.product)
  )

  // event handlers for size change
  const handleSizeSelectionChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {

    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextProductSize = curAvailableSizes.find((size: ProductVariantSizeType) => size.productSizeName == e.target.value)
    setSelectedSize(nextProductSize)
  }

  // event handler for color change
  const handleColorSelectionChangeEvent: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    const nextColor = e.currentTarget.value
    setSelectedColor(nextColor)
  }

  // event handler for qty increment/decrement
  const handleQtyInc: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    if (isExceedStock(curQty, curVariant.variantId, props.product)) {
      return false;
    }

    setQty((prev: number) => prev + 1);
  }


  // event handler for qty increment/decrement
  const handleQtyDec: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    if (curQty === 1) {
      return false;
    }

    setQty((prev: number) => prev - 1);
  }

  // use effect to update available size when curColor change
  //  - if a user change the color, need to display only available sizes based on the change
  React.useEffect(() => {

    const nextAvailableVariants = props.product.variants.filter((variant: ProductVariantType) => variant.variantColor == curSelectedColor);
    const nextAvailableSizes: ProductVariantSizeType[] = uniq(nextAvailableVariants.map((variant: ProductVariantType) => variant.productSize))

    // if there is no cur size in the next available sizes, need to change it to the one in the available sizes
    if (!nextAvailableSizes.find((size: ProductVariantSizeType) => size.productSizeId == curSelectedSize.productSizeId)) {

      const nextSize: ProductVariantSizeType = nextAvailableSizes[0]

      // if does not exists, pick the first one
      setSelectedSize(nextSize)

      // -- curVariant --

      // update curVariant based on the change of this
      const nextVariant = props.product.variants.find((variant: ProductVariantType) => variant.variantColor == curSelectedColor && variant.productSize.productSizeId == nextSize.productSizeId)
      setVariant(nextVariant)
    } else {
      // -- curVariant --
      const nextVariant = props.product.variants.find((variant: ProductVariantType) => variant.variantColor == curSelectedColor && variant.productSize.productSizeId == curSelectedSize.productSizeId)
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
    const nextVariant = props.product.variants.find((variant: ProductVariantType) => variant.variantColor == curSelectedColor && variant.productSize.productSizeId == curSelectedSize.productSizeId)
    setVariant(nextVariant)
  }, [
      JSON.stringify(curSelectedSize)
    ])

  // auth
  const auth = useSelector(mSelector.makeAuthSelector());

  // event handler for adding cart
  const handleAddCart: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    if (auth.userType === UserTypeEnum.GUEST) {
      dispatch(cartItemActions.append({
        cartItemId: getNanoId(), // temp id
        createdAt: new Date(Date.now()),
        isSelected: true,
        product: filterSingleVariant(curVariant.variantId, props.product), // need to set filtered product (only contains selected variant) 
        quantity: curQty,
        user: null,
      }))
    } else {

      // request
      api.request({
        method: 'POST',
        url: API1_URL + `/users/${auth.user.userId}/cartItems`,
        data: {
          variantId: curVariant.variantId,
          isSelected: true,
          quantity: curQty,
          userId: auth.user.userId,
        },
      }).then((data) => {

        // fetch again
        dispatch(cartItemActions.append(data.data))

        enqueueSnackbar("added successfully.", { variant: "success" })
      }).catch((error: AxiosError) => {
        enqueueSnackbar(error.message, { variant: "error" })
      })
    }
  }


  // event handler for adding cart
  const handleAddWishlist: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    dispatch(postWishlistItemActionCreator({
      variantId: curVariant.variantId,
      product: props.product
    }))
  }

  const handleBuyNow: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    return false;
  }


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
        {props.product.productName}
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
          <Carousel items={props.product.productImages} />
        </Grid>
        {/** detail info **/}
        <Grid
          item
          xs={12}
          md={6}
          className={classes.gridItem}
        >
          <Typography variant="body1" component="p" className={classes.subtitle}>
            Description
          </Typography>
          <Typography variant="body1" component="p" className={classes.productDesc}>
            {props.product.productDescription}
          </Typography>
          <Box component="div" className={classes.productColorBox}>
            <Typography variant="body1" component="p" className={classes.productColorTitle}>
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
            <Typography variant="body1" component="p" className={classes.productColorTitle}>
              Size:
            </Typography>
            <FormControl className={classes.sizeInput}>
              <Select
                id="product-size"
                value={curSelectedSize.productSizeName}
                onChange={handleSizeSelectionChangeEvent}
              >
                {curAvailableSizes.map((size: ProductVariantSizeType) => (
                  <MenuItem key={size.productSizeId} value={size.productSizeName}>
                    {size.productSizeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box component="div" className={classes.productColorBox}>
            <Typography variant="body1" component="p" className={classes.productColorTitle}>
              Qty:
            </Typography>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <IconButton onClick={handleQtyInc}>
                <AddCircleIcon />
              </IconButton>
              <Button
                disabled
                classes={{
                  /** this override default and 'disable' custom style. **/
                  root: classes.btnRoot,
                }}
              >
                {curQty}
              </Button>
              <IconButton onClick={handleQtyDec}>
                <RemoveCircleIcon />
              </IconButton>
            </ButtonGroup>
          </Box>
          <Box component="div" className={classes.productColorBox}>
            <Typography variant="body1" component="p" className={classes.productColorTitle}>
              Review Point:
            </Typography>
            <Rating
              disabled
              name="product-review-point"
              precision={0.1}
              value={props.product.averageReviewPoint}
              size="small"
            /><br />
          </Box>
          <Box component="div" >
            <Typography variant="body1" component="p" className={classes.productColorTitle}>
              Price: <b>$ {`${curVariant.variantUnitPrice ? curVariant.variantUnitPrice * curQty : props.product.productBaseUnitPrice * curQty}`}</b>
            </Typography>
            <Typography variant="body2" component="p" color="textSecondary">
              * this does not include tax and shipping fee
            </Typography>
          </Box>
          <Box component="div" className={classes.controllerBox}>
            <Button onClick={handleAddCart}>
              {"Add to Cart"}
            </Button>
            <Button onClick={handleAddWishlist}>
              {"save to Wishlist"}
            </Button>
            <Button onClick={handleBuyNow}>
              {"buy now"}
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.detailNoteBox}
        >
          <Typography variant="body1" component="h6" className={classes.subtitle}>
            Detail Note
          </Typography>
          <Typography variant="body1" component="p">
            {props.product.note}
          </Typography>
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

export default ProductDetail



