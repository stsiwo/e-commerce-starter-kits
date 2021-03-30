import Header from 'components/common/Header';
import * as React from 'react';
import Container from '@material-ui/core/Container';

const BasePage: React.FunctionComponent<{}> = (props) => {

  return (
    <Container 
      maxWidth={false}
      disableGutters={true}
    >
      <Header />
      {props.children}
      {/** footer **/}
    </Container>
  )
}

export default BasePage


