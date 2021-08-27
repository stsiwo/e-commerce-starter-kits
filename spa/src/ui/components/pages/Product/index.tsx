import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import { NormalizedProductType, ProductType } from "domain/product/types";
import { normalize } from "normalizr";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { productActions } from "reducers/slices/domain/product";
import { FetchStatusEnum } from "src/app";
import { mSelector } from "src/selectors/selector";
import { productSchemaEntity } from "states/state";
import NotFound from "../NotFound";
import ProductDetail from "./ProductDetail";

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
    loadingBox: {
      height: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
  })
);

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
const Product: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  const { productPath } = useParams<{ productPath: string }>();

  const history = useHistory();

  const [curFetchStatus, setFetchStatus] = React.useState<FetchStatusEnum>(
    FetchStatusEnum.INITIAL
  );

  const [isNeedFetch, setNeedFetch] = React.useState<boolean>(false);

  // fetch product detail by productPath

  const [curProduct, setProduct] = React.useState<ProductType>(
    useSelector(mSelector.makeProductByPathSelector(productPath))
  );

  React.useEffect(() => {
    if (!curProduct) {
      setNeedFetch(true);
      setFetchStatus(FetchStatusEnum.FETCHING);

      // oops, the product does not exist in redux store, so send the request to grab this product by path
      api
        .request({
          method: "GET",
          url: API1_URL + `/products/public/${productPath}`,
        })
        .then((data) => {
          setFetchStatus(FetchStatusEnum.SUCCESS);
          const targetProduct: ProductType = data.data;

          // local state
          setProduct(targetProduct);

          // redux store
          const normalizedData = normalize(data.data, productSchemaEntity);
          dispatch(
            productActions.update(
              normalizedData.entities.products as NormalizedProductType
            )
          );

          //enqueueSnackbar("updated successfully.", { variant: "success" })
        })
        .catch((error: AxiosError) => {
          setFetchStatus(FetchStatusEnum.FAILED);
          enqueueSnackbar(error.message, { variant: "error" });
        });
    }
  }, []);

  if (isNeedFetch && curFetchStatus === FetchStatusEnum.FAILED) {
    return <NotFound />;
  }

  if (!curProduct) {
    return (
      <Box className={classes.loadingBox}>
        <CircularProgress />
      </Box>
    );
  }

  return <ProductDetail product={curProduct} />;
};

export default Product;
