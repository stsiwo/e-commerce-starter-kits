import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import TabPanel from './TabPanel';
import CategoryFilterTabPanel from './TabPanel/CategoryFilterTabPanel';
import DiscountFilterTabPanel from './TabPanel/DiscountFilterTabPanel';
import PriceFilterTabPanel from './TabPanel/PriceFilterTabPanel';
import ReleaseDateFilterTabPanel from './TabPanel/ReleaseDateFilterTabPanel';
import ReviewFilterTabPanel from './TabPanel/ReviewFilterTabPanel';
import SortTabPanel from './TabPanel/SortTabPanel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabPanel: {
      maxWidth: theme.breakpoints.values.lg, 
      position: "absolute",
      backgroundColor: "#f5f5f5",
      zIndex: 1,
      width: "100%",
    }
  }),
);

/**
 * TODO: make tab panel title consistent (e.g., select category, review point, and so on)
 *
 **/

const SearchController: React.FunctionComponent<{}> = (props) => {

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
    <Box component="div" >
      <AppBar position="static" color="default">
        <Tabs
          value={curTabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Result" {...a11yProps(0)} />
          <Tab label="Category" {...a11yProps(1)} />
          <Tab label="Price" {...a11yProps(2)} />
          <Tab label="Review" {...a11yProps(3)} />
          <Tab label="Discount" {...a11yProps(4)} />
          <Tab label="Release Date" {...a11yProps(5)} />
          <Tab label="Sort" {...a11yProps(6)} />
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
        render={() => <CategoryFilterTabPanel/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={2} 
        className={classes.tabPanel}
        render={() => <PriceFilterTabPanel/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={3} 
        className={classes.tabPanel}
        render={() => <ReviewFilterTabPanel/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={4} 
        className={classes.tabPanel}
        render={() => <DiscountFilterTabPanel/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={5} 
        className={classes.tabPanel}
        render={() => <ReleaseDateFilterTabPanel/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={6} 
        className={classes.tabPanel}
        render={() => <SortTabPanel/>} 
      />
    </Box>
  )
}

export default SearchController



