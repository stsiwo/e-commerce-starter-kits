import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import SampleProduct1_1Image from 'static/sample-product-1-1.jpg';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

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

const CategoryCard: React.FunctionComponent<{}> = (props) => {

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
      <Box component="div" className={classes.details}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Category Name
          </Typography>
          <Typography variant="body2" color="primary" component="p">
            Category Description
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button variant="contained">
            Read More
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}

export default CategoryCard





