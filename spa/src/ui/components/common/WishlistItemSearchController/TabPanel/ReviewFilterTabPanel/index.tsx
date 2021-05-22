import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import Rating from '@material-ui/lab/Rating/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { wishlistItemQueryReviewPointActions } from 'reducers/slices/domain/wishlistItem';
import Button from '@material-ui/core/Button';
import { mSelector } from 'src/selectors/selector';

//interface ReviewFilterTabPanelPropsType {
//  curReviewPoint: number
//}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
    contentBox: {
      display: "flex",
      alignItems: "center",
    }
  }),
);

const ReviewFilterTabPanel: React.FunctionComponent<{}> = ({
}) => {

  const classes = useStyles();

  const dispatch = useDispatch();

  const curReviewPoint = useSelector(mSelector.makeWishlistItemQueryReviewPointSelector())

  const handleReviewPointChangeEvent = (event: any, newValue: number) => {
    dispatch(wishlistItemQueryReviewPointActions.update(newValue))
  };

  const handleReset: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    dispatch(wishlistItemQueryReviewPointActions.clear())
  }

  return (
    <Box p={3}>
      <Typography id="discrete-slider-always" gutterBottom>
        Review Point
      </Typography>
      <Box className={classes.contentBox}>
        <Rating
          name="wishlistItem-filter-review-point"
          onChange={handleReviewPointChangeEvent}
          precision={0.5}
          value={curReviewPoint}
        />
        <Button onClick={handleReset}>
          Reset
      </Button>
      </Box>
    </Box>
  )
}

export default ReviewFilterTabPanel


