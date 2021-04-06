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
import * as React from 'react';
import AdminReviewFormDrawer from '../AdminReviewFormDrawer';

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

const rows: GridRowsProp = [
  { id: 1, number: '12343', user: 'World', product: 'World', reviewPoint: "1", status: "pending", ations: "actions" },
  { id: 2, number: '12343', user: 'World', product: 'World', reviewPoint: "1", status: "pending", ations: "actions" },
  { id: 3, number: '12343', user: 'World', product: 'World', reviewPoint: "1", status: "pending", ations: "actions" },
  { id: 4, number: '12343', user: 'World', product: 'World', reviewPoint: "1", status: "pending", ations: "actions" },
  { id: 5, number: '12343', user: 'World', product: 'World', reviewPoint: "1", status: "pending", ations: "actions" },
  { id: 6, number: '12343', user: 'World', product: 'World', reviewPoint: "1", status: "pending", ations: "actions" },
  { id: 7, number: '12343', user: 'World', product: 'World', reviewPoint: "1", status: "pending", ations: "actions" },
  { id: 8, number: '12343', user: 'World', product: 'World', reviewPoint: "1", status: "pending", ations: "actions" },
  { id: 9, number: '12343', user: 'World', product: 'World', reviewPoint: "1", status: "pending", ations: "actions" },
];

const columns: GridColDef[] = [
  { field: 'number', headerName: '#', width: 150 },
  { field: 'user', headerName: 'User', width: 150 },
  { field: 'product', headerName: 'Product', width: 150 },
  { field: 'reviewPoint', headerName: 'Review Point', width: 150 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'actions', headerName: 'Actions', width: 150 },
  { 
    field: 'actions', 
    headerName: 'Actions', 
    width: 150, 
    renderCell: (params: GridCellParams) => (
      <React.Fragment>
        <IconButton>
          <EditIcon />
        </IconButton>
      </React.Fragment>
    )
  },
];

/**
 * admin product management component
 *
 **/
const AdminReviewGridView: React.FunctionComponent<AdminReviewGridViewPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

  const handleNewFormToggleBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    setFormOpen(!curFormOpen)
  }

  // event handler to submit
  const handleAddNewProductBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    console.log("passed")
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
          rows={rows} 
          columns={columns} 
      />
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
      <AdminReviewFormDrawer 
        curFormOpen={curFormOpen}  
        setFormOpen={setFormOpen}
      />
    </Card>
  )
}

export default AdminReviewGridView







