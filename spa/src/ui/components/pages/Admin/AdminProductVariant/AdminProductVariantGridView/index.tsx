import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp } from '@material-ui/data-grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import ColorCell from 'components/common/GridData/ColorCell';
import SizeCell from 'components/common/GridData/SizeCell';
import * as React from 'react';
import { ProductVariantType } from 'domain/product/types';
import { useSelector, useDispatch } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { useSnackbar } from 'notistack';
import { api } from 'configs/axiosConfig';
import { AxiosError } from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useLocation } from 'react-router';
import { productActions } from 'reducers/slices/domain/product';
import AdminProductVariantFormDrawer from '../AdminProductVariantDrawer';

declare type AdminProductVariantGridViewPropsType = {
  curFormOpen: boolean
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
    media: {
    },
    actionBox: {
      textAlign: "center"
    },
    cardContentBox: {
      height: "70vh",
    }
  }),
);

const generateRows: (domains: ProductVariantType[]) => GridRowsProp = (domains) => {

  return domains.map((domain: ProductVariantType) => {
    return {
      id: domain.variantId,
      size: domain.productSize.productSizeName,
      color: domain.variantColor,
      unitPrice: domain.variantUnitPrice,
      stock: domain.variantStock,
      discount: domain.isDiscount,
      soldCount: domain.soldCount,
      actions: domain.variantId,
    }
  });
}

const generateColumns: (onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>, onDelete: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => GridColDef[] = (onEdit, onDelete) => {
  return [
    { field: 'id', headerName: 'ID', width: 150 },
    {
      field: 'size',
      headerName: 'Size',
      width: 150,
      renderCell: (params: GridCellParams) => (<SizeCell value={params.value as string} />)
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 150,
      renderCell: (params: GridCellParams) => (<ColorCell value={params.value as string} />)
    },
    { field: 'unitPrice', headerName: 'Unit Price', width: 150 },
    { field: 'stock', headerName: 'Stock #', width: 150 },
    { field: 'discount', headerName: 'Discount', width: 150 },
    { field: 'soldCount', headerName: 'Sold #', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-variant-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton data-variant-id={params.value} onClick={onDelete}>
            <RemoveCircleIcon />
          </IconButton>
        </React.Fragment>
      )
    },
  ]
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * admin product variant management component
 *
 **/
const AdminProductVariantGridView: React.FunctionComponent<AdminProductVariantGridViewPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  // query params
  const query = useQuery();
  const targetProductId = query.get("productId")

  const dispatch = useDispatch()

  // cur selected product item
  const curProduct = useSelector(mSelector.makeProductVariantByProductIdSelector(targetProductId));
  const [curProductVariant, setProductVariant] = React.useState<ProductVariantType>(null);

  /**
   * TODO: useEffect to fetch the target product in the case where the product does not exist in redux store.
   *
   *  - e.g., if visit this page without admin product page, it causes 500 errors since we can populate the products by visiting the admin product page first.
   *
   **/

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  const handleNewProductVariantFormToggleBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    props.setFormOpen(!props.curFormOpen)
  }

  // deletion dialog stuff
  const [curDeleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

  const handleDeletionCancel: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {
    setDeleteDialogOpen(false);
  }

  const handleDeletionOk: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {

    // request
    api.request({
      method: 'DELETE',
      url: API1_URL + `/products/${targetProductId}/variants/${curProductVariant.variantId}`
    }).then((data) => {

      // remove the variant from redux store
      dispatch(productActions.deleteVariant({
        productId: targetProductId,
        variantId: curProductVariant.variantId,
      }))

      enqueueSnackbar("deleted successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })
  }

  // grid event handler stuff
  const handleEditClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const variantId = e.currentTarget.getAttribute("data-variant-id")

    const targetProduct = curProduct.variants.find((productVariant: ProductVariantType) => productVariant.variantId == variantId)

    setProductVariant(targetProduct);

    props.setFormOpen(true);
  }

  const handleDeleteClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const variantId = e.currentTarget.getAttribute("data-variant-id")

    const targetProduct = curProduct.variants.find((productVariant: ProductVariantType) => productVariant.variantId == variantId)

    setDeleteDialogOpen(true);

    setProductVariant(targetProduct);
  }


  return (
    <Card className={classes.root}>
      <CardHeader
        titleTypographyProps={{
          variant: 'h6',
        }}
        subheaderTypographyProps={{
          variant: 'body1'
        }}
        title="List"
        action={
          <IconButton aria-label="add" onClick={handleNewProductVariantFormToggleBtnClickEvent}>
            <AddCircleIcon />
          </IconButton>
        }
      />
      <CardContent
        className={classes.cardContentBox}
      >
        <DataGrid
          autoHeight
          rows={generateRows(curProduct.variants)}
          columns={generateColumns(handleEditClick, handleDeleteClick)}
        />
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
      {/** create/update varaints **/}
      <AdminProductVariantFormDrawer 
        curFormOpen={props.curFormOpen} 
        setFormOpen={props.setFormOpen} 
        productVariant={curProductVariant}
      />
      {/** onDelete confiramtion dialog **/}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="product-deletion-dialog"
        open={curDeleteDialogOpen}
      >
        <DialogTitle id="product-deletion-dialog">Product Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" component="p" align="left" className={null} >
            {"Do you want to delete this product varaint permenently?"}
          </Typography>
          <Typography variant="body1" component="p" align="left" className={null} >
            Product Variant Id: <b>{curProductVariant && curProductVariant.variantId}</b>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeletionCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletionOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default AdminProductVariantGridView





