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
  TotalSalesBaseEnum,
  totalSalesBaseLabels,
} from "domain/statistic/types";
import * as React from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  cadCurrencyFormat,
  toDateMonthDayString,
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

export declare type TotalSalesDataType = {
  name: Date;
  sales: number;
};

/**
 * admin dashboard total sales pie chart component page
 *
 * - parent element must have 'height: xxpx' (specific number) otherwise, won't render anything.
 *
 **/
const TotalSalesPieChart: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();
  const themes = useTheme();

  const [curBase, setBase] = React.useState<TotalSalesBaseEnum>(
    TotalSalesBaseEnum.TODAY
  );

  const handleBaseChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextBase: TotalSalesBaseEnum = e.target.value as TotalSalesBaseEnum;
    setBase(nextBase);
  };

  /**
   * request to my back end api to get sales data
   */
  const [curData, setData] = React.useState<TotalSalesDataType[]>([]);
  React.useEffect(() => {
    const queryString = `?base=${curBase}`;

    api
      .request({
        method: "GET",
        url: API1_URL + `/statistics/total/sales${queryString}`,
      })
      .then((data: AxiosResponse<TotalSalesDataType[]>) => {
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

    curData.forEach((data: TotalSalesDataType) => {
      log("in loop to calculate total");
      log(data.sales);
      total += data.sales;
    });

    log("cur total: " + total);

    setTotalAmount(total);
  }, [JSON.stringify(curData)]);

  /**
   * render label for pic chart (you need to do this manually)
   *
   * note: rechart bug: https://github.com/recharts/recharts/issues/929
   *
   * solution is to use 'useCallback'.
   */
  const renderPieLabel: (data: TotalSalesDataType) => string =
    React.useCallback(
      (data) => {
        if (curBase === TotalSalesBaseEnum.TODAY) {
          return toHourString(data.name);
        } else {
          return toDateMonthDayString(data.name);
        }
      },
      [curBase, curData]
    );

  return (
    <Card className={classes.card}>
      <CardHeader
        title={cadCurrencyFormat(curTotalAmount)}
        subheader="Total Sales"
        /**action={
            <React.Fragment>
              <IconButton
                aria-label="settings"
                onClick={(e) => handleMenuOpenClick(e)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id={`total-sales-controller`}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem>Manage Review</MenuItem>
              </Menu>
            </React.Fragment>
          }*/
        action={
          <Select
            id="total-sales-base-pie-chart-select"
            value={curBase}
            onChange={handleBaseChange}
          >
            {Object.values(TotalSalesBaseEnum).map(
              (base: TotalSalesBaseEnum) => (
                <MenuItem key={`${base}`} value={base}>
                  {`${totalSalesBaseLabels[base]}`}
                </MenuItem>
              )
            )}
          </Select>
        }
      />
      <CardContent>
        <Box className={classes.wrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={730} height={250}>
              <Pie
                data={curData}
                dataKey="sales"
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

export default TotalSalesPieChart;
