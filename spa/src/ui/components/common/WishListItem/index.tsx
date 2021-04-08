import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { WishListItemType } from 'domain/wishlist/types';
import * as React from 'react';
import SampleSelfImage from 'static/self.jpeg';
import ColorCell from '../GridData/ColorCell';
import SizeCell from '../GridData/SizeCell';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

/**
 * need 'orderDetail' or 'product/variant'
 *
 **/
interface WishListItemPropsType {
  value: WishListItemType
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
const WishListItem: React.FunctionComponent<WishListItemPropsType> = ({ value, onChange }) => {

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
            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
            >
              Move To Cart
            </Button>
            <IconButton>
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        </Grid>
      </CardActions>
    </Card>
  )
}

export default WishListItem


