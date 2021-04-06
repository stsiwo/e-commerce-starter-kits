import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ProductType, ProductVariantType } from 'domain/product/types';
import * as React from 'react';
import SampleSelfImage from 'static/self.jpeg';
import { OrderDetailType } from 'domain/order/types';
import ColorCell from '../GridData/ColorCell';
import SizeCell from '../GridData/SizeCell';
import Box from '@material-ui/core/Box';

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface ProductHorizontalCardPropsType {
  orderDetail?: OrderDetailType
  product?: ProductType
  variant?: ProductVariantType
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1)
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
const ProductHorizontalCard: React.FunctionComponent<ProductHorizontalCardPropsType> = ({ orderDetail, product, variant }) => {

  // mui: makeStyles
  const classes = useStyles();

  const productName = (product) ? product.productName : orderDetail.productName
  const productBaseUnitPrice = (product) ? product.productBaseUnitPrice : orderDetail.productUnitPrice
  const productColor = (variant) ? variant.variantColor : orderDetail.productColor
  const productSize = (variant) ? variant.variantSize.productSizeName : orderDetail.productSize


  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Avatar alt="" src={SampleSelfImage} />}
        title={productName}
        subheader={`$${productBaseUnitPrice}`}
        action={
          <Box component="div" className={classes.actionBox}>
            <ColorCell value={productColor} />
            <SizeCell value={productSize} />
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          </Box>
        }
      >
      </CardHeader>
    </Card>
  )
}

export default ProductHorizontalCard
