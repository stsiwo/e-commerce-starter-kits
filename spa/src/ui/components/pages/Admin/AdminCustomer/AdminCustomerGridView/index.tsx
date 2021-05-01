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
import AdminCustomerFormDrawer from '../AdminCustomerFormDrawer';
import Link from '@material-ui/core/Link';
import { Link as RRLink } from "react-router-dom";


declare type AdminCustomerGridViewPropsType = {
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
  { id: 1, avatar: "avatar", name: '12343', email: 'World', type: 'World', status: "1", orders: 3, reviews: 1, actions: "actions" },
  { id: 2, avatar: "avatar", name: '12343', email: 'World', type: 'World', status: "1", orders: 3, reviews: 1, actions: "actions" },
  { id: 3, avatar: "avatar", name: '12343', email: 'World', type: 'World', status: "1", orders: 3, reviews: 1, actions: "actions" },
  { id: 4, avatar: "avatar", name: '12343', email: 'World', type: 'World', status: "1", orders: 3, reviews: 1, actions: "actions" },
  { id: 5, avatar: "avatar", name: '12343', email: 'World', type: 'World', status: "1", orders: 3, reviews: 1, actions: "actions" },
  { id: 6, avatar: "avatar", name: '12343', email: 'World', type: 'World', status: "1", orders: 3, reviews: 1, actions: "actions" },
  { id: 7, avatar: "avatar", name: '12343', email: 'World', type: 'World', status: "1", orders: 3, reviews: 1, actions: "actions" },
  { id: 8, avatar: "avatar", name: '12343', email: 'World', type: 'World', status: "1", orders: 3, reviews: 1, actions: "actions" },
  { id: 9, avatar: "avatar", name: '12343', email: 'World', type: 'World', status: "1", orders: 3, reviews: 1, actions: "actions" },
];

const columns: GridColDef[] = [
  { field: 'avatar', headerName: "Avatar", width: 150 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 150 },
  { field: 'type', headerName: 'Type', width: 150 },
  { field: 'status', headerName: 'Status', width: 150 },
  { 
    field: 'orders', 
    headerName: 'Orders', 
    width: 150,
    renderCell: (params: GridCellParams) => (
      <Link component={RRLink} to="/">
      {params.value}
      </Link >
    )
  },
  { 
    field: 'reviews', 
    headerName: 'Reviews', 
    width: 150,
    renderCell: (params: GridCellParams) => (
      <Link component={RRLink} to="/">
        {params.value}
      </Link >
    )
  },
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
const AdminCustomerGridView: React.FunctionComponent<AdminCustomerGridViewPropsType> = (props) => {

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
      <AdminCustomerFormDrawer 
        curFormOpen={curFormOpen}  
        setFormOpen={setFormOpen}
      />
    </Card>
  )
}

export default AdminCustomerGridView
