import { ThemeProvider } from "@material-ui/core/styles";
import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import BrandNewProduct from "components/common/BrandNewProduct";
import { logger } from "configs/logger";
import { store } from "configs/storeConfig";
import { defaultUser } from "domain/user/types";
import { setupServer } from "msw/node";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { authActions } from "reducers/slices/app";
import { AuthType, UserTypeEnum } from "src/app";
import { testMemberUser } from "tests/data/user";
import { invalidAccessTokenHanders } from "tests/msw/handlers";
import { theme } from "ui/css/theme";
const log = logger(__filename);

describe("reducer app auth.", () => {
  const server = setupServer(...invalidAccessTokenHanders);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should be reset when 401 response.", async () => {
    store.dispatch(
      authActions.login({
        isLoggedIn: true,
        user: testMemberUser,
        userType: UserTypeEnum.MEMBER,
      })
    );

    render(
      <Router>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <BrandNewProduct />
          </Provider>
        </ThemeProvider>
      </Router>
    );

    const defaultAuth: AuthType = {
      isLoggedIn: false,
      userType: UserTypeEnum.GUEST,
      user: defaultUser,
    };
    //fireEvent.click(screen.getByText("Load Greeting"));
    await waitFor(() => expect(store.getState().app.auth).toEqual(defaultAuth));
  });
});
