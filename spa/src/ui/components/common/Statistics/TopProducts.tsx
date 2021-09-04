import { Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { AxiosError, AxiosResponse } from "axios";
import { api } from "configs/axiosConfig";
import { logger } from "configs/logger";
import * as React from "react";
import { Link as RRLink } from "react-router-dom";
import { getApiUrl } from "src/utils";
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

export declare type TopProductType = {
  productId: string;
  productName: string;
  primaryImagePath: string;
  soldCount: number;
};

/**
 * admin dashboard total sales pie chart component page
 *
 * - parent element must have 'height: xxpx' (specific number) otherwise, won't render anything.
 *
 **/
const TopProducts: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const [curData, setData] = React.useState<TopProductType[]>([]);

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
        url: API1_URL + `/statistics/top/products`,
      })
      .then((data: AxiosResponse<TopProductType[]>) => {
        setData(data.data);
      })
      .catch((error: AxiosError) => {
        log("failed to load top products data.");
      });
  }, []);

  const renderDomains: () => React.ReactNode = () => {
    return curData
      .slice(0, curDataSize)
      .map((product: TopProductType, index: number) => {
        /**
         * if the product is available (e.g., not null), display teh primary image.
         **/
        return (
          <Card className={classes.horizontalCard} key={product.productId}>
            <CardHeader
              className={classes.horizontalCardHeader}
              avatar={
                <React.Fragment>
                  {!product.primaryImagePath && (
                    <Avatar alt={`top-product-${index}`}>
                      <FavoriteIcon />
                    </Avatar>
                  )}
                  {product.primaryImagePath && (
                    <Avatar
                      alt={`top-product-${index}`}
                      src={getApiUrl(product.primaryImagePath)}
                    />
                  )}
                </React.Fragment>
              }
              title={product.soldCount + " items sold"}
              subheader={product.productName}
              action={
                <Button
                  variant="contained"
                  size={"small"}
                  component={RRLink}
                  to={`/admin/products?searchQuery=${product.productId}`}
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
      <CardHeader title={"Top Products"} />
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

export default TopProducts;
