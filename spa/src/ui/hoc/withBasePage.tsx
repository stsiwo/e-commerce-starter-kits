import * as React from 'react';
import BasePage from 'components/pages/BasePage';

export const withBasePage: (WrappedComponent: React.FunctionComponent) => React.FunctionComponent = (WrappedComponent) => {
  return () => (
    <BasePage>
     <WrappedComponent /> 
    </BasePage>
  )
}
