import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';

interface ProductTotalPropsType {
  subtotalAmount: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: "flex",
      flexWrap: "nowrap"
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
    },
    details: {
      flexGrow: 1,
    },
    media: {
      width: 200,
    }
  }),
);

const ProductTotal: React.FunctionComponent<ProductTotalPropsType> = ({ subtotalAmount }) => {

  const classes = useStyles();

  /**
   * what is difference btw <CardActionArea> and <CardActions>
   **/

  return (
   <div></div> 
  )
}

export default ProductTotal






