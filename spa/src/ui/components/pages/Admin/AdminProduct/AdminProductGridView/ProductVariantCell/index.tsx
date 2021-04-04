import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { ProductVariantType } from 'domain/product/types';
import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';

declare type ProductVariantCellPropsType = {
  variant: ProductVariantType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "center",
      alignItems: "center",
    },
    colorBox: {
      boxShadow: theme.shadows[3],
      width: 25,
      height: 25,
      margin: theme.spacing(0, 1),
    },
    sizeBox: {
      boxShadow: theme.shadows[3],
      width: 25,
      height: 25,
      margin: theme.spacing(0, 1),
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

/**
 * admin product management component
 *
 **/
const ProductVariantCell: React.FunctionComponent<ProductVariantCellPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  return (
    <Box component="div" className={classes.root}>
      <Avatar 
        className={classes.colorBox}
        style={{
          backgroundColor: props.variant.variantColor,
        }}
      >
        {""} 
      </Avatar>
      <Avatar 
        className={classes.sizeBox}
      >
        {props.variant.variantSize.productSizeName}
      </Avatar>
      <IconButton>
        <RemoveCircleIcon />
      </IconButton>
    </Box >
  )
}

export default ProductVariantCell
