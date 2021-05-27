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
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { DataGrid, GridCellParams, GridColDef, GridPageChangeParams, GridRowsProp } from '@material-ui/data-grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { CategoryType } from 'domain/product/types';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { categoryPaginationPageActions, deleteSingleCategoryActionCreator, fetchCategoryActionCreator } from 'reducers/slices/domain/category';
import { mSelector } from 'src/selectors/selector';
import AdminCategoryFormDialog from '../AdminCategoryFormDialog';
import { FetchStatusEnum } from 'src/app';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

declare type AdminCategoryGridViewPropsType = {
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
    loadingBox: {
      height: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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

const generateRows: (domains: CategoryType[]) => GridRowsProp = (domains) => {
  return domains.map((domain: CategoryType) => {
    return {
      id: domain.categoryId,
      name: domain.categoryName,
      path: domain.categoryPath,
      description: domain.categoryDescription,
      products: domain.categoryId,
      actions: domain.categoryId,
    }
  })
}

const generateColumns: (onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>, onDelete: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => GridColDef[] = (onEdit, onDelete) => {
  return [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'path', headerName: 'Path', width: 150 },
    { field: 'products', headerName: 'Products', width: 150 },
    { field: 'description', headerName: 'Description', width: 400 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-category-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton data-category-id={params.value} onClick={onDelete}>
            <RemoveCircleIcon />
          </IconButton>
        </React.Fragment>
      )
    },
  ];
}

/**
 * admin category management component
 *
 **/
const AdminCategoryGridView: React.FunctionComponent<AdminCategoryGridViewPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch()

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // domain cur item
  const curCategoryList = useSelector(mSelector.makeCategoryWithoutCacheSelector())

  // cur selected category item
  const [curCategory, setCategory] = React.useState<CategoryType>(null);

  const pagination = useSelector(mSelector.makeProductPaginationSelector())

  // fetch category
  React.useEffect(() => {
    dispatch(fetchCategoryActionCreator())
  }, [])

  const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

  const handleNewFormToggleBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    setCategory(null)
    setFormOpen(!curFormOpen)
  }

  // deletion dialog stuff
  const [curDeleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

  const handleDeletionCancel: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {
    setDeleteDialogOpen(false);
  }

  const handleDeletionOk: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {

    // request
    dispatch(
      deleteSingleCategoryActionCreator({
        categoryId: curCategory.categoryId, 
      }) 
    )
  }

  // grid event handler stuff
  const handleEditClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const categoryId = e.currentTarget.getAttribute("data-category-id")

    const targetCategory = curCategoryList.find((category: CategoryType) => category.categoryId == categoryId)

    setCategory(targetCategory);

    setFormOpen(true);

  }

  const handleDeleteClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setDeleteDialogOpen(true);

    const categoryId = e.currentTarget.getAttribute("data-category-id")

    const targetCategory = curCategoryList.find((category: CategoryType) => category.categoryId == categoryId)

    setCategory(targetCategory);
  }

  const handlePageChange = (param: GridPageChangeParams) => {
    // need to decrement since we incremented when display
    const nextPage = param.page;

    dispatch(categoryPaginationPageActions.update(nextPage))
  }

  // fetch result
  // fetch order fetching result
  const curFetchCategoryStatus = useSelector(mSelector.makeFetchCategoryFetchStatusSelector())
  if (curFetchCategoryStatus === FetchStatusEnum.FETCHING) {
    return (
      <Box className={classes.loadingBox}>
        <CircularProgress />
      </Box>
    )
  } else if (curFetchCategoryStatus === FetchStatusEnum.FAILED) {
    return (
      <Box className={classes.loadingBox}>
        <Typography variant="body1" component="h2" >
          {"failed to fetch data... please try again..."}
        </Typography>
      </Box>
    )
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
        title="Category List"
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
          rows={generateRows(curCategoryList)}
          columns={generateColumns(handleEditClick, handleDeleteClick)}
          page={pagination.page} // don't forget to increment when display
          pageSize={pagination.limit}
          rowCount={pagination.totalElements}
          onPageChange={handlePageChange}
          // not gonna use pagination of this DataGrid
        />
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
      {/** update/create category (without its variants) **/}
      <AdminCategoryFormDialog
        curFormOpen={curFormOpen}
        setFormOpen={setFormOpen}
        category={curCategory}
      />
      {/** onDelete confiramtion dialog **/}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="category-deletion-dialog"
        open={curDeleteDialogOpen}
      >
        <DialogTitle id="category-deletion-dialog">Category Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" component="p" align="left" className={null} >
            {"Do you want to delete this category permenently?"}
          </Typography>
          <Typography variant="body1" component="p" align="left" className={null} >
            Category Name: <b>{curCategory && curCategory.categoryName}</b>
          </Typography><br />
          {(curCategory && curCategory.totalProductCount > 0 &&
          <Typography variant="body2" component="p" align="left" color={"error"} className={null} >
            {"Oops, this category holds several products. come back here after you change the category of those products if you want to delete this category."}
          </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeletionCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletionOk} color="primary" disabled={curCategory && curCategory.totalProductCount > 0}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default AdminCategoryGridView





