import * as React from 'react';
import { Button } from '@material-ui/core';
import PageRoute from 'components/routes/PageRoute';
import Header from 'components/common/Header';

const Content: React.FunctionComponent<{}> = (props) => {

  return (
    <React.Fragment>
      <Header />
      <PageRoute />       
    </React.Fragment>
  )
}

export default Content
