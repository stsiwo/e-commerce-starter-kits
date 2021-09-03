import { StatisticSaleBaseEnum, StatisticUserBaseEnum } from "./types";

export const determineBaseOnUserAreaChart: (
  curStartYear: number,
  curStartMonth: number,
  curStartDate: number,
  curEndYear: number,
  curEndMonth: number,
  curEndDate: number
) => StatisticUserBaseEnum = (
  curStartYear: number,
  curStartMonth: number,
  curStartDate: number,
  curEndYear: number,
  curEndMonth: number,
  curEndDate: number
) => {
  if (curStartYear === curEndYear && curStartMonth === curEndMonth) {
    return StatisticUserBaseEnum.HOURLY;
  } else if (curStartYear === curEndYear && curStartMonth !== curEndMonth) {
    return StatisticUserBaseEnum.DAILY;
  } else {
    return StatisticUserBaseEnum.MONTHLY;
  }
};

export const determineBaseOnSaleAreaChart: (
  curStartYear: number,
  curStartMonth: number,
  curStartDate: number,
  curEndYear: number,
  curEndMonth: number,
  curEndDate: number
) => StatisticSaleBaseEnum = (
  curStartYear: number,
  curStartMonth: number,
  curStartDate: number,
  curEndYear: number,
  curEndMonth: number,
  curEndDate: number
) => {
  if (curStartYear === curEndYear && curStartMonth === curEndMonth) {
    return StatisticSaleBaseEnum.HOURLY;
  } else if (curStartYear === curEndYear && curStartMonth !== curEndMonth) {
    return StatisticSaleBaseEnum.DAILY;
  } else {
    return StatisticSaleBaseEnum.MONTHLY;
  }
};
