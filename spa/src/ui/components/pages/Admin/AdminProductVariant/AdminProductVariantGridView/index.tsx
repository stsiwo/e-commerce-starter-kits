import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRowsProp,
} from "@material-ui/data-grid";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import ColorCell from "components/common/GridData/ColorCell";
import SizeCell from "components/common/GridData/SizeCell";
import { ProductVariantType, ProductType } from "domain/product/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  deleteSingleProductVariantActionCreator,
  fetchSingleProductActionCreator,
} from "reducers/slices/domain/product";
import { mSelector, rsSelector } from "src/selectors/selector";
import AdminProductVariantFormDialog from "../AdminProductVariantFormDialog";
import { FetchStatusEnum } from "src/app";
import {
  deleteSingleProductFetchStatusActions,
  putProductVariantFetchStatusActions,
  postProductVariantFetchStatusActions,
  deleteSingleProductVariantFetchStatusActions,
} from "reducers/slices/app/fetchStatus/product";

declare type AdminProductVariantGridViewPropsType = {
  curFormOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    media: {},
    actionBox: {
      textAlign: "center",
    },
    cardHeader: {
      paddingBottom: 0,
    },
    cardContentBox: {
      paddingTop: 0,
    },
  })
);

const generateRows: (
  domains: ProductVariantType[],
  product: ProductType
) => GridRowsProp = (domains, product) => {
  return domains.map((domain: ProductVariantType) => {
    return {
      id: domain.variantId,
      size: domain.productSize.productSizeName,
      color: domain.variantColor,
      currentPrice: domain.currentPrice,
      unitPrice: domain.variantUnitPrice
        ? domain.variantUnitPrice
        : product.productBaseUnitPrice,
      stock: domain.variantStock,
      discount: domain.isDiscountAvailable,
      soldCount: domain.soldCount,
      weight: domain.variantWeight,
      actions: domain.variantId,
    };
  });
};

const generateColumns: (
  onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>,
  onDelete: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
) => GridColDef[] = (onEdit, onDelete) => {
  return [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "size",
      headerName: "Size",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <SizeCell value={params.value as string} />
      ),
    },
    {
      field: "color",
      headerName: "Color",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <ColorCell value={params.value as string} />
      ),
    },
    { field: "currentPrice", headerName: "Current Price", width: 150 },
    { field: "unitPrice", headerName: "Unit Price", width: 150 },
    { field: "stock", headerName: "Stock #", width: 100 },
    { field: "discount", headerName: "Discount", width: 150 },
    { field: "soldCount", headerName: "Sold #", width: 100 },
    { field: "weight", headerName: "Weight", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-variant-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton data-variant-id={params.value} onClick={onDelete}>
            <RemoveCircleIcon />
          </IconButton>
        </React.Fragment>
      ),
    },
  ];
};

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * admin product variant management component
 *
 **/
const AdminProductVariantGridView: React.FunctionComponent<AdminProductVariantGridViewPropsType> =
  (props) => {
    // mui: makeStyles
    const classes = useStyles();

    // auth
    const auth = useSelector(mSelector.makeAuthSelector());

    // query params
    const query = useQuery();
    const targetProductId = query.get("productId");

    const dispatch = useDispatch();

    // cur selected product item
    const curProduct = useSelector(
      mSelector.makeProductVariantByProductIdSelector(targetProductId)
    );

    // if the product is not in redux store, we need to fetch from the backend.
    React.useEffect(() => {
      if (!curProduct) {
        dispatch(
          fetchSingleProductActionCreator({ productId: targetProductId })
        );
      }
    }, []);

    const [curProductVariant, setProductVariant] =
      React.useState<ProductVariantType>(null);

    /**
     * TODO: useEffect to fetch the target product in the case where the product does not exist in redux store.
     *
     *  - e.g., if visit this page without admin product page, it causes 500 errors since we can populate the products by visiting the admin product page first.
     *
     **/

    const handleNewProductVariantFormToggleBtnClickEvent: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = async (e) => {
      props.setFormOpen(!props.curFormOpen);
    };

    // deletion dialog stuff
    const [curDeleteDialogOpen, setDeleteDialogOpen] =
      React.useState<boolean>(false);

    const handleDeletionCancel: React.EventHandler<
      React.MouseEvent<HTMLElement>
    > = (e) => {
      setDeleteDialogOpen(false);
    };

    const handleDeletionOk: React.EventHandler<React.MouseEvent<HTMLElement>> =
      (e) => {
        // request
        dispatch(
          deleteSingleProductVariantActionCreator({
            productId: targetProductId,
            variantId: curProductVariant.variantId,
          })
        );
      };

    // grid event handler stuff
    const handleEditClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      const variantId = e.currentTarget.getAttribute("data-variant-id");

      const targetProduct = curProduct.variants.find(
        (productVariant: ProductVariantType) =>
          productVariant.variantId == variantId
      );

      setProductVariant(targetProduct);

      props.setFormOpen(true);
    };

    const handleDeleteClick: React.EventHandler<
      React.MouseEvent<HTMLButtonElement>
    > = (e) => {
      const variantId = e.currentTarget.getAttribute("data-variant-id");

      const targetProduct = curProduct.variants.find(
        (productVariant: ProductVariantType) =>
          productVariant.variantId == variantId
      );

      setDeleteDialogOpen(true);

      setProductVariant(targetProduct);
    };

    // close form dialog only when success for post/put/delete
    const curPostFetchStatus = useSelector(
      rsSelector.app.getPostProductVariantFetchStatus
    );
    const curPutFetchStatus = useSelector(
      rsSelector.app.getPutProductVariantFetchStatus
    );
    const curDeleteSingleFetchStatus = useSelector(
      rsSelector.app.getDeleteSingleProductVariantFetchStatus
    );
    React.useEffect(() => {
      if (
        curPostFetchStatus === FetchStatusEnum.SUCCESS ||
        curPutFetchStatus === FetchStatusEnum.SUCCESS ||
        curDeleteSingleFetchStatus === FetchStatusEnum.SUCCESS
      ) {
        props.setFormOpen(false);
        setDeleteDialogOpen(false);

        dispatch(postProductVariantFetchStatusActions.clear());
        dispatch(putProductVariantFetchStatusActions.clear());
        dispatch(deleteSingleProductVariantFetchStatusActions.clear());
      }
    });
    if (!curProduct) {
      return <p>Fetching Data...</p>;
    }

    return (
      <Card className={classes.root}>
        <CardHeader
          className={classes.cardHeader}
          titleTypographyProps={{
            variant: "h6",
          }}
          subheaderTypographyProps={{
            variant: "body1",
          }}
          title="Product Variant List"
          action={
            <IconButton
              aria-label="add"
              onClick={handleNewProductVariantFormToggleBtnClickEvent}
            >
              <AddCircleIcon />
            </IconButton>
          }
        />
        <CardContent className={classes.cardContentBox}>
          <DataGrid
            autoHeight
            rows={generateRows(curProduct.variants, curProduct)}
            columns={generateColumns(handleEditClick, handleDeleteClick)}
          />
        </CardContent>
        <CardActions disableSpacing></CardActions>
        {/** create/update varaints **/}
        <AdminProductVariantFormDialog
          curFormOpen={props.curFormOpen}
          setFormOpen={props.setFormOpen}
          curProductVariant={curProductVariant}
        />
        {/** onDelete confiramtion dialog **/}
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="product-deletion-dialog"
          open={curDeleteDialogOpen}
        >
          <DialogTitle id="product-deletion-dialog">
            Product Deletion
          </DialogTitle>
          <DialogContent dividers>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              {"Do you want to delete this product varaint permenently?"}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              align="left"
              className={null}
            >
              Product Variant Id:{" "}
              <b>{curProductVariant && curProductVariant.variantId}</b>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleDeletionCancel}
              variant="contained"
            >
              Cancel
            </Button>
            <Button onClick={handleDeletionOk} variant="contained">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  };

export default AdminProductVariantGridView;
