import { Box } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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
  YAxis
} from "recharts";
import {
  filterEndDate,
  filterEndMonth,
  filterEndYear,
  getAvailableDate,
  getAvailableMonth,
  getPastTenYears
} from "src/utils";
const log = logger(__filename);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: 500,
    },
    controllerBox: {},
    chart: {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
  })
);

export declare type SaleDataType = {
  name: Date;
  value: number;
};

/**
 * admin dashboard sale chart component page
 *
 * - parent element must have 'height: xxpx' (specific number) otherwise, won't render anything.
 *
 **/
const SaleChart: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

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
   * request to my back end api to get sales data
   */
  const [curData, setData] = React.useState<SaleDataType[]>([]);
  React.useEffect(() => {
    const queryString = `?startYear=${curStartYear}&startMonth=${curStartMonth}&startDate=${curStartDate}%s&endYear=${curEndYear}%s&endMonth=${curEndMonth}%s&endDate=${curEndDate}`;

    api
      .request({
        method: "GET",
        url: API1_URL + `/statistics/sales${queryString}`,
      })
      .then((data) => {
        setData(data.data);
      })
      .catch((error: AxiosError) => {
        log("failed to load sale data.");
      });
  }, [
    curStartYear,
    curStartMonth,
    curStartDate,
    curEndYear,
    curEndMonth,
    curEndDate,
  ]);

  return (
    <Box className={classes.wrapper}>
      <Box className={""}>
        <FormControl className={""}>
          <Select
            id="sale-chart-start-year-select"
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
            id="sale-chart-start-month-select"
            value={curStartMonth}
            onChange={handleStartMonthSelectChange}
          >
            {curStartMonthList.map((month: number) => (
              <MenuItem key={`month-${month}`} value={month}>
                {month === 0 ? "All Months" : month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={""}>
          <Select
            id="sale-chart-start-date-select"
            value={curStartDate}
            onChange={handleStartDateSelectChange}
          >
            {curStartDateList.map((date: number) => (
              <MenuItem key={`date-${date}`} value={date}>
                {date === 0 ? "All Dates" : date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box className={""}>
        <FormControl className={""}>
          <Select
            id="sale-chart-end-year-select"
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
            id="sale-chart-end-month-select"
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
            id="sale-chart-end-date-select"
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
      </Box>
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
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SaleChart;
