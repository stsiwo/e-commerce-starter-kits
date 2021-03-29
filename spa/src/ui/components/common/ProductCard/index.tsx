import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import SampleProduct1_1Image from 'static/sample-product-1-1.jpg';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
    },
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: '100%',
      marginTop: '30'
    }
  }),
);

const ProductCard: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  /**
   * what is difference btw <CardActionArea> and <CardActions>
   **/

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={SampleProduct1_1Image}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Category
        </Typography>
        <Typography gutterBottom variant="h5" component="h2">
          Product Name
        </Typography>
        <Typography variant="body2" color="primary" component="p">
          Product Description
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button>
          Read More 
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard




