import Hero from 'components/common/Hero';
import * as React from 'react';
import BrandNewProduct from 'components/common/BrandNewProduct';

const Home: React.FunctionComponent<{}> = (props) => {

  return (
    <React.Fragment>
     <Hero />
     <BrandNewProduct />
    </React.Fragment>
  )
}

export default Home

