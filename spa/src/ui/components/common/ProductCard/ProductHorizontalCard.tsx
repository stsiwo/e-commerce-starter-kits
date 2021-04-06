import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ProductType } from 'domain/product/types';
import * as React from 'react';
import SampleSelfImage from 'static/self.jpeg';
import { OrderDetailType } from 'domain/order/types';
import ColorCell from '../GridData/ColorCell';
import SizeCell from '../GridData/SizeCell';
import Box from '@material-ui/core/Box';


interface ProductHorizontalCardPropsType {
  orderDetail: OrderDetailType
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
const ProductHorizontalCard: React.FunctionComponent<ProductHorizontalCardPropsType> = ({ orderDetail }) => {

  // mui: makeStyles
  const classes = useStyles();

  return (
    <Card className={`${classes.card} ${classes.root}`}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Avatar alt="" src={SampleSelfImage} />}
        title={orderDetail.productName}
        subheader={orderDetail.productUnitPrice}
        action={
          <Box component="div" className={classes.actionBox}>
            <ColorCell value={orderDetail.productColor} />
            <SizeCell value={orderDetail.productSize} />
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
