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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

const SearchController: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();
  const [curTabIndex, setTabIndex] = React.useState(-1);

  function a11yProps(index: any) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {

    // toggle feature
    const nextValue = (curTabIndex === newValue) ? -1 : newValue

    setTabIndex(nextValue);
  };

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
          <Tab label="Category" {...a11yProps(0)} />
          <Tab label="Price" {...a11yProps(1)} />
          <Tab label="Review" {...a11yProps(2)} />
          <Tab label="Discount" {...a11yProps(3)} />
          <Tab label="Release Date" {...a11yProps(4)} />
          <Tab label="Sort" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel 
        value={curTabIndex} 
        index={0} 
        render={() => <CategoryFilterTabPanel  curCategoryId={"1"}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={1} 
        render={() => <PriceFilterTabPanel  curMinPrice={0} curMaxPrice={1000}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={2} 
        render={() => <ReviewFilterTabPanel curReviewPoint={0}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={3} 
        render={() => <DiscountFilterTabPanel curDiscountCheck={false}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={4} 
        render={() => <ReleaseDateFilterTabPanel curStartDate={new Date()} curEndDate={new Date()}/>} 
      />
      <TabPanel 
        value={curTabIndex} 
        index={5} 
        render={() => <SortTabPanel curSort={ProductSortEnum.DATE_DESC}/>} 
      />
    </Box>
  )
}

export default SearchController



