import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ProductType } from "domain/product/types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RRLink } from "react-router-dom";
import { mSelector } from "src/selectors/selector";
import ProductCard from "../ProductCard";
import { fetchPublicProductActionCreator } from "reducers/slices/domain/product";
import SingleLineList from "../SingleLineList";
import { api } from "configs/axiosConfig";
import { messageActions } from "reducers/slices/app";
import { getNanoId } from "src/utils";
import { FetchStatusEnum, MessageTypeEnum } from "src/app";
import { AxiosError } from "axios";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      // need to set this. otherwise, <Grid spacing={x}> causes overflow horizontally.
      // ref: https://material-ui.com/components/grid/#limitations
      overflow: "hidden",
      padding: theme.spacing(0, 1, 0, 1),
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    item: {},
    moreBtnBox: {
      margin: theme.spacing(3),
      display: "flex",
      justifyContent: "center",
    },
  })
);

const BrandNewProduct: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

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
        url: API1_URL + `/products/public?isDiscount=true`,
      })
      .then((data) => {
        setFetchStatus(FetchStatusEnum.SUCCESS);
        setDomains(data.data.content);
      })
      .catch((error: AxiosError) => {
        setFetchStatus(FetchStatusEnum.FAILED);
      });
  }, []);

  const renderDomains: () => React.ReactNode = () => {
    return curDomains.slice(0, 5).map((product: ProductType) => {
      return <ProductCard product={product} />;
    });
  };

  return (
    <Box component="section" className={classes.section}>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {"Discount"}
      </Typography>
      <SingleLineList renderDomainFunc={renderDomains} />
      <Box component="div" className={classes.moreBtnBox}>
        <Button component={RRLink} to={`/search`} variant="contained">
          More Discount Products
        </Button>
      </Box>
    </Box>
  );
};

export default BrandNewProduct;
