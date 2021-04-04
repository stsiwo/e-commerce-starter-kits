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

const rows: GridRowsProp = [
  { id: 1, size: 'M', color: '#fff', price: "unit price", stock: "stock", discount: "discount", soldCount: "3", actions: "actions" },
  { id: 2, size: 'SM', color: '#000', price: "unit price", stock: "stock", discount: "discount", soldCount: "3", actions: "actions" },
  { id: 3, size: 'L', color: '#000', price: "unit price", stock: "stock", discount: "discount", soldCount: "3", actions: "actions" },
];

const columns: GridColDef[] = [
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
  { field: 'price', headerName: 'Unit Price', width: 150 },
  { field: 'stock', headerName: 'Stock #', width: 150 },
  { field: 'discount', headerName: 'Discount', width: 150 },
  { field: 'soldCount', headerName: 'Sold #', width: 150 },
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
 * admin product variant management component
 *
 **/
const AdminProductVariantGridView: React.FunctionComponent<AdminProductVariantGridViewPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  const handleNewProductVariantFormToggleBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    props.setFormOpen(!props.curFormOpen)
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
          rows={rows}
          columns={columns}
        />
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
    </Card>
  )
}

export default AdminProductVariantGridView





