import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import * as React from 'react';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import { ProductImageType } from 'domain/product/types';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
    img: {
      width: "100%",
    }
  }),
);

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface CarouselPropsType {
  items: ProductImageType[]
}

/**
 * carousel component 
 *
 *  - dependency: mui only
 *
 *  - currently using 'react-slick' but use 'Stepper' in material ui
 *
 *  ref: https://material-ui.com/components/steppers/#text-with-carousel-effect
 *
 *  - or fix layout issue of 'react-slick' when iamge is full wide at small screen size
 *
 **/
const Carousel: React.FunctionComponent<CarouselPropsType> = ({ items }) => {

  const classes = useStyles();

  const length = items.length
  const [curCheckBox, setCheckBox] = React.useState<number>(0)

  const theme = useTheme();

  const handleNext = () => {
    setCheckBox((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setCheckBox((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setCheckBox(step);
  };

  const renderItems: () => React.ReactNode = () => {
    return items.map((item: ProductImageType, index: number) => {
      return (
        <div key={item.productImageId}>
            {Math.abs(curCheckBox - index) <= 2 ? (
              <img className={classes.img} src={item.productImagePath} />
            ) : null}
        </div>
      )
    })
  }

  return (
    <div className={classes.root}>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={curCheckBox}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {renderItems()}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={length}
        position="static"
        variant="text"
        activeStep={curCheckBox}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={curCheckBox === length - 1}>
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={curCheckBox === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </div>
  )
}

export default Carousel




