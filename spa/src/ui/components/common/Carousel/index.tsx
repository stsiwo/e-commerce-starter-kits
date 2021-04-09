import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import { ProductImageType } from 'domain/product/types';
import Slider from "react-slick";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center"
    },
    paper: {
      width: 400,
      height: 400,
    },
    img: {
      width: "100%",
    }
  }),
);

interface CarouselPropsType {
  items: ProductImageType[]
}

/**
 * carousel component 
 *
 *  - dependency: mui only
 *
 *  - deprecated
 *
 **/
const Carousel: React.FunctionComponent<CarouselPropsType> = ({ items }) => {

  const classes = useStyles();

  const length = items.length

  const [curCheckBox, setCheckBox] = React.useState<boolean[]>(new Array(length).fill(true))

  const renderItems: () => React.ReactNode = () => {
    return items.map((item: ProductImageType, index: number) => {
      return (
        <div className={classes.paper} key={item.productImageId}>
          <img
            src={item.productImagePath}
            className={classes.img}
          />
        </div>
      )
    })
  }

  return (
    <Slider
      dots
      infinite
      speed={500}
      slidesToShow={1}
      slidesToScroll={1}
    >
      {renderItems()}
    </Slider>
  )
}

export default Carousel




