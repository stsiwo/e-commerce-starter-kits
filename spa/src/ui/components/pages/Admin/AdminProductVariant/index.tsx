import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import AdminProductVariantGridView from './AdminProductVariantGridView';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      flexGrow: 1,
      padding: theme.spacing(0, 1),
      /**
       * this is necessary for scrollable tabs (from Mui) used for filter/sort for each domain.
       **/
      width: "100%",
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
      <AdminProductVariantGridView 
        curFormOpen={curFormOpen} 
        setFormOpen={setFormOpen} 
      />
      {/** <AdminProductVariantNewCard /> **/}
    </Box>
  )
}

export default AdminProductVariant

