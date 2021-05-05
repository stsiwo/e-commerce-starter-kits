import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ColorCell from 'components/common/GridData/ColorCell';
import SizeCell from 'components/common/GridData/SizeCell';
import { CartItemType } from 'domain/cart/types';
import * as React from 'react';
import SampleSelfImage from 'static/self.jpeg';
import Typography from '@material-ui/core/Typography';

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface CartItemConfirmCardPropsType {
  value: CartItemType
  onChange?: React.EventHandler<React.ChangeEvent<HTMLInputElement>>
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1)
    },
    card: {
    },
    cardHeader: {
      width: "100%",
    },
    action: {
      alignSelf: "center", 
      marginTop: 0,
      marginRight: 0,
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
const CartItemConfirmCard: React.FunctionComponent<CartItemConfirmCardPropsType> = ({ value, onChange }) => {

  // mui: makeStyles
  const classes = useStyles();

  // event handlers

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        // you can override the style of deeper element of Mui with 'classes' props
        // check the api document for your target component (e.g., CartHeader) to choose which element you are going to override
        classes={{
          action: classes.action, 
        }}
        avatar={<Avatar alt="" src={SampleSelfImage} />}
        title={value.product.productName}
        subheader={`$${value.product.productBaseUnitPrice} NEED TO FIX`}
        action={
          <Box component="div" className={classes.actionBox}>
            <ColorCell value={value.variant.variantColor} />
            <SizeCell value={value.variant.productSize.productSizeName} />
            <Typography variant="subtitle1" component="p">
              {`x${value.quantity}`}
            </Typography>
          </Box>
        }
      >
      </CardHeader>
    </Card>
  )
}

export default CartItemConfirmCard


