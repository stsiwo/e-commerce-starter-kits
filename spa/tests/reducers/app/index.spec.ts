import { logger } from "configs/logger";
import { defaultUser } from "domain/user/types";
import { rootReducer } from "reducers/rootReducer";
import { AuthType, UserTypeEnum } from "src/app";
import { StateType } from "states/types";
const log = logger(__filename);

describe("reducer app state testing.", () => {
  test("should return the default app.auth", () => {
    const initialState: StateType = rootReducer(undefined, {
      payload: null,
      type: null,
    });
    const defaultAuth: AuthType = {
      isLoggedIn: false,
      userType: UserTypeEnum.GUEST,
      user: defaultUser,
    };

    expect(initialState.app.auth).toEqual(defaultAuth);
  });
});
