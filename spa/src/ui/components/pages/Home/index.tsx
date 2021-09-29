import Box from "@material-ui/core/Box";
import useTheme from "@material-ui/core/styles/useTheme";
import BrandNewProduct from "components/common/BrandNewProduct";
import DiscountProductList from "components/common/DiscountProductList";
import FeaturedProduct from "components/common/FeaturedProduct";
import Hero from "components/common/Hero";
import * as React from "react";

const Home: React.FunctionComponent<{}> = (props) => {
  const themes = useTheme();

  return (
    <React.Fragment>
      <Hero />
      <Box height={themes.spacing(10)}></Box>
      <BrandNewProduct />
      <Box height={themes.spacing(10)}></Box>
      <FeaturedProduct />
      <Box height={themes.spacing(10)}></Box>
      <DiscountProductList />
      <Box height={themes.spacing(10)}></Box>
    </React.Fragment>
  );
};

export default Home;
