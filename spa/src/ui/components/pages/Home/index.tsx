import Hero from 'components/common/Hero';
import * as React from 'react';
import BrandNewProduct from 'components/common/BrandNewProduct';
import CategoryList from 'components/common/CategoryList';

const Home: React.FunctionComponent<{}> = (props) => {

  return (
    <React.Fragment>
     <Hero />
     <BrandNewProduct />
     <CategoryList />
     {/** one more section like contact or aboutus **/}
    </React.Fragment>
  )
}

export default Home
