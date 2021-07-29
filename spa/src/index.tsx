import { ThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import DemoDialog from "components/common/DemoDialog";
import DefaultHead from "components/head/DefaultHead";
import Content from "components/pages/Content";
import { store } from "configs/storeConfig";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { useLocation } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
/**
 * dev env only
 **/
//const RoleSwitch = (NODE_ENV === "development") ? loadable(() => import("tests/debug/compoments/RoleSwitch")) : null
/**
 * scroll polyfill
 **/
import smoothscroll from "smoothscroll-polyfill";
import { theme } from "ui/css/theme";

smoothscroll.polyfill();

/**
 * scroll to top when new page visit
 * https://reacttraining.com/react-router/web/guides/scroll-restoration
 **/
const ScrollToTop: React.FunctionComponent<{}> = (props) => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, [pathname]);

  return null;
};

const Index = (props: any) => {
  return (
    <React.Fragment>
      <Router>
        <ThemeProvider theme={theme}>
          {/** SnackbarProvider must be a child of ThemeProvider **/}
          <SnackbarProvider maxSnack={3}>
            <CssBaseline>
              <Provider store={store}>
                <ScrollToTop />
                <DefaultHead />
                <DemoDialog />
                <Content />
                {/**(RoleSwitch &&
                  <RoleSwitch />
                )**/}
              </Provider>
            </CssBaseline>
          </SnackbarProvider>
        </ThemeProvider>
      </Router>
    </React.Fragment>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
