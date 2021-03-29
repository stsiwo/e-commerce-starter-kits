import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { AuthType } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import { commonRoutesData, RouteDataType, routesData } from '..';
import { withBasePage } from 'ui/hoc/withBasePage';
import NotFound from 'components/pages/NotFound';

const PageRoute: React.FunctionComponent<{}> = (props) => {

  const location = useLocation()

  /**
   * auth redux state
   **/
  const auth: AuthType = useSelector(mSelector.makeAuthSelector())

  const allRoutesData: RouteDataType[] = [
    ...routesData[auth.userType],
    ...commonRoutesData
  ];

  return (
    <Switch location={location}>
      {allRoutesData.map((route: RouteDataType) => (
        <Route
          exact
          key={route.url}
          path={route.url}
          component={route.component}
        />
      ))}
      <Route component={withBasePage(NotFound)} /> 
    </Switch>
  )
}

export default PageRoute

