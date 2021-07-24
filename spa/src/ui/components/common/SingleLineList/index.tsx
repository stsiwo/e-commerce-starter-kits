import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { classnames } from "@material-ui/data-grid";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { useResponsive } from "hooks/responsive";
import * as React from "react";

declare type SingleLineListPropsType = {
  renderDomainFunc: () => React.ReactNode;
  wrapperClassName?: string;
  outerClassName?: string;
  innerClassName?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {},
    outerBox: {
      position: "relative",
      padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
      maxWidth: theme.breakpoints.values.lg,
      width: "90vw",
      minWidth: 310,
    },
    innerBox: {
      display: "flex",
      flexWrap: "nowrap",
      overflow: "auto",

      /* hide scroll (horizontal) bar */
      scrollbarWidth: "none" /* Firefox */,
      "-ms-overflow-style": "none" /* Internet Explorer 10+ */,

      "&::-webkit-scrollbar": {
        /* WebKit */ width: 0,
        height: 0,
      },

      /* set list item flex-basic otherwise it shrinks. */
      "& > *": {
        flex: "0 0 300px",
        margin: 5,
      },
    },
    btnBox: {
      position: "absolute",
      top: 0,
      bottom: 0,
      margin: "auto",
      backgroundColor: "transparent",
      transition: "all 1s",
    },
    leftBtnBox: {
      left: 0,
    },
    rightBtnBox: {
      right: 0,
    },
    btn: {
      position: "relative",
      top: "50%",
      bottom: "50%",
      transform: "translateY(-50%)",
    },
    leftBtn: {},
    rightBtn: {},
  })
);

/**
 *
 **/
const SingleLineList: React.FunctionComponent<SingleLineListPropsType> = (
  props
) => {
  const classes = useStyles();

  /**
   * scroll feature
   **/
  const innerBoxRef = React.useRef<HTMLDivElement>();
  const outerBoxRef = React.useRef<HTMLDivElement>();

  /**
   * event handler when click left arrow
   **/
  const handleLeftArrowIconClickEvent: React.EventHandler<
    React.MouseEvent<HTMLElement>
  > = React.useCallback(
    (e) => {
      if (innerBoxRef.current) {
        innerBoxRef.current.scrollBy({
          behavior: "smooth",
          left: -300,
        });
      }
    },
    [innerBoxRef]
  );

  /**
   * event handler when click right arrow
   **/
  const handleRightArrowIconClickEvent: React.EventHandler<
    React.MouseEvent<HTMLElement>
  > = React.useCallback(
    (e) => {
      if (innerBoxRef.current) {
        innerBoxRef.current.scrollBy({
          behavior: "smooth",
          left: 300,
        });
      }
    },
    [innerBoxRef]
  );

  /**
   * side effect to close unnecessary arrows
   *
   *  - if scrollbar, need to show arrows, otherwise, no arrows
   *  - ref: https://stackoverflow.com/questions/4880381/check-whether-html-element-has-scrollbars
   **/
  const responsive = useResponsive();
  const [isNeedArrows, setNeedArrows] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (outerBoxRef.current && innerBoxRef.current) {
      console.log("inner box scroll width: " + innerBoxRef.current.scrollWidth);
      console.log("inner box client width: " + innerBoxRef.current.clientWidth);
      console.log("are arrows need?");
      if (innerBoxRef.current.scrollWidth > innerBoxRef.current.clientWidth) {
        console.log("yes");
        // need to have scroll
        setNeedArrows(true);
      } else {
        console.log("no");
        // don't need it
        setNeedArrows(false);
      }
    }
  }, [
    outerBoxRef,
    innerBoxRef,
    ...(innerBoxRef.current ? [innerBoxRef.current.scrollWidth] : []),
    ...(innerBoxRef.current ? [innerBoxRef.current.clientWidth] : []),
    isNeedArrows,
    responsive.currentScreenWidth,
    setNeedArrows,
  ]);

  /**
   * remove arrows if scroll position is on the edge
   *
   *  - use 'scroll' event handler to detect cur scroll position and remove unnecessary arrow
   *  - initial scroll position is 0 so default values for its state is 'false' and 'true'
   **/
  const [isNeedLeftArrow, setNeedLeftArrow] = React.useState<boolean>(false);
  const [isNeedRightArrow, setNeedRightArrow] = React.useState<boolean>(true);
  const handleScrollChangeEvent: React.EventHandler<
    React.UIEvent<HTMLDivElement>
  > = (e) => {
    const curScrollPos = e.currentTarget.scrollLeft;
    const maxScrollPos =
      e.currentTarget.scrollWidth - e.currentTarget.clientWidth;
    if (curScrollPos == 0) {
      setNeedLeftArrow(false);
    } else if (curScrollPos == maxScrollPos) {
      setNeedRightArrow(false);
    } else {
      setNeedLeftArrow(true);
      setNeedRightArrow(true);
    }
  };

  return (
    <div className={classnames(classes.wrapper)}>
      <div className={classnames(classes.outerBox)} ref={outerBoxRef}>
        <div
          className={classnames(classes.innerBox)}
          ref={innerBoxRef}
          onScroll={handleScrollChangeEvent}
        >
          {props.renderDomainFunc()}
        </div>
        {isNeedArrows && (
          <React.Fragment>
            {isNeedLeftArrow && (
              <Box className={classnames(classes.btnBox, classes.leftBtnBox)}>
                <IconButton
                  className={classnames(classes.btn, classes.leftBtn)}
                  onClick={handleLeftArrowIconClickEvent}
                >
                  <PlayCircleFilledIcon
                    style={{ transform: "rotate(180deg)" }}
                  />
                </IconButton>
              </Box>
            )}
            {isNeedRightArrow && (
              <Box className={classnames(classes.btnBox, classes.rightBtnBox)}>
                <IconButton
                  className={classnames(classes.btn, classes.rightBtn)}
                  onClick={handleRightArrowIconClickEvent}
                >
                  <PlayCircleFilledIcon />
                </IconButton>
              </Box>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default SingleLineList;
