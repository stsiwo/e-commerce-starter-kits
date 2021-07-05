import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { useSpring, animated, config, useTransition } from 'react-spring'
import { useLocation } from 'react-router';
import { MorphPathDataType } from '..';


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
 *
 *
 *
 **/

declare type BaseMorphDataType = {
  path: string
  pathAlt: string
  fill: string
}

const baseMorphDataList: BaseMorphDataType[] = [
  {
    fill: "#75CFB8",
    path: "M485.593 465.183C522.229 400.522 672.913 314.202 861.127 349.059C1041.71 382.502 1169.82 319.755 1209.96 293.635C1260.93 261.146 1382.94 218.144 1463.22 306.058C1563.57 415.95 1595.11 561.198 1567.4 703.58C1539.68 845.961 1434.55 873.673 1289.29 870.806C1144.02 867.94 692.027 837.86 574.414 775.248C430.296 698.526 422.577 566.019 485.593 465.183Z",
    pathAlt: "M547.247 430.054C581.613 369.413 719.435 315.812 895.992 348.502C1065.39 379.866 1189.1 293.667 1226.75 269.171C1274.57 238.701 1389.02 198.374 1464.33 280.821C1558.46 383.881 1556.67 496.799 1530.67 630.328C1504.67 763.858 1413.28 856.632 1277.01 853.943C1140.74 851.255 754.399 743.286 644.071 684.567C508.878 612.614 488.133 524.62 547.247 430.054Z",
  },
  {
    fill: "#BBDFC8",
    path: "M96.5639 90.1627C129.567 63.7889 165.301 32.1047 268.179 44.9506C353.986 55.6649 422.82 76.9758 479.397 116.536C535.973 156.097 623.92 244.984 447.337 277.604C309.668 303.036 243.662 301.152 129.567 268.185C56.9605 240.87 19.6202 162.502 96.5639 90.1627Z",
    pathAlt: "M147.94 113.596C182.982 85.4796 260.076 59.3713 370.21 92.5088C458.157 118.971 590.477 147.738 608.499 184.892C626.521 222.046 612.504 257.192 496.363 300.371C356.975 352.193 337.17 377.979 216.022 342.834C138.929 313.713 66.2403 190.716 147.94 113.596Z",
  }
]

declare type BaseMorphPropsType = {
  spring: any
  springAlt: any
}


const BaseMorph: React.FunctionComponent<BaseMorphPropsType> = (props) => {

  const classes = useStyles();

  const spring = useSpring({
    from: { x: 0 },
    config: {
      duration: 10000,
    },
    to: async (next: any) => {
      while (1) {
        await next({ x: 1 })
        await next({ x: 0 })
      }
    }
  })

  return (
    <React.Fragment>
      <animated.svg
        style={props.spring}
        className={classes.svgBox}
        //preserveAspectRatio="xMidYMid slice"
        width="1600"
        height="100%"
        viewBox="0 0 1600 900">
        <animated.path
          fill={baseMorphDataList[0].fill}
          d={spring.x.to({
            range: [0, 1],
            output: [
              baseMorphDataList[0].path,
              baseMorphDataList[0].pathAlt
            ],
          })}
        />
      </animated.svg>
      <animated.svg
        style={props.springAlt}
        className={classes.svgBox}
        //preserveAspectRatio="xMidYMid slice"
        width="1600"
        height="100%"
        viewBox="0 0 1600 900">
        <animated.path
          fill={baseMorphDataList[1].fill}
          d={spring.x.to({
            range: [0, 1],
            output: [
              baseMorphDataList[1].path,
              baseMorphDataList[1].pathAlt
            ],
          })}
        />
      </animated.svg>
    </React.Fragment>
  )
}

export default BaseMorph
