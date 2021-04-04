import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@material-ui/data-grid';

declare type AdminProductGridViewPropsType = {
  curProductFormOpen: boolean
  setProductFormOpen: React.Dispatch<React.SetStateAction<boolean>>
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
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'XGrid', col2: 'is Awesome' },
  { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

/**
 * admin product management component
 *
 **/
const AdminProductGridView: React.FunctionComponent<AdminProductGridViewPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // event handler to submit
  const handleAddNewProductBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    console.log("passed")
    props.setProductFormOpen(true)
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
        title="Product List"
      />
      <CardContent
        className={classes.cardContentBox}
      >
        <DataGrid rows={rows} columns={columns} />
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
    </Card>
  )
}

export default AdminProductGridView




