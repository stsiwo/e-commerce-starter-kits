import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating/Rating";
import { ReviewType } from "domain/review/type";
import * as React from "react";
import { getApiUrl, toDateString } from "src/utils";

declare type SingleLineListPropsType = {
  review: ReviewType;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 280,
      margin: theme.spacing(1),
    },
  })
);

/**
 *
 **/
const ReviewCard: React.FunctionComponent<SingleLineListPropsType> = ({
  review,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} key={review.reviewId}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="reviewer avatar image"
            src={
              review.user.avatarImagePath
                ? getApiUrl(review.user.avatarImagePath)
                : null
            }
          />
        }
        title={review.reviewTitle}
        subheader={
          review.user.firstName +
          " " +
          review.user.lastName +
          " (" +
          toDateString(review.createdAt) +
          ")"
        }
      />
      <CardContent>
        <Rating name="review-point" value={review.reviewPoint} readOnly />
        <Typography variant="body2" color="textSecondary" component="p">
          {review.reviewDescription}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
