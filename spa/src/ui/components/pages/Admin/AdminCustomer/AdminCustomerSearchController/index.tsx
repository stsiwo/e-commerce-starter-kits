import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import TabPanel from './TabPanel';
import UserDateFilterTabPanel from './TabPanel/UserDateFilterTabPanel';
import UserSortTabPanel from './TabPanel/UserSortTabPanel';
import UserActiveTabPanel from './TabPanel/UserActiveTabPanel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabBox: {
      // for search controller which is position: absolute
      position: "relative",

      // for tabPanel to match width
      width: "100%",
    },
    appBar: {
      boxShadow: "none",
    },
    tabPanel: {
      maxWidth: theme.breakpoints.values.lg, 
      position: "absolute",
      backgroundColor: theme.palette.third.main,
      zIndex: 1,
      boxShadow: theme.shadows[8],

      // for tabPanel to match width
      width: "inherit",
    },
    tabRoot: {
      minWidth: 50,
    }
  }),
);

/**
 * TODO: make tab panel title consistent (e.g., select category, review point, and so on)
 *
 **/

const AdminUserSearchController: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  /**
   * tab components stuff
   **/
  const [curTabIndex, setTabIndex] = React.useState(0);
  function a11yProps(index: any) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {

    // toggle feature
    const nextValue = (curTabIndex === newValue) ? 0 : newValue

    setTabIndex(nextValue);
  };

  /**
   * query state stuff
   *
   * this is the reason to cause radiogroup check does not checked (esp, Sort).
   * curQuery is not updated when Sort state is updated at child component.
   *
   * maybe, this is because of memorized selector and immutable comparison. for example, even if the child property (sort) is updated the parent (query) property still the same. that's why, the prop (curSort) not gonna updated at child component.
   *
   * solution for this:
   *
   * use each prop query selector at each tabpanel. don't need to use 'mselector.makeProductQuerySelector()' here.
   **/
  //const curQuery = useSelector(mSelector.makeProductQuerySelector());

  return (
    <Box component="div" className={classes.tabBox}>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs
          classes={{
            root: classes.tabRoot,
          }}
          value={curTabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Result" classes={{ root: classes.tabRoot }} {...a11yProps(0)} />
          <Tab label="Date" classes={{ root: classes.tabRoot }} {...a11yProps(1)} />
          <Tab label="Status" classes={{ root: classes.tabRoot }} {...a11yProps(2)} />
          <Tab label="Sort" classes={{ root: classes.tabRoot }} {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel 
        value={curTabIndex} 
        index={0} 
        render={() => <React.Fragment></React.Fragment>}
      />
      <TabPanel 
        value={curTabIndex} 
        index={1} 
        className={classes.tabPanel}
        render={() => <UserDateFilterTabPanel/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={2} 
        className={classes.tabPanel}
        render={() => <UserActiveTabPanel/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={3} 
        className={classes.tabPanel}
        render={() => <UserSortTabPanel/>} 
      />
    </Box>
  )
}

export default AdminUserSearchController



