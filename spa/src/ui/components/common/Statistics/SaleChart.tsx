import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

/**
 * admin account management page
 *
 **/
const SaleChart: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  return <div>chart</div>;
};

export default SaleChart;
