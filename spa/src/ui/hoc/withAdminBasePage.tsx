import * as React from 'react';
import AdminBasePage from 'components/pages/BasePage/AdminBasePage';

export const withAdminBasePage: (WrappedComponent: React.FunctionComponent) => React.FunctionComponent = (WrappedComponent) => {
  return () => (
    <AdminBasePage>
      <WrappedComponent /> 
    </AdminBasePage>
  )
}

