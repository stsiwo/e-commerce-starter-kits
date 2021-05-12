import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp } from '@material-ui/data-grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import Pagination from '@material-ui/lab/Pagination/Pagination';
import { getStatus } from 'domain/review';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewActionCreator, reviewPaginationPageActions } from 'reducers/slices/domain/review';
import { mSelector } from 'src/selectors/selector';
import AdminReviewFormDrawer from '../AdminReviewFormDrawer';
import { ReviewType } from 'domain/review/type';
import AdminReviewFormDialog from '../AdminReviewFormDialog';

declare type AdminReviewGridViewPropsType = {
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

const generateColumns: (onEdit: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) => GridColDef[] = (onEdit) => {
  return [
    { field: 'id', headerName: 'ID', width: 150 },
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
  
  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch()

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  // domain cur item
  const curReviewList = useSelector(mSelector.makeReviewSelector())

  // cur selected review item
  const [curReview, setReview] = React.useState<ReviewType>(null);

  const pagination = useSelector(mSelector.makeProductPaginationSelector())

  // fetch review
  React.useEffect(() => {
    dispatch(fetchReviewActionCreator())
  }, [
    pagination.page 
  ])


  const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

  // grid event handler stuff
  const handleEditClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const reviewId = e.currentTarget.getAttribute("data-review-id")

    const targetReview = curReviewList.find((review: ReviewType) => review.reviewId == reviewId)

    setReview(targetReview);

    setFormOpen(true);

  }

  // pagination event handler
  
  /**
   * TODO: make sure pagiantion working when you have more data.
   *
   **/
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {

    // need to decrement since we incremented when display
    const nextPage = value - 1;

    dispatch(reviewPaginationPageActions.update(nextPage))
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
      />
      <CardContent
        className={classes.cardContentBox}
      >
        <DataGrid
          autoHeight
          rows={generateRows(curReviewList)}
          columns={generateColumns(handleEditClick)}
          pageSize={pagination.limit}
          rowCount={pagination.limit}
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
      {/** update/create review (without its variants) **/}
      <AdminReviewFormDialog
        curFormOpen={curFormOpen}
        setFormOpen={setFormOpen}
        review={curReview}
      />
    </Card>
  )
}

export default AdminReviewGridView







