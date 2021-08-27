import { ThemeProvider } from "@material-ui/core/styles";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import BrandNewProduct from "components/common/BrandNewProduct";
import { logger } from "configs/logger";
import { store } from "configs/storeConfig";
import { setupServer } from "msw/node";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { handlers } from "tests/msw/handlers";
import { theme } from "ui/css/theme";

const log = logger(__filename);

describe("(integration) home page", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should display recent products.", async () => {
    render(
      <Router>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <BrandNewProduct />
          </Provider>
        </ThemeProvider>
      </Router>
    );

    //fireEvent.click(screen.getByText("Load Greeting"));
    await waitFor(() =>
      expect(
        screen.getByText("More Brad New Products", { exact: false })
      ).toBeTruthy()
    );
  });
});
