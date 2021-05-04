import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp } from '@material-ui/data-grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { AxiosError } from 'axios';
import { api } from 'configs/axiosConfig';
import { ProductType } from 'domain/product/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RRLink } from "react-router-dom";
import { fetchProductActionCreator, productPaginationPageActions } from 'reducers/slices/domain/product';
import { mSelector } from 'src/selectors/selector';
import AdminProductFormDrawer from '../AdminProductFormDrawer';
import Pagination from '@material-ui/lab/Pagination/Pagination';

declare type AdminProductGridViewPropsType = {
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

const generateRows: (domains: ProductType[]) => GridRowsProp = (domains) => {
  return domains.map((domain: ProductType) => {
    return {
      id: domain.productId,
      name: domain.productName,
      path: domain.productPath,
      category: domain.category.categoryName,
      unitPrice: domain.productBaseUnitPrice,
      discount: domain.isDiscount,
      releaseDate: domain.releaseDate,
      publish: domain.isPublic,
      variants: {
        count: domain.variants.length,
        productId: domain.productId,
      },
      actions: domain.productId,
    }
  });
}

const generateColumns: (onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>, onDelete: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => GridColDef[] = (onEdit, onDelete) => {
  return [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'unitPrice', headerName: 'Unit Price', width: 150 },
    { field: 'path', headerName: 'Path', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'discount', headerName: 'Discount', width: 150 },
    { field: 'releaseDate', headerName: 'Release Date', width: 150 },
    { field: 'publish', headerName: 'Publish', width: 150 },
    {
      field: 'variants',
      headerName: 'Variants',
      width: 150,
      renderCell: (params: GridCellParams) => {
        const count = (params.value as { count: number, productId: string }).count
        const productId = (params.value as { count: number, productId: string }).productId
        return (
          <React.Fragment>
            <Link component={RRLink} to={`/admin/product-variants?productId=${productId}`}>
              {count}
            </Link>
          </React.Fragment>
        )
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-product-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton data-product-id={params.value} onClick={onDelete}>
            <RemoveCircleIcon />
          </IconButton>
        </React.Fragment>
      )
    },
  ]
}

/**
 * admin product management component
 *
 **/
const AdminProductGridView: React.FunctionComponent<AdminProductGridViewPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch()

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  const curProductList = useSelector(mSelector.makeProductWithoutCacheSelector())

  // cur selected product item
  const [curProduct, setProduct] = React.useState<ProductType>(null);

  const pagination = useSelector(mSelector.makeProductPaginationSelector())

  // fetch product
  React.useEffect(() => {
    dispatch(fetchProductActionCreator())
  }, [])


  const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

  const handleNewFormToggleBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    setFormOpen(!curFormOpen)
  }

  // event handler to submit
  const handleAddNewProductBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    console.log("passed")
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
      url: API1_URL + `/products/${auth.user.userId}`
    }).then((data) => {

      enqueueSnackbar("deleted successfully.", { variant: "success" })
    }).catch((error: AxiosError) => {
      enqueueSnackbar(error.message, { variant: "error" })
    })
  }

  // grid event handler stuff
  const handleEditClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const productId = e.currentTarget.getAttribute("data-product-id")

    const targetProduct = curProductList.find((product: ProductType) => product.productId == productId)

    setProduct(targetProduct);

    setFormOpen(true);

  }

  const handleDeleteClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setDeleteDialogOpen(true);

    const productId = e.currentTarget.getAttribute("data-product-id")

    const targetProduct = curProductList.find((product: ProductType) => product.productId == productId)

    setProduct(targetProduct);
  }

  // pagination event handler
  
  /**
   * TODO: make sure pagiantion working when you have more data.
   *
   **/
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {

    // need to decrement since we incremented when display
    const nextPage = value - 1;

    dispatch(productPaginationPageActions.update(nextPage))
  };


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
          <IconButton aria-label="add" onClick={handleNewFormToggleBtnClickEvent}>
            <AddCircleIcon />
          </IconButton>
        }
      />
      <CardContent
        className={classes.cardContentBox}
      >
        <DataGrid
          autoHeight
          rows={generateRows(curProductList)}
          columns={generateColumns(handleEditClick, handleDeleteClick)}
          pageSize={pagination.limit}
          rowCount={pagination.limit}
          // not gonna use pagination of this DataGrid
        />
        <Pagination
          page={pagination.page + 1} // don't forget to increment when display
          count={pagination.totalPages}
          color="primary"
          showFirstButton
          showLastButton
          size={"medium"}
          onChange={handlePaginationChange}
        />
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
      {/** update/create product (without its variants) **/}
      <AdminProductFormDrawer
        curFormOpen={curFormOpen}
        setFormOpen={setFormOpen}
        curProduct={curProduct}
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
            {"Do you want to delete this product permenently?"}
          </Typography>
          <Typography variant="body1" component="p" align="left" className={null} >
            Product Name: <b>{curProduct && curProduct.productName}</b>
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

export default AdminProductGridView




