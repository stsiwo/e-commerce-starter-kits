import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { AuthType } from 'src/app';
import { mSelector } from 'src/selectors/selector';
import { commonRoutesData, RouteDataType, routesData } from '..';
import { withBasePage } from 'ui/hoc/withBasePage';
import NotFound from 'components/pages/NotFound';
import { usePrevious } from 'hooks/previous';
import { previousUrlActions } from 'reducers/slices/app';

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

  /**
   * previousUrl: every time url has changed, we keep track of this for the sake of "Redirect User After Login"
   *
   * - use 'usePrevious' and 'history.listen' method together. 
   *
   **/
  const history = useHistory()
  /**
   * use 'location.pathname' for teh initial landing page. does not necessarily "/" if users visit another url.
   *
   **/
  console.log("location variable")
  console.log(location)
  const [curUrl, setUrl] = React.useState<string>(location.pathname + location.search);
  const dispatch = useDispatch();

  React.useEffect(() => {

    return history.listen((location) => {
      setUrl(location.pathname + location.search)
    })

  }, [history])

  const previousValue = usePrevious<string>({ value: curUrl });
  dispatch(previousUrlActions.update(previousValue))

  /**
   * Not Found Page Logic
   *
   *  - the order matters.
   *
   *    - must make 'not found' page route at the last
   *  
   *  - other route must include 'exact'
   **/
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

