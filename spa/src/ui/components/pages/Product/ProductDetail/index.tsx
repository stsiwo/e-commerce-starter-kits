import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import RadioGroup from "@material-ui/core/RadioGroup";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Rating from "@material-ui/lab/Rating/Rating";
import { AxiosError } from "axios";
import Carousel from "components/common/Carousel";
import ColorRadio from "components/common/ColorRadio";
import ReviewCard from "components/common/ReviewCard";
import SingleLineList from "components/common/SingleLineList";
import { api } from "configs/axiosConfig";
import { isReachMaxQuantity, isReachMinQuantity } from "domain/cart";
import {
  filterSingleVariant,
  filterUniqueVariantColors,
  filterUniqueVariantSizes,
  getVariantStockBack,
  isExceedStock,
} from "domain/product";
import {
  ProductStockEnum,
  ProductType,
  ProductVariantSizeType,
  ProductVariantType,
} from "domain/product/types";
import { ReviewType } from "domain/review/type";
import uniqBy from "lodash/uniqBy";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageActions } from "reducers/slices/app";
import { cartItemActions } from "reducers/slices/domain/cartItem";
import { postWishlistItemActionCreator } from "reducers/slices/domain/wishlistItem";
import { cartModalActions } from "reducers/slices/ui";
import { MessageTypeEnum, UserTypeEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { cadCurrencyFormat, getNanoId, toDateString } from "src/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    subtitle: {
      fontWeight: theme.typography.fontWeightBold,
      margin: `${theme.spacing(1)}px 0`,
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center",
    },
    productName: {
      fontWeight: theme.typography.fontWeightBold,
    },
    productDescTitle: {
      fontWeight: theme.typography.fontWeightBold,
    },
    productDesc: {},
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
      flexDirection: "row",
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
      },
    },
    regularPrice: {
      textDecoration: "line-through",
    },
    discountPrice: {
      color: theme.palette.error.main,
    },
  })
);

interface ProductDetailPropsType {
  product: ProductType;
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
 *  - note:
 *
 *    - don't use 'selector' to grab or calculate value of product.
 *
 *      - if users visit this page directly, state.domain.products might not be available (e.g., empty object) so just use this props.product for handling this page.
 *
 **/
const ProductDetail: React.FunctionComponent<ProductDetailPropsType> = (
  props
) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  // state for color & size & quantity
  const [curSelectedColor, setSelectedColor] = React.useState<string>(
    props.product.variants[0].variantColor
  );
  const [curSelectedSize, setSelectedSize] =
    React.useState<ProductVariantSizeType>(
      props.product.variants[0].productSize
    );

  const [curVariant, setVariant] = React.useState<ProductVariantType>(
    props.product.variants[0]
  );

  const [curQty, setQty] = React.useState<number>(1);

  // cur available colors and sizes
  const [curAvailableColors, setAvailableColors] = React.useState<string[]>(
    filterUniqueVariantColors(props.product)
  );

  const [curAvailableSizes, setAvailableSizes] = React.useState<
    ProductVariantSizeType[]
  >(filterUniqueVariantSizes(props.product));

  // event handlers for size change
  const handleSizeSelectionChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextProductSize = curAvailableSizes.find(
      (size: ProductVariantSizeType) => size.productSizeName == e.target.value
    );
    setSelectedSize(nextProductSize);
  };

  // event handler for color change
  const handleColorSelectionChangeEvent: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    const nextColor = e.currentTarget.value;
    setSelectedColor(nextColor);
  };

  // event handler for qty increment/decrement
  const handleQtyInc: React.EventHandler<React.MouseEvent<HTMLButtonElement>> =
    (e) => {
      // max quantity = 10
      if (isReachMaxQuantity(curQty)) {
        return false;
      }

      if (isExceedStock(curQty, curVariant.variantId, props.product)) {
        return false;
      }

      setQty((prev: number) => prev + 1);
    };

  // event handler for qty increment/decrement
  const handleQtyDec: React.EventHandler<React.MouseEvent<HTMLButtonElement>> =
    (e) => {
      // min quantity = 1
      if (isReachMinQuantity(curQty)) {
        return false;
      }

      setQty((prev: number) => prev - 1);
    };

  // use effect to update available size when curColor change
  //  - if a user change the color, need to display only available sizes based on the change
  React.useEffect(() => {
    const nextAvailableVariants = props.product.variants.filter(
      (variant: ProductVariantType) => variant.variantColor == curSelectedColor
    );
    const nextAvailableSizes: ProductVariantSizeType[] = uniqBy(
      nextAvailableVariants.map(
        (variant: ProductVariantType) => variant.productSize
      ),
      (productSize: ProductVariantSizeType) => {
        return productSize.productSizeId;
      }
    );

    // if there is no cur size in the next available sizes, need to change it to the one in the available sizes
    if (
      !nextAvailableSizes.find(
        (size: ProductVariantSizeType) =>
          size.productSizeId == curSelectedSize.productSizeId
      )
    ) {
      const nextSize: ProductVariantSizeType = nextAvailableSizes[0];

      // if does not exists, pick the first one
      setSelectedSize(nextSize);

      // -- curVariant --

      // update curVariant based on the change of this
      const nextVariant = props.product.variants.find(
        (variant: ProductVariantType) =>
          variant.variantColor == curSelectedColor &&
          variant.productSize.productSizeId == nextSize.productSizeId
      );
      setVariant(nextVariant);
    } else {
      // -- curVariant --
      const nextVariant = props.product.variants.find(
        (variant: ProductVariantType) =>
          variant.variantColor == curSelectedColor &&
          variant.productSize.productSizeId == curSelectedSize.productSizeId
      );
      setVariant(nextVariant);
    }

    setAvailableSizes(nextAvailableSizes);
  }, [curSelectedColor]);

  // use effect to udpate curVariant when curSize change
  //  - you don't need to update color stuff.
  React.useEffect(() => {
    // update curVariant based on the change of this
    const nextVariant = props.product.variants.find(
      (variant: ProductVariantType) =>
        variant.variantColor == curSelectedColor &&
        variant.productSize.productSizeId == curSelectedSize.productSizeId
    );
    setVariant(nextVariant);
  }, [JSON.stringify(curSelectedSize)]);

  // stock availability stuff
  const curStockBag = getVariantStockBack(curVariant.variantStock);

  // auth
  const auth = useSelector(mSelector.makeAuthSelector());

  // event handler for adding cart
  const isMaxCartItems = useSelector(
    mSelector.makeIsExceedMaxNumberOfCartItemSelector()
  );
  const isDuplicatedCartItem = useSelector(
    mSelector.makeIsDuplicateVariantCartItemSelector(curVariant.variantId)
  );
  const handleAddCart: React.EventHandler<React.MouseEvent<HTMLButtonElement>> =
    (e) => {
      // not allow if out of stock
      if (curStockBag.enum === ProductStockEnum.OUT_OF_STOCK) {
        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.ERROR,
            message: "the product does not have any stock.",
          })
        );
      }

      if (auth.userType === UserTypeEnum.GUEST) {
        // validation
        if (isMaxCartItems) {
          dispatch(
            messageActions.update({
              id: getNanoId(),
              type: MessageTypeEnum.ERROR,
              message: "can't add more (max: 5 items)",
            })
          );
          return false;
        }

        if (isDuplicatedCartItem) {
          dispatch(
            messageActions.update({
              id: getNanoId(),
              type: MessageTypeEnum.ERROR,
              message: "selected item already in the cart",
            })
          );
          return false;
        }

        dispatch(
          cartItemActions.append({
            cartItemId: getNanoId(), // temp id
            createdAt: new Date(Date.now()),
            isSelected: true,
            product: filterSingleVariant(curVariant.variantId, props.product), // need to set filtered product (only contains selected variant)
            quantity: curQty,
            user: null,
          })
        );

        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.SUCCESS,
            message: "added successfully",
          })
        );
      } else {
        // request
        api
          .request({
            method: "POST",
            url: API1_URL + `/users/${auth.user.userId}/cartItems`,
            data: {
              variantId: curVariant.variantId,
              isSelected: true,
              quantity: curQty,
              userId: auth.user.userId,
            },
          })
          .then((data) => {
            // fetch again
            dispatch(cartItemActions.append(data.data));

            dispatch(
              messageActions.update({
                id: getNanoId(),
                type: MessageTypeEnum.SUCCESS,
                message: "added successfully",
              })
            );
          })
          .catch((error: AxiosError) => {
            dispatch(
              messageActions.update({
                id: getNanoId(),
                type: MessageTypeEnum.ERROR,
                message: error.response.data.message,
              })
            );
          });
      }
    };

  // event handler for adding cart
  const handleAddWishlist: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = (e) => {
    dispatch(
      postWishlistItemActionCreator({
        variantId: curVariant.variantId,
        userId: auth.user.userId,
        product: props.product,
      })
    );
  };

  // event handler for buy now
  const handleBuyNow: React.EventHandler<React.MouseEvent<HTMLButtonElement>> =
    (e) => {
      if (auth.userType === UserTypeEnum.GUEST) {
        // validation
        if (isMaxCartItems) {
          dispatch(
            messageActions.update({
              id: getNanoId(),
              type: MessageTypeEnum.ERROR,
              message: "can't add more (max: 5 items)",
            })
          );
          return false;
        }

        if (isDuplicatedCartItem) {
          dispatch(
            messageActions.update({
              id: getNanoId(),
              type: MessageTypeEnum.ERROR,
              message: "selected item already in the cart",
            })
          );
          return false;
        }

        dispatch(
          cartItemActions.append({
            cartItemId: getNanoId(), // temp id
            createdAt: new Date(Date.now()),
            isSelected: true,
            product: filterSingleVariant(curVariant.variantId, props.product), // need to set filtered product (only contains selected variant)
            quantity: curQty,
            user: null,
          })
        );

        dispatch(
          messageActions.update({
            id: getNanoId(),
            type: MessageTypeEnum.SUCCESS,
            message: "added successfully",
          })
        );

        dispatch(cartModalActions.open());
      } else {
        // request
        api
          .request({
            method: "POST",
            url: API1_URL + `/users/${auth.user.userId}/cartItems`,
            data: {
              variantId: curVariant.variantId,
              isSelected: true,
              quantity: curQty,
              userId: auth.user.userId,
            },
          })
          .then((data) => {
            // fetch again
            dispatch(cartItemActions.append(data.data));

            dispatch(
              messageActions.update({
                id: getNanoId(),
                type: MessageTypeEnum.SUCCESS,
                message: "added successfully",
              })
            );
            dispatch(cartModalActions.open());
          })
          .catch((error: AxiosError) => {
            dispatch(
              messageActions.update({
                id: getNanoId(),
                type: MessageTypeEnum.ERROR,
                message: error.response.data.message,
              })
            );
          });
      }
    };

  // render function
  //      <ColorCell value={color} />
  const renderAvailableColors: () => React.ReactNode = () => {
    return curAvailableColors.map((color: string) => {
      return (
        <FormControlLabel
          value={color}
          control={<ColorRadio />}
          label=""
          className={classes.colorFormLabel}
          key={color}
        />
      );
    });
  };

  // render reviews if exist
  const renderReviews: () => React.ReactNode = () => {
    return props.product.reviews.map((review: ReviewType) => {
      return <ReviewCard key={review.reviewId} review={review} />;
    });
  };

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {props.product.productName}
      </Typography>
      <Grid container justify="center">
        {/** image carousel **/}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <Carousel items={props.product.productImages} />
        </Grid>
        {/** detail info **/}
        <Grid item xs={12} md={6} className={classes.gridItem}>
          <Typography
            variant="body1"
            component="p"
            className={classes.subtitle}
          >
            Description
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.productDesc}
          >
            {props.product.productDescription}
          </Typography>
          <Box component="div" className={classes.productColorBox}>
            <Typography
              variant="body1"
              component="p"
              className={classes.productColorTitle}
            >
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
            <Typography
              variant="body1"
              component="p"
              className={classes.productColorTitle}
            >
              Size:
            </Typography>
            <FormControl className={classes.sizeInput}>
              <Select
                id="product-size"
                value={curSelectedSize.productSizeName}
                onChange={handleSizeSelectionChangeEvent}
              >
                {curAvailableSizes.map((size: ProductVariantSizeType) => (
                  <MenuItem
                    key={size.productSizeId}
                    value={size.productSizeName}
                  >
                    {size.productSizeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box component="div" className={classes.productColorBox}>
            <Typography
              variant="body1"
              component="p"
              className={classes.productColorTitle}
            >
              Qty:
            </Typography>
            <ButtonGroup size="small" aria-label="small outlined button group">
              {/** don't use <IconButton> inside <ButtonGroup>, it causes errors e.g., 'fullwidth' 'disableelevation unrecognaized property. use lowercase... **/}
              <Button onClick={handleQtyInc} variant="contained">
                <AddCircleIcon />
              </Button>
              <Button variant="contained">{curQty}</Button>
              <Button onClick={handleQtyDec} variant="contained">
                <RemoveCircleIcon />
              </Button>
            </ButtonGroup>
          </Box>
          <Box component="div" className={classes.productColorBox}>
            <Typography
              variant="body1"
              component="p"
              className={classes.productColorTitle}
            >
              Review Point:
            </Typography>
            <Rating
              disabled
              name="product-review-point"
              precision={0.1}
              value={props.product.averageReviewPoint}
              size="small"
            />
            <br />
          </Box>
          <Box component="div">
            {curVariant.isDiscountAvailable && (
              <React.Fragment>
                <Typography
                  variant="body1"
                  component="p"
                  className={classes.productColorTitle}
                >
                  Price:{" "}
                  <span className={classes.regularPrice}>
                    $ {`${cadCurrencyFormat(curVariant.regularPrice * curQty)}`}
                  </span>
                  <b className={classes.discountPrice}>{` ${cadCurrencyFormat(
                    curVariant.currentPrice * curQty
                  )}`}</b>
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  className={classes.productColorTitle}
                >
                  {`${toDateString(
                    curVariant.variantDiscountStartDate
                  )} ~ ${toDateString(curVariant.variantDiscountEndDate)}`}
                </Typography>
              </React.Fragment>
            )}
            {!curVariant.isDiscountAvailable && (
              <Typography
                variant="body1"
                component="p"
                className={classes.productColorTitle}
              >
                Price:{" "}
                <b>{` ${cadCurrencyFormat(
                  curVariant.currentPrice * curQty
                )}`}</b>
              </Typography>
            )}
          </Box>
          <Box component="div">
            <Typography
              variant="body1"
              component="p"
              className={classes.productColorTitle}
            >
              Stock:{" "}
              <b
                style={{ color: curStockBag.color }}
              >{`${curStockBag.label}`}</b>
            </Typography>
          </Box>
          <Box component="div" className={classes.controllerBox}>
            <Button
              onClick={handleAddCart}
              disabled={
                curStockBag.enum === ProductStockEnum.OUT_OF_STOCK ||
                auth.userType === UserTypeEnum.ADMIN
              }
              variant="contained"
            >
              {"Add to Cart"}
            </Button>
            {auth.userType === UserTypeEnum.MEMBER && (
              <Button onClick={handleAddWishlist} variant="contained">
                {"save to Wishlist"}
              </Button>
            )}
            <Button
              onClick={handleBuyNow}
              disabled={
                curStockBag.enum === ProductStockEnum.OUT_OF_STOCK ||
                auth.userType === UserTypeEnum.ADMIN
              }
              variant="contained"
            >
              {"buy now"}
            </Button>
          </Box>
        </Grid>
        {props.product.reviews && props.product.reviews.length > 0 && (
          <React.Fragment>
            <Grid item xs={12} className={classes.detailNoteBox}>
              <Typography
                variant="body1"
                component="h6"
                className={classes.subtitle}
              >
                Reviews
              </Typography>
            </Grid>
            <SingleLineList renderDomainFunc={renderReviews} />
          </React.Fragment>
        )}
        {props.product.note && (
          <Grid item xs={12} className={classes.detailNoteBox}>
            <Typography
              variant="body1"
              component="h6"
              className={classes.subtitle}
            >
              Detail Note
            </Typography>
            <Typography variant="body1" component="p">
              {props.product.note}
            </Typography>
            <Box component="div" className={classes.controllerBox}>
              <Button
                disabled={
                  curStockBag.enum === ProductStockEnum.OUT_OF_STOCK ||
                  auth.userType === UserTypeEnum.ADMIN
                }
                onClick={handleAddCart}
                variant="contained"
              >
                {"Add to Cart"}
              </Button>
              {auth.userType === UserTypeEnum.MEMBER && (
                <Button onClick={handleAddWishlist} variant="contained">
                  {"save to Wishlist"}
                </Button>
              )}
              <Button
                onClick={handleBuyNow}
                variant="contained"
                disabled={
                  curStockBag.enum === ProductStockEnum.OUT_OF_STOCK ||
                  auth.userType === UserTypeEnum.ADMIN
                }
              >
                {"buy now"}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default ProductDetail;
