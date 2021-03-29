import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { AuthType, UserTypeEnum } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ProductCard from '../ProductCard';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      // need to set this. otherwise, <Grid spacing={x}> causes overflow horizontally.
      // ref: https://material-ui.com/components/grid/#limitations
      overflow: "hidden"
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
        spacing={5}
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



