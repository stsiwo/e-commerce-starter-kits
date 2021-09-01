import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SaleChart from "components/common/Statistics/SaleChart";
import TopProducts from "components/common/Statistics/TopProducts";
import TopUsers from "components/common/Statistics/TopUsers";
import TotalProductsPieChart from "components/common/Statistics/TotalProductsPieChart";
import TotalSalesPieChart from "components/common/Statistics/TotalSalesPieChart";
import TotalUsersPieChart from "components/common/Statistics/TotalUsersPieChart";
import UserChart from "components/common/Statistics/UserChart";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      flexGrow: 1,
      padding: theme.spacing(0, 1),
      /**
       * this is necessary for scrollable tabs (from Mui) used for filter/sort for each domain.
       **/
      width: "100%",
    },
    topSectionGridContainer: {},
    topSectionGridItems: {
      margin: theme.spacing(1),
      flex: "0 0 300px",
    },
    secondSectionGridContainer: {},

    secondSectionGridItem: {
      padding: theme.spacing(1),
    },
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: "nowrap",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
    card: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff",
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
    singleLineListOuterBox: {
      width: "100%",
      padding: 0,
    },
  })
);

/**
 * admin account management page
 *
 **/
const AdminStatisticsDashboard: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  /**
   * total sales base menus
   *
   * - need to display a menu for each order detail.
   * so anchorEl should be an array and each element contains the html element which is gonna be an anchor of the menu.
   **/
  //const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  //const handleMenuOpenClick = (event: React.MouseEvent<HTMLElement>) => {
  //  const target = event.currentTarget;
  //  setAnchorEl(target);
  //};

  //const handleMenuClose = () => {
  //  setAnchorEl(null);
  //};

  /**
   * render component
   *
   */
  const renderTotalPieCharts: () => React.ReactNode = () => {
    return [TotalProductsPieChart, TotalUsersPieChart, TotalSalesPieChart].map(
      (Component: React.FunctionComponent) => {
        return <Component />;
      }
    );
  };

  return (
    <Box component="div" className={classes.box}>
      {/**
       * if you want it to be single line but need to adjust css
      <SingleLineList
        renderDomainFunc={renderTotalPieCharts}
        outerClassName={classes.singleLineListOuterBox}
      />
       * 
       */}

      {/** second section */}
      <Grid container justify="space-around" alignItems="center">
        <Grid
          item
          xs={12}
          md={6}
          lg={4}
          className={classes.topSectionGridItems}
        >
          <TotalSalesPieChart />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={4}
          className={classes.topSectionGridItems}
        >
          <TotalUsersPieChart />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={4}
          className={classes.topSectionGridItems}
        >
          <TotalProductsPieChart />
        </Grid>
      </Grid>

      {/** second section */}
      <Grid container justify="space-around" alignItems="center">
        <Grid item xs={12} md={6} className={classes.secondSectionGridItem}>
          <SaleChart />
        </Grid>
        <Grid item xs={12} md={6} className={classes.secondSectionGridItem}>
          <UserChart />
        </Grid>
      </Grid>

      {/** third section */}
      <Grid container justify="space-around" alignItems="flex-start">
        <Grid item xs={12} md={6} className={classes.secondSectionGridItem}>
          <TopProducts />
        </Grid>
        <Grid item xs={12} md={6} className={classes.secondSectionGridItem}>
          <TopUsers />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStatisticsDashboard;
