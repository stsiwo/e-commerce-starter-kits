import { Box } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import { AxiosError, AxiosResponse } from "axios";
import { api } from "configs/axiosConfig";
import { logger } from "configs/logger";
import {
  TotalProductsBaseEnum,
  totalProductsBaseLabels,
} from "domain/statistic/types";
import * as React from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  getThisMonthFromBeginning,
  getThisYearFromBeginning,
  getTodayFromBeginning,
  toDateMonthDayString,
  toDateMonthString,
  toHourString,
} from "src/utils";
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
    cardContentRoot: {
      padding: 0,
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",

      marginTop: "auto",
    },
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: "100%",
      marginTop: "30",
    },
  })
);

export declare type TotalProductsDataType = {
  name: Date;
  products: number;
};

const data01: TotalProductsDataType[] = [
  {
    name: new Date(),
    products: 400,
  },
  {
    name: new Date(),
    products: 300,
  },
  {
    name: new Date(),
    products: 300,
  },
  {
    name: new Date(),
    products: 200,
  },
  {
    name: new Date(),
    products: 278,
  },
  {
    name: new Date(),
    products: 189,
  },
];
/**
 * admin dashboard total products pie chart component page
 *
 * - parent element must have 'height: xxpx' (specific number) otherwise, won't render anything.
 *
 **/
const TotalProductsPieChart: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();
  const themes = useTheme();

  const [curBase, setBase] = React.useState<TotalProductsBaseEnum>(
    TotalProductsBaseEnum.THIS_MONTH
  );

  const handleBaseChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextBase: TotalProductsBaseEnum = e.target
      .value as TotalProductsBaseEnum;
    setBase(nextBase);
  };

  /**
   * request to my back end api to get products data
   */
  const [curData, setData] = React.useState<TotalProductsDataType[]>([]);
  React.useEffect(() => {
    //const queryString = `?base=${curBase}`;

    let startDate;

    if (curBase === TotalProductsBaseEnum.TODAY) {
      startDate = getTodayFromBeginning();
    } else if (curBase === TotalProductsBaseEnum.THIS_MONTH) {
      startDate = getThisMonthFromBeginning();
    } else {
      startDate = getThisYearFromBeginning();
    }

    const endDate = new Date();

    const queryString = `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&base=${curBase}`;

    api
      .request({
        method: "GET",
        url: API1_URL + `/statistics/total/products${queryString}`,
      })
      .then((data: AxiosResponse<TotalProductsDataType[]>) => {
        setData(data.data);
      })
      .catch((error: AxiosError) => {
        log("failed to load total sale data.");
      });
  }, [curBase]);

  /**
   * calculate total amount based on the curData
   */
  const [curTotalAmount, setTotalAmount] = React.useState<number>(0);
  React.useEffect(() => {
    let total = 0;

    curData.forEach((data: TotalProductsDataType) => {
      total += data.products;
    });

    setTotalAmount(total);
  }, [JSON.stringify(curData)]);

  /**
   * render label for pic chart (you need to do this manually)
   *
   * note: rechart bug: https://github.com/recharts/recharts/issues/929
   *
   * solution is to use 'useCallback'.
   */
  const renderPieLabel: (data: TotalProductsDataType) => string =
    React.useCallback(
      (data) => {
        if (curBase === TotalProductsBaseEnum.TODAY) {
          return `${data.products} (${toHourString(data.name)})`;
        } else if (curBase === TotalProductsBaseEnum.THIS_MONTH) {
          return `${data.products} (${toDateMonthDayString(data.name)})`;
        } else {
          return `${data.products} (${toDateMonthString(data.name)})`;
        }
      },
      [curBase, curData]
    );

  return (
    <Card className={classes.card}>
      <CardHeader
        title={curTotalAmount}
        subheader="Total Sold Products"
        action={
          <Select
            id="total-products-base-pie-chart-select"
            value={curBase}
            onChange={handleBaseChange}
          >
            {Object.values(TotalProductsBaseEnum).map(
              (base: TotalProductsBaseEnum) => (
                <MenuItem key={`${base}`} value={base}>
                  {`${totalProductsBaseLabels[base]}`}
                </MenuItem>
              )
            )}
          </Select>
        }
      />
      <CardContent
        classes={{
          root: classes.cardContentRoot,
        }}
      >
        <Box className={classes.wrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={730} height={250}>
              <Pie
                data={curData}
                dataKey="products"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={10}
                outerRadius={40}
                fill={themes.palette.fifth.main}
                label={renderPieLabel}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalProductsPieChart;
