import Content from 'components/pages/Content';
import { store } from 'configs/storeConfig';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core';
import { theme } from 'ui/css/theme';

const Index = (props: any) => {

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Provider store={store}>
            <Router>
              <Content />
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
