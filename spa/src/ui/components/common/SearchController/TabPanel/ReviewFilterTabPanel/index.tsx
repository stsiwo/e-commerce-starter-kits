import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

interface ReviewFilterTabPanelPropsType {
  curReviewPoint: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
    },
  }),
);

const ReviewFilterTabPanel: React.FunctionComponent<ReviewFilterTabPanelPropsType> = ({
  curReviewPoint
}) => {

  const marks = [
    {
      value: 0,
      label: "&#9733;",
    },
    {
      value: 1,
      label: "&#9733;",
    },
    {
      value: 2,
      label: "&#9733;",
    },
    {
      value: 3,
      label: "&#9733;",
    },
    {
      value: 4,
      label: "&#9733;",
    },
    {
      value: 5,
      label: "&starf;",
    },
  ]

  const classes = useStyles();

  const [curTempReviewPoint, setTempReviewPoint] = React.useState<number>(0);

  const handleReviewPointChangeEvent = (event: any, newValue: number ) => {
    setTempReviewPoint(newValue);
  };

  const labelReviewPoint = (value: number) => {
    return `${value}`;
  }

  return (
    <Box p={3}>
      <Typography id="discrete-slider-always" gutterBottom>
        Review Point 
      </Typography>
      <Slider
        defaultValue={curTempReviewPoint}
        getAriaValueText={labelReviewPoint}
        aria-labelledby="discrete-slider-always"
        onChange={handleReviewPointChangeEvent}
        step={1}
        marks={marks}
        valueLabelDisplay="on"
        max={5}
      />
    </Box>
  )
}

export default ReviewFilterTabPanel


