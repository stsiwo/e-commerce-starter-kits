import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import Rating from '@material-ui/lab/Rating/Rating';
import { useDispatch } from 'react-redux';
import { productQueryReviewPointActions } from 'reducers/slices/domain/product';

interface ReviewFilterTabPanelPropsType {
  curReviewPoint: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

/**
 *  TODO: use this one: https://material-ui.com/components/rating/
 **/

const ReviewFilterTabPanel: React.FunctionComponent<ReviewFilterTabPanelPropsType> = ({
  curReviewPoint
}) => {

  const classes = useStyles();

  const dispatch = useDispatch();

  const handleReviewPointChangeEvent = (event: any, newValue: number) => {
    dispatch(productQueryReviewPointActions.update(newValue))
  };

  return (
    <Box p={3}>
      <Typography id="discrete-slider-always" gutterBottom>
        Review Point
      </Typography>
      <Rating
        name="product-filter-review-point"
        onChange={handleReviewPointChangeEvent}
        precision={0.5}
        value={curReviewPoint}
      />
    </Box>
  )
}

export default ReviewFilterTabPanel


