import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import ProductCard from '../ProductCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      // need to set this. otherwise, <Grid spacing={x}> causes overflow horizontally.
      // ref: https://material-ui.com/components/grid/#limitations
      overflow: "hidden",
      padding: theme.spacing(0, 1, 0, 1),
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    item: {
    },
    moreBtnBox: {
      margin: theme.spacing(3),
      display: "flex",
      justifyContent: "center",
    },
  }),
);

const BrandNewProduct: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  return (
    <Box component="section" className={classes.section} >
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Brand New"}
      </Typography>
      <Grid 
        container
        spacing={2}
        justify="center"
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          className={classes.item} 
        >
          <ProductCard />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          className={classes.item} 
        >
          <ProductCard />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          className={classes.item} 
        >
          <ProductCard />
        </Grid>
      </Grid>
      <Box component="div" className={classes.moreBtnBox}>
        <Button>
          More Brad New Products
        </Button>
      </Box>
    </Box>
  )
}

export default BrandNewProduct



