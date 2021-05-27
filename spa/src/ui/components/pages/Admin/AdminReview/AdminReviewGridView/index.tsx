import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { DataGrid, GridCellParams, GridColDef, GridPageChangeParams, GridRowsProp } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { getStatus } from 'domain/review';
import { ReviewType } from 'domain/review/type';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSingleReviewActionCreator, fetchReviewActionCreator, reviewPaginationPageActions } from 'reducers/slices/domain/review';
import { FetchStatusEnum } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import AdminReviewFormDialog from '../AdminReviewFormDialog';
import AdminReviewSearchController from '../AdminReviewSearchController';

declare type AdminReviewGridViewPropsType = {
}



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(4),
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

const generateRows: (domains: ReviewType[]) => GridRowsProp = (domains) => {
  return domains.map((domain: ReviewType) => {
    return {
      id: domain.reviewId,
      title: domain.reviewTitle,
      date: domain.createdAt,
      user: domain.user.firstName + " " + domain.user.lastName,
      product: domain.product.productName,
      reviewPoint: domain.reviewPoint,
      status: getStatus(domain.isVerified),
      actions: domain.reviewId,
    }
  })
}

const generateColumns: (onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>, onDelete: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => GridColDef[] = (onEdit, onDelete) => {
  return [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'user', headerName: 'User', width: 150 },
    { field: 'product', headerName: 'Product', width: 150 },
    { field: 'reviewPoint', headerName: 'Review Point', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <React.Fragment>
          <IconButton data-review-id={params.value} onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton data-review-id={params.value} onClick={onDelete}>
            <RemoveCircleIcon />
          </IconButton>
        </React.Fragment>
      )
    },
  ];
}

/**
 * admin product management component
 *
 **/
const AdminReviewGridView: React.FunctionComponent<AdminReviewGridViewPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();
  
  const dispatch = useDispatch()

  // domain cur item
  const curReviewList = useSelector(mSelector.makeReviewSelector())

  // cur selected review item
  const [curReviewId, setReviewId] = React.useState<string>(null);

  const pagination = useSelector(mSelector.makeProductPaginationSelector())

  const curQueryString = useSelector(mSelector.makeReviewQuerySelector())

  // fetch review
  React.useEffect(() => {
    console.log("this is called?")
    dispatch(fetchReviewActionCreator())
  }, [
    JSON.stringify(curQueryString),
    pagination.page 
  ])


  const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

  // deletion dialog stuff
  const [curDeleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

  const handleDeletionCancel: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {
    setDeleteDialogOpen(false);
  }

  const handleDeletionOk: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {

    // request
    dispatch(
      deleteSingleReviewActionCreator({ reviewId: curReviewId }) 
    )
  }

  // grid event handler stuff
  const handleEditClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const reviewId = e.currentTarget.getAttribute("data-review-id")

    console.log("target reveiw to be edit: " + reviewId)

    setReviewId(reviewId);

    setFormOpen(true);

  }

  const handleDeleteClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    setDeleteDialogOpen(true);

    const reviewId = e.currentTarget.getAttribute("data-review-id")
    setReviewId(reviewId);
  }

  // pagination event handler
  const handlePageChange = (param: GridPageChangeParams) => {
    // need to decrement since we incremented when display
    const nextPage = param.page;

    dispatch(reviewPaginationPageActions.update(nextPage))
  }

  
  // fetch result
  // fetch order fetching result
  const curFetchReviewStatus = useSelector(mSelector.makeFetchReviewFetchStatusSelector())
  if (curFetchReviewStatus === FetchStatusEnum.FETCHING) {
    return (
      <Box className={classes.loadingBox}>
        <CircularProgress />
      </Box>
    )
  } else if (curFetchReviewStatus === FetchStatusEnum.FAILED) {
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
        title="Review List"
      />
      <CardContent
        className={classes.cardContentBox}
      >
        <AdminReviewSearchController />
        <DataGrid
          rows={generateRows(curReviewList)}
          columns={generateColumns(handleEditClick, handleDeleteClick)}
          page={pagination.page} // don't forget to increment when display
          pageSize={pagination.limit}
          rowCount={pagination.totalElements}
          onPageChange={handlePageChange}
        />
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
      {/** update/create review (without its variants) **/}
      <AdminReviewFormDialog
        curFormOpen={curFormOpen}
        setFormOpen={setFormOpen}
        review={curReviewList.find((review: ReviewType) => review.reviewId == curReviewId)}
      />
      {/** onDelete confiramtion dialog **/}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="review-deletion-dialog"
        open={curDeleteDialogOpen}
      >
        <DialogTitle id="review-deletion-dialog">Product Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" component="p" align="left" className={null} >
            {"Do you want to delete this review permenently?"}
          </Typography>
          <Typography variant="body1" component="p" align="left" className={null} >
            Review ID: <b>{curReviewList.find((review: ReviewType) => review.reviewId == curReviewId) && curReviewList.find((review: ReviewType) => review.reviewId == curReviewId).reviewId}</b>
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

export default AdminReviewGridView







