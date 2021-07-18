import Hero from "components/common/Hero";
import * as React from "react";
import BrandNewProduct from "components/common/BrandNewProduct";
import DiscountProductList from "components/common/DiscountProductList";

const Home: React.FunctionComponent<{}> = (props) => {
  return (
    <React.Fragment>
      <Hero />
      <BrandNewProduct />
      <DiscountProductList />
    </React.Fragment>
  );
};

export default Home;
