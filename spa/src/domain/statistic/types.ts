export enum StatisticSaleBaseEnum {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
}

export enum StatisticUserBaseEnum {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
}

// pie chart

/// sales
export enum TotalSalesBaseEnum {
  THIS_YEAR = "THIS_YEAR",
  THIS_MONTH = "THIS_MONTH",
  TODAY = "TODAY",
}

export declare type TotalSalesBaseLabelsType = {
  [key in TotalSalesBaseEnum]: string;
};

export const totalSalesBaseLabels: TotalSalesBaseLabelsType = {
  [TotalSalesBaseEnum.THIS_YEAR]: "This Year",
  [TotalSalesBaseEnum.THIS_MONTH]: "This Month",
  [TotalSalesBaseEnum.TODAY]: "Today",
};

/// users
export enum TotalUsersBaseEnum {
  THIS_YEAR = "THIS_YEAR",
  THIS_MONTH = "THIS_MONTH",
  TODAY = "TODAY",
}

export declare type TotalUsersBaseLabelsType = {
  [key in TotalUsersBaseEnum]: string;
};

export const totalUsersBaseLabels: TotalUsersBaseLabelsType = {
  [TotalUsersBaseEnum.THIS_YEAR]: "This Year",
  [TotalUsersBaseEnum.THIS_MONTH]: "This Month",
  [TotalUsersBaseEnum.TODAY]: "Today",
};

/// products
export enum TotalProductsBaseEnum {
  THIS_YEAR = "THIS_YEAR",
  THIS_MONTH = "THIS_MONTH",
  TODAY = "TODAY",
}

export declare type TotalProductsBaseLabelsType = {
  [key in TotalProductsBaseEnum]: string;
};

export const totalProductsBaseLabels: TotalProductsBaseLabelsType = {
  [TotalProductsBaseEnum.THIS_YEAR]: "This Year",
  [TotalProductsBaseEnum.THIS_MONTH]: "This Month",
  [TotalProductsBaseEnum.TODAY]: "Today",
};
