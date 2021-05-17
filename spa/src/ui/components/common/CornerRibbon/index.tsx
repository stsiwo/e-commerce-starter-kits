import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';

declare type CornerRibbonPropsType = {
  text: string
}

/**
 * - corner ribbon compoenent (ref: https://codemyui.com/pure-css-corner-ribbons/)
 *
 * - note:
 *
 *  - please make the parent component of this component 'pisition: relative'
 *
 **/
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    /* common */
    ribbon: {
      width: '150px',
      height: '150px',
      overflow: 'hidden',
      position: 'absolute',

      '&::before, &::after': {
        position: 'absolute',
        zIndex: -1,
        content: '""', // when you enter empty char use this '""' or "''".
        display: "block",
        border: "5px solid #2980b9",
      },

      "& span": {
        position: "absolute",
        display: "block",
        width: "290px",
        padding: "6px 0",
        backgroundColor: "#3498db",
        boxShadow: "0 5px 10px rgba(0,0,0,.1)",
        color: "#fff",
        fontWeight: "bold",
        textShadow: "0 1px 1px rgba(0,0,0,.2)",
        textTransform: "uppercase",
        textAlign: "center",
      },
    },

    /* top left*/
    ribbonTopLeft:  {
      top: "-10px",
      left: "-10px",

      "&::before, &::after": {
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
      },

      "&:before": {
        top: 0,
        right: "56px",
      },

      "&::after": {
        bottom: "55px",
        left: 0,
      },

      "& span": {
        top: '22px',
        right: '-30px',
        transform: "rotate(-45deg)",
      },
    },

  }),
);

const CornerRibbon: React.FunctionComponent<CornerRibbonPropsType> = (props) => {

  const classes = useStyles();

  return (
    <div className={`${classes.ribbon} ${classes.ribbonTopLeft}`}>
      <span>{props.text}</span>
    </div>
  )
}

export default CornerRibbon





