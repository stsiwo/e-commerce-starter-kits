import NotFound from "components/pages/NotFound";
import { usePrevious } from "hooks/previous";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Route, Switch } from "react-router-dom";
import { previousUrlActions } from "reducers/slices/app";
import { AuthType } from "src/app";
import { mSelector } from "src/selectors/selector";
import { withBasePage } from "ui/hoc/withBasePage";
import { commonRoutesData, RouteDataType, routesData } from "..";
import { logger } from "configs/logger";
const log = logger(import.meta.url);

const PageRoute: React.FunctionComponent<{}> = (props) => {
  const location = useLocation();

  /**
   * auth redux state
   **/
  const auth: AuthType = useSelector(mSelector.makeAuthSelector());

  const allRoutesData: RouteDataType[] = [
    ...routesData[auth.userType],
    ...commonRoutesData,
  ];

  /**
   * previousUrl: every time url has changed, we keep track of this for the sake of "Redirect User After Login"
   *
   * - use 'usePrevious' and 'history.listen' method together.
   *
   **/
  const history = useHistory();
  /**
   * use 'location.pathname' for teh initial landing page. does not necessarily "/" if users visit another url.
   *
   **/
  log("location variable");
  log(location);
  const [curUrl, setUrl] = React.useState<string>(
    location.pathname + location.search
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    return history.listen((location) => {
      setUrl(location.pathname + location.search);
    });
  }, [history]);

  const previousValue = usePrevious<string>({ value: curUrl });
  dispatch(previousUrlActions.update(previousValue));

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
  );
};

export default PageRoute;
