import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import TabPanel from './TabPanel';
import CategoryFilterTabPanel from './TabPanel/CategoryFilterTabPanel';
import PriceFilterTabPanel from './TabPanel/PriceFilterTabPanel';
import ReviewFilterTabPanel from './TabPanel/ReviewFilterTabPanel';
import DiscountFilterTabPanel from './TabPanel/DiscountFilterTabPanel';
import ReleaseDateFilterTabPanel from './TabPanel/ReleaseDateFilterTabPanel';
import SortTabPanel from './TabPanel/SortTabPanel';
import { ProductSortEnum } from 'domain/product/types';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabPanel: {
      maxWidth: theme.breakpoints.values.lg, 
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
   **/
  const curQuery = useSelector(mSelector.makeProductQuerySelector());

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
        render={() => <CategoryFilterTabPanel  curCategoryId={curQuery.categoryId}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={2} 
        className={classes.tabPanel}
        render={() => <PriceFilterTabPanel  curMinPrice={curQuery.minPrice} curMaxPrice={curQuery.maxPrice}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={3} 
        className={classes.tabPanel}
        render={() => <ReviewFilterTabPanel curReviewPoint={curQuery.reviewPoint}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={4} 
        className={classes.tabPanel}
        render={() => <DiscountFilterTabPanel curDiscountCheck={curQuery.isDiscount}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={5} 
        className={classes.tabPanel}
        render={() => <ReleaseDateFilterTabPanel curStartDate={curQuery.startDate} curEndDate={curQuery.endDate}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={6} 
        className={classes.tabPanel}
        render={() => <SortTabPanel curSort={ProductSortEnum.DATE_DESC}/>} 
      />
    </Box>
  )
}

export default SearchController



