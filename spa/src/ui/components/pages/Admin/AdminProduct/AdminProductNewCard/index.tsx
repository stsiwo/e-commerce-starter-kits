import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AdminProductAndVariantForm from '../AdminProductAndVariantForm';

declare type AdminProductNewCardPropsType = {
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1, 0, 1, 0),
    },
    media: {
    },
    actionBox: {
      textAlign: "center"
    },
    cardContentBox: {
    }
  }),
);

/**
 * admin product management component
 *
 **/
const AdminProductNewCard: React.FunctionComponent<AdminProductNewCardPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // if a form is displayed or not
  const [curFormOpen, setFormOpen] = React.useState<boolean>(false)

  const handleNewProductFormToggleBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
    setFormOpen(!curFormOpen)
  }

  // event handler to submit
  const handleProductSaveBtnClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = async (e) => {
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
        title="New Product"
        action={
          <IconButton aria-label="add" onClick={handleNewProductFormToggleBtnClickEvent}>
            {(curFormOpen &&
              <RemoveCircleIcon />
            )}
            {(!curFormOpen &&
              <AddCircleIcon />
            )}
          </IconButton>
        }
      />
      <CardContent
        className={classes.cardContentBox}
      >
        {(curFormOpen &&
          <AdminProductAndVariantForm />
        )}
      </CardContent>
      <CardActions disableSpacing>
        {/**(curFormOpen &&
          <Button onClick={handleProductSaveBtnClickEvent}>
            Save
        </Button>
        )**/}
      </CardActions>
    </Card>
  )
}

export default AdminProductNewCard





