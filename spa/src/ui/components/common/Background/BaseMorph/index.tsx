import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { animated, useSpring } from "react-spring";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backgroundBox: {
      position: "fixed",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: -10,
    },
    svgBox: {
      position: "fixed",
    },
    btnBox: {
      position: "fixed",
      zIndex: 10,
      left: 0,
      bottom: 0,
    },
  })
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
 *
 *
 *
 **/

declare type BaseMorphDataType = {
  path: string;
  pathAlt: string;
  fill: string;
};

const baseMorphDataList: BaseMorphDataType[] = [
  {
    fill: "#75CFB8", // right small shape
    path: "M1560 641.492C1560 787.858 1388.35 875 1187.1 875C985.846 875 755 787.858 755 641.492C755 494.281 985.846 287 1187.1 287C1388.35 287 1560 494.281 1560 641.492Z",
    pathAlt:
      "M1570 529C1570 675.365 1438.25 855.5 1237 855.5C1035.75 855.5 559 738.865 559 592.5C559 445.288 957.846 205.5 1159.1 205.5C1360.35 205.5 1570 381.788 1570 529Z",
  },
  {
    fill: "#BBDFC8", // left bigger shape
    path: "M88.5 229.5C133.337 109 227.5 104.487 303.5 97C471 80.5002 705.981 88.6118 809 137C908 183.5 979.334 305.834 999 367C1024 437.334 1035.4 600 999 668C953.5 753 864 829.5 727 838.5C590 847.5 375 865 284 838.5C193 812 108.5 743 70 668C33.5056 596.907 48.5 337 88.5 229.5Z",
    pathAlt:
      "M72.4999 159C117.337 38.5002 245 39.9286 259.5 38.5003C427 22.0004 637.98 20.6121 741 69.0004C840 115.501 902.833 226.334 922.5 287.5C947.5 357.834 945.4 506 909 574C863.5 659 817 726.5 680 735.5C543 744.5 336 762 245 735.5C154 709 111 665.285 72.5 590.285C36.0056 519.192 32.5 266.5 72.4999 159Z",
  },
];
declare type BaseMorphPropsType = {
  spring: any;
  springAlt: any;
};

const BaseMorph: React.FunctionComponent<BaseMorphPropsType> = (props) => {
  const classes = useStyles();

  const spring = useSpring({
    from: { x: 0 },
    config: {
      duration: 10000,
    },
    to: async (next: any) => {
      while (1) {
        await next({ x: 1 });
        await next({ x: 0 });
      }
    },
  });

  return (
    <React.Fragment>
      <animated.svg
        style={props.spring}
        className={classes.svgBox}
        //preserveAspectRatio="xMidYMid slice"
        width="1600"
        height="100%"
        viewBox="0 0 1600 900"
      >
        <animated.path
          fill={baseMorphDataList[0].fill}
          d={spring.x.to({
            range: [0, 1],
            output: [baseMorphDataList[0].path, baseMorphDataList[0].pathAlt],
          })}
        />
      </animated.svg>
      <animated.svg
        style={props.springAlt}
        className={classes.svgBox}
        //preserveAspectRatio="xMidYMid slice"
        width="1600"
        height="100%"
        viewBox="0 0 1600 900"
      >
        <animated.path
          fill={baseMorphDataList[1].fill}
          d={spring.x.to({
            range: [0, 1],
            output: [baseMorphDataList[1].path, baseMorphDataList[1].pathAlt],
          })}
        />
      </animated.svg>
    </React.Fragment>
  );
};

export default BaseMorph;
