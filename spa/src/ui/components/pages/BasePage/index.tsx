import Header from 'components/common/Header';
import * as React from 'react';
import Container from '@material-ui/core/Container';
import Footer from '../Footer';
import CartDrawer from 'components/common/CartDrawer';

const BasePage: React.FunctionComponent<{}> = (props) => {

  return (
    <React.Fragment>
      <Header />
      <Container
        maxWidth={'lg'}
        disableGutters={true}
      >
        {props.children}
      </Container>
      <Footer />
      <CartDrawer />
    </React.Fragment>
  )
}

export default BasePage


