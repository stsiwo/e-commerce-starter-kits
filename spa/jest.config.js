module.exports = {
  roots: ["<rootDir>/tests/", "<rootDir>/src/"],
  testRegex: "\\.(spec|test)\\.tsx?$",
  // need this to set env to browser base (not nodejs) e.g., make 'window' available
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "identity-obj-proxy",
    // sometime, might encounter 'cannot find module' error.
    // change the order of below mapping helps solve the error
    "^hooks(.*)$": "<rootDir>/src/ui/hooks$1",
    "^contexts(.*)$": "<rootDir>/src/ui/contexts",
    "^components(.*)$": "<rootDir>/src/ui/components$1",
    "^ui(.*)$": "<rootDir>/src/ui$1",
    "^requests(.*)$": "<rootDir>/src/requests$1",
    "^domain(.*)$": "<rootDir>/src/domain$1",
    "^actions(.*)$": "<rootDir>/src/actions$1",
    "^states(.*)$": "<rootDir>/src/states$1",
    "^reducers(.*)$": "<rootDir>/src/reducers$1",
    "^sideEffects(.*)$": "<rootDir>/src/sideEffects$1",
    "^configs(.*)$": "<rootDir>/src/configs$1",
    "^src(.*)$": "<rootDir>/src$1",
    //
    // remove below because of this error:
    // Could not locate module static-extend mapped as:
    // /home/sts/Documents/Workspace/Jobs/RyoheiKatoBlogApp/spa/static.
    //
    //"^static(.*)$": "<rootDir>/static",
    "^tests(.*)$": "<rootDir>/tests$1",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: [
    "<rootDir>/tests/jest-dom.config.ts",
    "<rootDir>/tests/localStorageMock.ts",
  ],
  globals: {
    NODE_ENV: "testing",
    API1_URL: "http://api.stsiwo.com",
    PUBLIC_IMAGE_PATH: "/images/",
    TEST_MEMBER_USER_ID: "c7081519-16e5-4f92-ac50-1834001f12b9",
    TEST_MEMBER_EMAIL: "test_member@test.com",
    TEST_ADMIN_USER_ID: "e95bf632-1518-4bf2-8ba9-cd8b7587530b",
    TEST_ADMIN_EMAIL: "test_admin@test.com",
  },
};
