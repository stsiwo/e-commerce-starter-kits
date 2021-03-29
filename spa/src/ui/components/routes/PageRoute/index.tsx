import * as React from 'react';
import { Button } from '@material-ui/core';
import { UserTypeEnum, AuthType } from 'src/app';
import { routesData, RouteDataType, commonRoutesData } from '..';
import { Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';

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
    <section>
      <Switch location={location}>
        {allRoutesData.map((route: RouteDataType) => (
          <Route
            key={route.url}
            path={route.url}
            component={route.component}
          />
        ))}
      </Switch>
    </section>
  )
}

export default PageRoute

