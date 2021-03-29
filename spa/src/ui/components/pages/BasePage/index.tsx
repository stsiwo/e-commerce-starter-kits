import Header from 'components/common/Header';
import * as React from 'react';

const BasePage: React.FunctionComponent<{}> = (props) => {

  return (
    <React.Fragment>
      <Header />
      {props.children}
    </React.Fragment>
  )
}

export default BasePage


