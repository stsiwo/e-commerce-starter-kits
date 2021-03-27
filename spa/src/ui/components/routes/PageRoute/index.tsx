import * as React from 'react';
import { Button } from '@material-ui/core';
import { UserTypeEnum } from 'src/app';
import { routesData, RouteDataType } from '..';
import { Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router';

const PageRoute: React.FunctionComponent<{}> = (props) => {

  const location = useLocation()

  return (
    <section>
      <Switch location={location}>
        {routesData[UserTypeEnum.GUEST].map((route: RouteDataType) => (
          <Route
            path={route.url}
            component={route.component}
          />
        ))}
      </Switch>
    </section>
  )
}

export default PageRoute

