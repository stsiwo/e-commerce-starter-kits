import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ProductType } from 'domain/product/types';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductWithCacheActionCreator } from 'reducers/slices/domain/product';
import { mSelector } from 'src/selectors/selector';
import ProductCard from '../ProductCard';
import { Link as RRLink } from "react-router-dom";

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

  const dispatch = useDispatch();

  const curDomains = useSelector(mSelector.makeProductSelector())

  // fetch new blogs only once
  React.useEffect(() => {
    dispatch(fetchProductWithCacheActionCreator())
  }, [])

  const renderDomains: () => React.ReactNode = () => {
    return curDomains.map((product: ProductType) => {
      return (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          className={classes.item}
          key={product.productId}
        >
          <ProductCard product={product} />
        </Grid>
      )
    });
  }

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
        {(curDomains.length === 0 &&
          <Typography variant="body1" component="p" align="center" >
            {"No Available Products For Now."}
          </Typography>
        )}
        {renderDomains()}
      </Grid>
      <Box component="div" className={classes.moreBtnBox}>
        <Button component={RRLink} to={`/search`}>
          More Brad New Products
        </Button>
      </Box>
    </Box>
  )
}

export default BrandNewProduct



