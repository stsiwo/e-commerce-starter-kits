import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ProductType, ProductVariantType } from 'domain/product/types';
import * as React from 'react';
import { getApiUrl } from 'src/utils';
import ColorCell from '../GridData/ColorCell';
import SizeCell from '../GridData/SizeCell';

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface ProductHorizontalCardPropsType {
  product?: ProductType
  variant?: ProductVariantType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: `${theme.spacing(1)}px auto`,
      maxWidth: 700,
    },
    card: {
      display: "flex",
      flexWrap: "nowrap"
    },
    cardHeader: {
      width: "100%",
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
    },
    actionBox: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "nowrap",
      alignItems: "center",
    }
  }),
);

/**
 * member or admin account management component
 **/
const ProductHorizontalCard: React.FunctionComponent<ProductHorizontalCardPropsType> = ({ product, variant }) => {

  // mui: makeStyles
  const classes = useStyles();

  /**
   * if the product is available (e.g., not null), display teh primary image.
   **/
  const primaryImageUrl = (product && product.productImages.length > 0) ? getApiUrl(product.productImages[0].productImagePath) : null

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Avatar alt="" src={primaryImageUrl} />}
        title={product.productName}
        action={
          <Box component="div" className={classes.actionBox}>
            <ColorCell value={variant.variantColor} />
            <SizeCell value={variant.productSize.productSizeName} />
          </Box>
        }
      >
      </CardHeader>
    </Card>
  )
}

export default ProductHorizontalCard
