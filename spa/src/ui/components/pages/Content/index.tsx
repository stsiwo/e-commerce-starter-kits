import * as React from 'react';
import { Button } from '@material-ui/core';

const Content: React.FunctionComponent<{}> = (props) => {

  return (
    <div className="content-wrapper">
      Happy Coding:)
      <Button color="primary">Hello World</Button> 
    </div>
  )
}

export default Content
