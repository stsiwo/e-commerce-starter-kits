import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import { ProductType } from "domain/product/types";
import * as React from "react";
import { FetchStatusEnum } from "src/app";
import ProductHorizontalCardV2 from "../ProductCard/ProductHorizontalCardV2";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    featuresBox: {
      backgroundColor: theme.palette.fourth.main,
      padding: `${theme.spacing(10)}px 0`,

      marginRight: `calc(50% - 50vw)`,
      marginLeft: `calc(50% - 50vw)`,

      paddingRight: `calc(50vw - 50%)`,
      paddingLeft: `calc(50vw - 50%)`,
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    divider: {
      margin: `${theme.spacing(5)}px 0`,
    },
  })
);

const FeaturedProduct: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const [curDomains, setDomains] = React.useState<ProductType[]>([]);
  const [curFetchStatus, setFetchStatus] = React.useState<FetchStatusEnum>(
    FetchStatusEnum.INITIAL
  );

  // fetch new blogs only once
  React.useEffect(() => {
    setFetchStatus(FetchStatusEnum.FETCHING);
    api
      .request({
        method: "GET",
        url: API1_URL + `/products/public?sort=DATE_ASC&limit=3`,
      })
      .then((data) => {
        setFetchStatus(FetchStatusEnum.SUCCESS);
        setDomains(data.data.content);
      })
      .catch((error: AxiosError) => {
        setFetchStatus(FetchStatusEnum.FAILED);
      });
  }, []);

  return (
    curDomains.length > 0 && (
      <Box className={classes.featuresBox} component="div">
        <Typography
          variant="h5"
          component="h5"
          align="center"
          className={classes.title}
        >
          {"Featured Products"}
        </Typography>

        <ProductHorizontalCardV2 imgLeft product={curDomains[0]} />
        <Divider variant="middle" className={classes.divider}></Divider>
        <ProductHorizontalCardV2 product={curDomains[1]} />
        <Divider variant="middle" className={classes.divider}></Divider>
        <ProductHorizontalCardV2 imgLeft product={curDomains[2]} />
      </Box>
    )
  );
};

export default FeaturedProduct;
