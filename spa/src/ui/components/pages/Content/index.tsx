import * as React from 'react';
import { Button } from '@material-ui/core';
import PageRoute from 'components/routes/PageRoute';

const Content: React.FunctionComponent<{}> = (props) => {

  return (
    <div className="content-wrapper">
      <PageRoute />       
    </div>
  )
}

export default Content
