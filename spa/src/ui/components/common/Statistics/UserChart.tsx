import { Box } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import { AxiosError } from "axios";
import { api } from "configs/axiosConfig";
import { logger } from "configs/logger";
import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  filterEndDate,
  filterEndMonth,
  filterEndYear,
  getAvailableDate,
  getAvailableMonth,
  getPastTenYears,
} from "src/utils";
const log = logger(__filename);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: 200,
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

export declare type StatisticUserDataType = {
  name: Date;
  users: number;
};

/**
 * admin dashboard user chart component page
 *
 * - parent element must have 'height: xxpx' (specific number) otherwise, won't render anything.
 *
 **/
const UserChart: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();
  const themes = useTheme();

  /**
   * start date time query string
   */
  const [curStartYear, setStartYear] = React.useState<number>(
    new Date().getFullYear()
  );
  const [curStartMonth, setStartMonth] = React.useState<number>(
    new Date().getMonth() + 1
  );
  const [curStartDate, setStartDate] = React.useState<number>(
    new Date().getDate()
  );
  const [curStartYearList, setStartYearList] = React.useState<number[]>(
    getPastTenYears()
  );
  const [curStartMonthList, setStartMonthList] = React.useState<number[]>(
    getAvailableMonth(curStartYear)
  );
  const [curStartDateList, setStartDateList] = React.useState<number[]>(
    getAvailableDate(curStartYear, curStartMonth)
  );

  React.useEffect(() => {
    setStartMonthList((prev: number[]) => {
      return getAvailableMonth(curStartYear);
    });
  }, [curStartYear]);

  React.useEffect(() => {
    setStartDateList((prev: number[]) => {
      return getAvailableDate(curStartYear, curStartMonth);
    });
  }, [curStartYear, curStartMonth]);

  /**
   * disable if month is 'all months'
   */
  //React.useEffect(() => {
  //  if (curStartMonth === 0) {
  //    setStartDateDisable(true);
  //    setStartDate(0);
  //  } else {
  //    setStartDateDisable(false);
  //  }
  //}, [curStartMonth]);

  const handleStartYearSelectChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextYear = curStartYearList.find(
      (year: number) => year == parseInt(e.target.value)
    );
    setStartYear(nextYear);
  };

  const handleStartMonthSelectChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextMonth = curStartMonthList.find(
      (month: number) => month == parseInt(e.target.value)
    );
    setStartMonth(nextMonth);
  };

  const handleStartDateSelectChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextDate = curStartDateList.find(
      (date: number) => date == parseInt(e.target.value)
    );
    setStartDate(nextDate);
  };

  /**
   * End date time query string
   */
  const [curEndYear, setEndYear] = React.useState<number>(
    new Date().getFullYear()
  );
  const [curEndMonth, setEndMonth] = React.useState<number>(
    new Date().getMonth() + 1
  );
  const [curEndDate, setEndDate] = React.useState<number>(new Date().getDate());
  const [curEndYearList, setEndYearList] = React.useState<number[]>(
    getPastTenYears()
  );
  const [curEndMonthList, setEndMonthList] = React.useState<number[]>(
    getAvailableMonth(curEndYear)
  );
  const [curEndDateList, setEndDateList] = React.useState<number[]>(
    getAvailableDate(curEndYear, curEndMonth)
  );

  React.useEffect(() => {
    setEndMonthList((prev: number[]) => {
      return getAvailableMonth(curEndYear);
    });
  }, [curEndYear]);

  React.useEffect(() => {
    setEndDateList((prev: number[]) => {
      return getAvailableDate(curEndYear, curEndMonth);
    });
  }, [curEndYear, curEndMonth]);

  /**
   * disable end date if month is 'all months'
   */
  //React.useEffect(() => {
  //  if (curEndMonth === 0) {
  //    setEndDateDisable(true);
  //    setEndDate(0);
  //  } else {
  //    setEndDateDisable(false);
  //  }
  //}, [curEndMonth]);

  const handleEndYearSelectChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextYear = curEndYearList.find(
      (year: number) => year == parseInt(e.target.value)
    );
    setEndYear(nextYear);
  };

  const handleEndMonthSelectChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextMonth = curEndMonthList.find(
      (month: number) => month == parseInt(e.target.value)
    );
    setEndMonth(nextMonth);
  };

  const handleEndDateSelectChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextDate = curEndDateList.find(
      (date: number) => date == parseInt(e.target.value)
    );
    setEndDate(nextDate);
  };

  /**
   * filter teh end date time based on the start time date change
   */
  React.useEffect(() => {
    const nextEndYearList = filterEndYear(curStartYear, getPastTenYears());
    const nextEndMonthList = filterEndMonth(
      curStartYear,
      curStartMonth,
      curEndYear,
      curEndMonth,
      getAvailableMonth(curStartYear)
    );
    const nextEndDateList = filterEndDate(
      curStartYear,
      curStartMonth,
      curStartDate,
      curEndYear,
      curEndMonth,
      curEndDate,
      getAvailableDate(curStartYear, curStartMonth)
    );
    setEndYearList(nextEndYearList);
    setEndMonthList(nextEndMonthList);
    setEndDateList(nextEndDateList);

    // also update the curEndMonth and curEndDate
    if (nextEndMonthList.indexOf(curEndMonth) === -1) {
      setEndMonth(nextEndMonthList[0]);
    }

    if (nextEndDateList.indexOf(curEndDate) === -1) {
      setEndDate(nextEndDateList[0]);
    }

    // need to include curEndYear, curEndMonth, curEndDate as dependencies
    // to ch
  }, [
    curStartYear,
    curStartMonth,
    curStartDate,
    curEndYear,
    curEndMonth,
    curEndDate,
  ]);

  /**
   * request to my back end api to get users data
   */
  const [curData, setData] = React.useState<StatisticUserDataType[]>([]);
  React.useEffect(() => {
    const queryString = `?startYear=${curStartYear}&startMonth=${curStartMonth}&startDate=${curStartDate}&endYear=${curEndYear}&endMonth=${curEndMonth}&endDate=${curEndDate}`;

    log("statistic user request url ");
    log(API1_URL + `/statistics/users${queryString}`);

    api
      .request({
        method: "GET",
        url: API1_URL + `/statistics/users${queryString}`,
      })
      .then((data) => {
        setData(data.data);
      })
      .catch((error: AxiosError) => {
        log("failed to load user data.");
      });
  }, [
    curStartYear,
    curStartMonth,
    curStartDate,
    curEndYear,
    curEndMonth,
    curEndDate,
  ]);

  /**
   * calculate total amount based on the curData
   */
  const [curTotalAmount, setTotalAmount] = React.useState<number>(0);
  React.useEffect(() => {
    let total = 0;

    curData.forEach((data: StatisticUserDataType) => {
      total += data.users;
    });

    setTotalAmount(total);
  }, [JSON.stringify(curData)]);

  return (
    <Card className={classes.card}>
      <CardHeader title={curTotalAmount + " users"} subheader="New Users" />
      <CardContent>
        <Box className={classes.wrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={730}
              height={250}
              data={curData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              className={classes.chart}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                stroke={themes.palette.primary.main}
                fillOpacity={1}
                fill={themes.palette.primary.main}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        <Grid container spacing={2} justify="space-around">
          <Grid item xs={12} md={6} className={classes.controllerGridItem}>
            <FormLabel className={classes.controllerLabel}>
              Start Date
            </FormLabel>
            <FormControl className={""}>
              <Select
                id="user-chart-start-year-select"
                value={curStartYear}
                onChange={handleStartYearSelectChange}
              >
                {curStartYearList.map((year: number) => (
                  <MenuItem key={`year=${year}`} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={""}>
              <Select
                id="user-chart-start-month-select"
                value={curStartMonth}
                onChange={handleStartMonthSelectChange}
              >
                {curStartMonthList.map((month: number) => (
                  <MenuItem key={`month-${month}`} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={""}>
              <Select
                id="user-chart-start-date-select"
                value={curStartDate}
                onChange={handleStartDateSelectChange}
              >
                {curStartDateList.map((date: number) => (
                  <MenuItem key={`date-${date}`} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} className={classes.controllerGridItem}>
            <FormLabel className={classes.controllerLabel}>End Date</FormLabel>
            <FormControl className={""}>
              <Select
                id="user-chart-end-year-select"
                value={curEndYear}
                onChange={handleEndYearSelectChange}
              >
                {curEndYearList.map((year: number) => (
                  <MenuItem key={`year=${year}`} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={""}>
              <Select
                id="user-chart-end-month-select"
                value={curEndMonth}
                onChange={handleEndMonthSelectChange}
              >
                {curEndMonthList.map((month: number) => (
                  <MenuItem key={`month-${month}`} value={month}>
                    {month === 0 ? "All Months" : month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={""}>
              <Select
                id="user-chart-end-date-select"
                value={curEndDate}
                onChange={handleEndDateSelectChange}
              >
                {curEndDateList.map((date: number) => (
                  <MenuItem key={`date-${date}`} value={date}>
                    {date === 0 ? "All Dates" : date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default UserChart;
