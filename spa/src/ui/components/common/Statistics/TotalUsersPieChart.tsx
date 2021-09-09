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
  TotalUsersBaseEnum,
  totalUsersBaseLabels,
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

export declare type TotalUsersDataType = {
  name: Date;
  users: number;
};

const data01: TotalUsersDataType[] = [
  {
    name: new Date(),
    users: 400,
  },
  {
    name: new Date(),
    users: 300,
  },
  {
    name: new Date(),
    users: 300,
  },
  {
    name: new Date(),
    users: 200,
  },
  {
    name: new Date(),
    users: 278,
  },
  {
    name: new Date(),
    users: 189,
  },
];
/**
 * admin dashboard total users pie chart component page
 *
 * - parent element must have 'height: xxpx' (specific number) otherwise, won't render anything.
 *
 **/
const TotalUsersPieChart: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();
  const themes = useTheme();

  const [curBase, setBase] = React.useState<TotalUsersBaseEnum>(
    TotalUsersBaseEnum.THIS_MONTH
  );

  const handleBaseChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => {
    /**
     * DON'T FORGET TO USE 'e.target.event' rather than 'e.currentTarget.event'
     *
     **/
    const nextBase: TotalUsersBaseEnum = e.target.value as TotalUsersBaseEnum;
    setBase(nextBase);
  };

  /**
   * request to my back end api to get users data
   */
  const [curData, setData] = React.useState<TotalUsersDataType[]>([]);
  React.useEffect(() => {
    //const queryString = `?base=${curBase}`;
    let startDate;

    if (curBase === TotalUsersBaseEnum.TODAY) {
      startDate = getTodayFromBeginning();
    } else if (curBase === TotalUsersBaseEnum.THIS_MONTH) {
      startDate = getThisMonthFromBeginning();
    } else {
      startDate = getThisYearFromBeginning();
    }

    const endDate = new Date();

    const queryString = `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&base=${curBase}`;

    api
      .request({
        method: "GET",
        url: API1_URL + `/statistics/total/users${queryString}`,
      })
      .then((data: AxiosResponse<TotalUsersDataType[]>) => {
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

    curData.forEach((data: TotalUsersDataType) => {
      total += data.users;
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
  const renderPieLabel: (data: TotalUsersDataType) => string =
    React.useCallback(
      (data) => {
        if (curBase === TotalUsersBaseEnum.TODAY) {
          return `${data.users} (${toHourString(data.name)})`;
        } else if (curBase === TotalUsersBaseEnum.THIS_MONTH) {
          return `${data.users} (${toDateMonthDayString(data.name)})`;
        } else {
          return `${data.users} (${toDateMonthString(data.name)})`;
        }
      },
      [curBase, curData]
    );

  return (
    <Card className={classes.card}>
      <CardHeader
        title={curTotalAmount}
        subheader="Total Users"
        action={
          <Select
            id="total-users-base-pie-chart-select"
            value={curBase}
            onChange={handleBaseChange}
          >
            {Object.values(TotalUsersBaseEnum).map(
              (base: TotalUsersBaseEnum) => (
                <MenuItem key={`${base}`} value={base}>
                  {`${totalUsersBaseLabels[base]}`}
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
                dataKey="users"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={10}
                outerRadius={40}
                fill={themes.palette.fifth.main}
                label={renderPieLabel}
                labelLine
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalUsersPieChart;
