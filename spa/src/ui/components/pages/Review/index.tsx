import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import { defaultReviewData, ReviewType } from "domain/review/type";
import merge from "lodash/merge";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link as RRLink } from "react-router-dom";
import { mSelector } from "src/selectors/selector";
import ReviewForm from "./ReviewForm";
import { logger } from "configs/logger";
const log = logger(__filename);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center",
    },
    contentBox: {
      textAlign: "center",
    },
  })
);

enum ReviewFetchResponseEnum {
  PROCESSING,
  SUCCESS,
  FAILED_SINCE_NO_LOGIN,
  UNAUTHORIZED_ACCESS, // when user modify the input (e.g., userId and productId)
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
/**
 * guest & member reviewdetail page
 *
 **/
const Review: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const query = useQuery();
  const userId = query.get("userId");
  const productId = query.get("productId");

  const auth = useSelector(mSelector.makeAuthSelector());
  const [curReview, setReview] = React.useState<ReviewType>(null);
  const [curStatus, setStatus] = React.useState<ReviewFetchResponseEnum>(
    ReviewFetchResponseEnum.PROCESSING
  );
  const [isNew, setNew] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!curReview) {
      api
        .request({
          method: "GET",
          url: API1_URL + `/users/${userId}/review?productId=${productId}`,
        })
        .then((data) => {
          /**
           * login success
           **/
          log(data.data);

          // the review exist
          if (data.data.isExist) {
            setNew(false); // if exist, new is false
            setReview(data.data.review);
          } else {
            // the review does not exist
            setNew(true); // if not exist, new is true
            setReview(
              merge({}, defaultReviewData, {
                user: data.data.user,
                product: data.data.product,
              })
            );
          }

          setStatus(ReviewFetchResponseEnum.SUCCESS);
        })
        .catch((error: AxiosError) => {
          if (error.response.status === 401) {
            setStatus(ReviewFetchResponseEnum.FAILED_SINCE_NO_LOGIN);
          } else {
            setStatus(ReviewFetchResponseEnum.UNAUTHORIZED_ACCESS);
          }
        });
    }
  }, []);

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {"Review"}
      </Typography>
      {curStatus === ReviewFetchResponseEnum.PROCESSING && (
        <Box className={classes.contentBox}>
          <CircularProgress />
          <Typography variant="subtitle1" component="p" align="center">
            {"fetching data..."}
          </Typography>
        </Box>
      )}
      {curStatus === ReviewFetchResponseEnum.FAILED_SINCE_NO_LOGIN && (
        <Box className={classes.contentBox}>
          <Typography variant="subtitle1" component="p" align="center">
            {"seems like you are not logged in. please login first."}
          </Typography>
          <Button component={RRLink} to="/login" variant="contained">
            {"Go to Login Page"}
          </Button>
        </Box>
      )}
      {curStatus === ReviewFetchResponseEnum.UNAUTHORIZED_ACCESS && (
        <Box className={classes.contentBox}>
          <Typography variant="subtitle1" component="p" align="center">
            {"sorry, the review is not currently available."}
          </Typography>
        </Box>
      )}
      {curStatus === ReviewFetchResponseEnum.SUCCESS && auth.isLoggedIn && (
        <ReviewForm review={curReview} isNew={isNew} />
      )}
    </React.Fragment>
  );
};

export default Review;
