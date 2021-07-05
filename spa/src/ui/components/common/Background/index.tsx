import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { useSpring, animated, config, useTransition, useSprings } from 'react-spring'
import { useHistory, useLocation } from 'react-router';
import BaseMorph from './BaseMorph';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backgroundBox: {
      position: "fixed",
      width: "100vw",
      height: "100vh",
      zIndex: -10,
      // this make svg center event small screen size.
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    svgBox: {
      position: "fixed",
    },
    btnBox: {
      position: "fixed",
      zIndex: 10,
      left: 0,
      bottom: 0,
    }
  }),
);

/**
 * svg basics:
 *
 * - terms:
 *  upper-letter: absolute position
 *  lower-letter: relative position
 *  M: Move To (absolute position)
 *  m: Move To (relative position)
 *  L: Draw a line (abs)
 *  l: Draw a line (rel)
 *  H: horizontal line (abs)
 *  h: horizontal line (rel)
 *  V: vertical line (abs)
 *  v: vertical line (rel)
 *  Z (or z): Close Path (abs/rel)
 *
 *  C: Bezier Curves (abs): x1 y1, x2 y2, x y
 *      - x1 and y1 => starting control point
 *      - x2 and y2 => starting control point
 *      - x and y => end point
 *  c: Bezier Curves (rel): dx1 dy1, dx2 dy2, dx dy
 *
 *  S: short version of Bezir Curves (abs): x1 y1, x y
 *  s: short version of Bezir Curves (rel): dx1 dy1, dx dy
 *    - follow to the previous 'C' or 'S' command to be the reflection of the previous one.
 *    - if the value does not follow the previous one, the value is used as the first control point.
 *
 *  Q: simple cureve (e.g., only single control point): x1 y1, x y
 *  q: simple curve: dx1 dy1, dx dy
 *
 *  T: shortcut version of Q: x y
 *  t: shortcut version of q: dx dy
 *
 *
 * note: 
 *  - when creating similar shape for morphine, don't optimize the svg path, just use original path (e.g., uncheck hide original at svg optimizer web interface). otherwise, shape collapse when morphing.
 *  - you need to keep using the original shape (svg path) for this react-spring interpolation. otherwise you get this error: The arity of each "output" value must be equal.
 *    - you can transform the shape from original one.
 *  - be sure that you set the frame in figma to the real size you want to set. (e.g., 1600 x 900)
 *
 **/

export declare type MorphPathDataType = {
  transform: string
}

export declare type MorphMapType = {
  [key: string]: MorphPathDataType
}

const morphMap: MorphMapType = {
  "/": {
    transform: "scale(1.3) rotate(0deg) translate(10%, -10%) skew(0, 0)",
  },
  "/login": {
    transform: "scale(1.5) rotate(0deg) translate(0, 0) skew(0deg, 0deg)",
  },
  "/signup": {
    transform: "scale(1.5) rotate(45deg) translate(0, 0) skew(0deg, 0deg)",
  },
}

const morphAltMap: MorphMapType = {
  "/": {
    transform: "scale(1.7) rotate(0deg) translate(0, 0) skew(0, 0)",
  },
  "/login": {
    transform: "scale(1.5) rotate(0deg) translate(0, 0) skew(0deg, 0deg)",
  },
  "/signup": {
    transform: "scale(1.5) rotate(10deg) translate(50%, 0) skew(0deg, 0deg)",
  },
}




const Background: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const location = useLocation();
  //const transitions = useTransition(location.pathname, {
  //  from: { opacity: 0 },
  //  enter: { opacity: 1 },
  //  leave: { opacity: 0 },
  //  delay: 500,
  //})

  //const springs = useSprings(morphList.length, morphList.map((morph: MorphPathDataType) => ({
  //  pathname: morph.pathname,
  //  scale: morph.scale,
  //})));

  const spring = useSpring({
    config: config.molasses,
    to: morphMap[location.pathname]
  })

  const springAlt = useSpring({
    config: config.molasses,
    to: morphAltMap[location.pathname]
  })
  return (
    <React.Fragment>
      {/**<div className={classes.backgroundBox}>
        {transitions((styles: any, item: any) => (
          <BaseMorph
            transitionStyles={styles}
            morphs={morphMap[item]}
          />
        ))}
      </div>**/}
      <div className={classes.backgroundBox}>
        <BaseMorph
          spring={spring}
          springAlt={springAlt}
        />
      </div>
    </React.Fragment>
  )
}

export default Background




