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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { useHistory } from 'react-router';

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface ProductHorizontalCardPropsType {
  orderDetail?: OrderDetailType
  product?: ProductType
  variant?: ProductVariantType
  menu?: React.ReactElement 
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
const ProductHorizontalCard: React.FunctionComponent<ProductHorizontalCardPropsType> = ({ orderDetail, product, variant, menu }) => {

  // mui: makeStyles
  const classes = useStyles();

  const history = useHistory()

  const auth = useSelector(mSelector.makeAuthSelector());

  const productName = (product) ? product.productName : orderDetail.productName
  const productBaseUnitPrice = (product) ? product.productBaseUnitPrice : orderDetail.productUnitPrice
  const productColor = (variant) ? variant.variantColor : orderDetail.productColor
  const productSize = (variant) ? variant.productSize.productSizeName : orderDetail.productSize

  console.log(menu)

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
            {menu}
          </Box>
        }
      >
      </CardHeader>
    </Card>
  )
}

export default ProductHorizontalCard
