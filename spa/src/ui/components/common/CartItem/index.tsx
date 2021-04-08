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
import { CartItemType } from 'domain/cart/types';
import CardActions from '@material-ui/core/CardActions';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Switch from '@material-ui/core/Switch';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface CartItemPropsType {
  value: CartItemType
  onChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>>
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
const CartItem: React.FunctionComponent<CartItemPropsType> = ({ value, onChange }) => {

  // mui: makeStyles
  const classes = useStyles();

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Avatar alt="" src={SampleSelfImage} />}
        title={value.product.productName}
        subheader={`$${value.product.productBaseUnitPrice} NEED TO FIX`}
      >
      </CardHeader>
      <CardActions>
        <Grid
          container
          justify="space-between"
        >
          <Box component="div" className={classes.actionBox}>
            <ColorCell value={value.variant.variantColor} />
            <SizeCell value={value.variant.variantSize.productSizeName} />
          </Box>
          <Box component="div" className={classes.actionBox}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <IconButton>
                <AddCircleIcon />
              </IconButton>
              <Button disabled>3</Button>
              <IconButton>
                <RemoveCircleIcon />
              </IconButton>
            </ButtonGroup>
            <Switch
              edge="end"
              onChange={onChange}
              checked={value.isSelected}
              inputProps={{ 'aria-labelledby': 'switch-list-label-selected-cart-item' }}
            />
            <IconButton>
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        </Grid>
      </CardActions>
    </Card>
  )
}

export default CartItem

