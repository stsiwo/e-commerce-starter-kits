import Content from 'components/pages/Content';
import { store } from 'configs/storeConfig';
import { CssGlobalContext, CssGlobalContextDefaultState } from 'contexts/cssGlobal';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStyle } from 'ui/css/base';
import CssBaseline from '@material-ui/core/CssBaseline';

const Index = (props: any) => {

  return (
    <React.Fragment>
      <CssBaseline>
        <GlobalStyle />
        <CssGlobalContext.Provider value={CssGlobalContextDefaultState}>
          <Provider store={store}>
            <Router>
              <Content />
            </Router>
          </Provider>
        </CssGlobalContext.Provider>
      </CssBaseline>
    </React.Fragment>
  );
};

ReactDOM.render(
  <Index />
  , document.getElementById('root')
)
