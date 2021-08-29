import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SaleChart from "components/common/Statistics/SaleChart";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

/**
 * admin account management page
 *
 **/
const AdminStatisticsDashboard: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  return <SaleChart />;
};

export default AdminStatisticsDashboard;
