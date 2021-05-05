import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AdminProductVariantGridView from './AdminProductVariantGridView';
import AdminProductVariantFormDrawer from './AdminProductVariantDrawer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      flexGrow: 1,
      padding: theme.spacing(0, 1),
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2)
    },
    gridContainer: {
      padding: theme.spacing(1),

      /**[theme.breakpoints.down("md")]: {
        flexDirection: 'column-reverse',
      }**/
    },
    gridItem: {
      // setting margin breaks <Grid xs, md, lg > system
      // so use 'padding' instead
      padding: theme.spacing(1) 
    }
  }),
);

/**
 * admin account management page
 *
 **/
const AdminProductVariant: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const [curFormOpen, setFormOpen] = React.useState<boolean>(false) 

  return (
    <Box component="div" className={classes.box}>
      <Typography variant="body2" component="p" align="left" className={classes.title} >
        {"Product Variants"}
      </Typography>
      <AdminProductVariantGridView 
        curFormOpen={curFormOpen} 
        setFormOpen={setFormOpen} 
      />
      {/** <AdminProductVariantNewCard /> **/}
    </Box>
  )
}

export default AdminProductVariant

