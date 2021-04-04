import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import * as React from 'react';
import AdminProductFormDrawer from '../AdminProductFormDrawer';
import AddCircleIcon from '@material-ui/icons/AddCircle';

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

const rows: GridRowsProp = [
  { id: 1, name: 'Hello Hello Hello Hello', path: 'World', unitPrice: "unit price", discount: "Discount", releaseDate: "r date", publish: "publish", variants: "3", actions: "actions" },
  { id: 2, name: 'Hello', path: 'World', unitPrice: "unit price", discount: "Discount", releaseDate: "r date", publish: "publish", variants: "4", actions: "actions" },
  { id: 3, name: 'Hello', path: 'World', unitPrice: "unit price", discount: "Discount", releaseDate: "r date", publish: "publish", variants: "2", actions: "actions" },
  { id: 4, name: 'Hello', path: 'World', unitPrice: "unit price", discount: "Discount", releaseDate: "r date", publish: "publish", variants: "1", actions: "actions" },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'unitPrice', headerName: 'Unit Price', width: 150 },
  { field: 'discount', headerName: 'Discount', width: 150 },
  { field: 'releaseDate', headerName: 'Release Date', width: 150 },
  { field: 'publish', headerName: 'Publish', width: 150 },
  { 
    field: 'variants', 
    headerName: 'Variants', 
    width: 150,
    renderCell: (params: GridCellParams) => (
      <React.Fragment>
        <Link href="">
          {params.value} 
        </Link>
      </React.Fragment>
    ),
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
        <IconButton>
          <RemoveCircleIcon />
        </IconButton>
      </React.Fragment>
    )
  },
];

/**
 * admin product management component
 *
 **/
const AdminProductGridView: React.FunctionComponent<AdminProductGridViewPropsType> = (props) => {

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
      <AdminProductFormDrawer 
        curFormOpen={curFormOpen}  
        setFormOpen={setFormOpen}
      />
    </Card>
  )
}

export default AdminProductGridView




