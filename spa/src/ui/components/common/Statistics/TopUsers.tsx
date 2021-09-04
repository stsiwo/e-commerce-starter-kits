import { Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { AxiosError, AxiosResponse } from "axios";
import { api } from "configs/axiosConfig";
import { logger } from "configs/logger";
import * as React from "react";
import { Link as RRLink } from "react-router-dom";
import { cadCurrencyFormat, getApiUrl } from "src/utils";
const log = logger(__filename);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: 150,
    },
    controllerBox: {},
    controllerGridItem: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    controllerLabel: {
      marginRight: theme.spacing(1),
    },
    chart: {},
    card: {
      display: "flex",
      flexDirection: "column",
    },
    actions: {
      justifyContent: "center",
      marginTop: "auto",
    },
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: "100%",
      marginTop: "30",
    },
    horizontalCard: {
      display: "flex",
      flexWrap: "nowrap",
    },
    horizontalCardHeader: {
      width: "100%",
    },
  })
);

export declare type TopUserType = {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userAvatarImagePath: string;
  totalSpend: number;
};

/**
 * admin dashboard total sales pie chart component page
 *
 * - parent element must have 'height: xxpx' (specific number) otherwise, won't render anything.
 *
 **/
const TopUsers: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const [curData, setData] = React.useState<TopUserType[]>([]);

  const [showMore, setShowMore] = React.useState<boolean>(false);
  const [curDataSize, setDataSize] = React.useState<number>(5);

  React.useEffect(() => {
    if (showMore) {
      setDataSize(20);
    } else {
      setDataSize(5);
    }
  }, [showMore]);

  const toggleShowMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowMore((prev: boolean) => !prev);
  };

  /**
   * api request
   */
  React.useEffect(() => {
    api
      .request({
        method: "GET",
        url: API1_URL + `/statistics/top/users`,
      })
      .then((data: AxiosResponse<TopUserType[]>) => {
        setData(data.data);
      })
      .catch((error: AxiosError) => {
        log("failed to load top users data.");
      });
  }, []);

  const renderDomains: () => React.ReactNode = () => {
    return curData
      .slice(0, curDataSize)
      .map((user: TopUserType, index: number) => {
        /**
         * if the user is available (e.g., not null), display teh primary image.
         **/
        return (
          <Card className={classes.horizontalCard} key={user.userId}>
            <CardHeader
              className={classes.horizontalCardHeader}
              avatar={
                <Avatar
                  alt={`top-user-no-${index}`}
                  src={getApiUrl(user.userAvatarImagePath)}
                />
              }
              title={cadCurrencyFormat(user.totalSpend) + " spent"}
              subheader={user.userFirstName + " " + user.userLastName}
              action={
                <Button
                  variant="contained"
                  size="small"
                  component={RRLink}
                  to={`/admin/customers?searchQuery=${user.userId}`}
                >
                  Detail
                </Button>
              }
            ></CardHeader>
          </Card>
        );
      });
  };

  return (
    <Card className={classes.card}>
      <CardHeader title={"Top Users"} />
      <CardContent>{renderDomains()}</CardContent>
      <CardActions className={classes.actions}>
        {showMore && (
          <Button onClick={toggleShowMore} variant="contained">
            Show Less
          </Button>
        )}
        {!showMore && (
          <Button onClick={toggleShowMore} variant="contained">
            Show More
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default TopUsers;
