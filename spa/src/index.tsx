import loadable from '@loadable/component';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Content from 'components/pages/Content';
import { store } from 'configs/storeConfig';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { theme } from 'ui/css/theme';

/**
 * dev env only
 **/
const RoleSwitch = (NODE_ENV === "development") ? loadable(() => import("tests/debug/compoments/RoleSwitch")) : null

const Index = (props: any) => {

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Provider store={store}>
            <Router>
              <Content />
              {(RoleSwitch &&
                <RoleSwitch />
              )}
            </Router>
          </Provider>
        </CssBaseline>
      </ThemeProvider>
    </React.Fragment>
  );
};

ReactDOM.render(
  <Index />
  , document.getElementById('root')
)
