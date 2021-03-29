import * as React from 'react';
import Container from '@material-ui/core/Container';
import Header from 'components/common/Header';

const AdminBasePage: React.FunctionComponent<{}> = (props) => {

  /**
   * TODO: add base component for admin pages
   **/

  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  )
}

export default AdminBasePage



