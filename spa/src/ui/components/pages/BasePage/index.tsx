import Header from 'components/common/Header';
import * as React from 'react';
import Container from '@material-ui/core/Container';

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
      {/** footer **/}
    </React.Fragment>
  )
}

export default BasePage


