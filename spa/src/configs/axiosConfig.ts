import axios, { AxiosError } from "axios";
import { logger } from "configs/logger";
import { throttle } from "lodash";
import { messageActions } from "reducers/slices/app";
import { FetchStatusEnum, MessageTypeEnum, UserTypeEnum } from "src/app";
import { getCookie, getNanoId } from "src/utils";
import { store } from "./storeConfig";
const log = logger(__filename);

/**
 * TODO: create a global variable
 */
const display401MessageOnlyOnceThrottleFunc = throttle(() => {}, 1000);
/**
 *
 * need to be something like below:
 * ref: https://github.com/axios/axios/issues/430
 *
 * - be careful with the order of default.transformResponse and your custom tranform function.
 *
 *  - defaults.tranformResponse: does JSON.parse internally.
 *
 *    - so if you put defaults.tranformResponse first, your custom tranform receive parsed response object.
 *    - but if you put your custom tranform first, you receive json string as data.
 *
 **/
axios.defaults.transformResponse = [].concat((data: any) => {
  log("start transforming response at middleware");
  /**
   * if data is empty, it might cause "Unexpected json at the end of line" error
   * so give a condition
   *
   * - SyntaxError: JSON.parse: unexpected character at line 1 column 2 of the JSON data:
   *
   *  - the data is already parsed (object) you don't need to parse again.
   **/

  /**
     * response must be object.
     *
     * if the backend return string as resposne, this will complain about this (json parse error).

    /**
     * convert date string (response) to Date object (js) for all response
     *
     * - https://stackoverflow.com/questions/14488745/javascript-json-date-deserialization
     **/

  /**
   * date regex:
   *
   * ref: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
   *
   **/
  const ISORegex1 =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
  const ISORegex2 =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;
  if (data) {
    log("raw json string response");
    log(data);
    return JSON.parse(data, (key: string, value: any) => {
      if (typeof value === "string") {
        const a = ISORegex1.exec(value);
        const b = ISORegex2.exec(value);
        if (a || b) {
          return new Date(value);
        }
      }
      return value;
    });
  }
  return data;
});

/**
 * request interceptor
 *
 * (request) this is for csrf token to prevent this csrf attack.
 **/
axios.interceptors.request.use(function (config) {
  console.log("url: ");
  console.log(config.url);

  console.log("start chekcing csrf-token cookie exists or not");
  console.log(document.cookie.indexOf("csrf-token") != -1);
  console.log(document.cookie);

  // if cookie is set, attack this token to header as 'csrf-token=xxxx'.
  if (document.cookie.indexOf("csrf-token") != -1) {
    console.log("csrf-token in cookie does exist");
    const token = getCookie("csrf-token");
    console.log("token: " + token);
    config.headers["csrf-token"] = token;
  } else {
    console.log("csrf-token in cookie does not exist");
  }

  // issue:d_4Mxk3XkNd
  // this token cookie does not exist
  if (document.cookie.indexOf("csrf-token") == -1) {
    const auth = store.getState().app.auth;

    console.log("check auth state is set when csrf-token is not exist");
    console.log("is login?");
    console.log(auth.isLoggedIn);

    if (
      auth.userType === UserTypeEnum.MEMBER ||
      auth.userType === UserTypeEnum.ADMIN
    ) {
      console.log("detect authed user with expired token");

      store.dispatch({
        type: "root/reset/exceptMessage",
        payload: null,
      });

      // check local storage if auth & cart exists
      console.log("auth in local storage");
      console.log(localStorage.getItem("auth"));
      console.log("cart in local storage");
      console.log(localStorage.getItem("cart"));
    }
  }

  return config;
});

/**
 * response interceptor
 *
 * if receive 401 error, clear the all state of this user since auth is no longer valid.
 * re-authentication is required.
 *
 **/
axios.interceptors.response.use(
  (response) => {
    console.log("response of " + response.config.url);

    console.log("response cookie: " + response.headers);

    for (const [key, value] of Object.entries(response.headers)) {
      console.log(`${key}: ${value}`);
    }

    // put interceptors for any success response 2xx
    return response;
  },
  (error: AxiosError) => {
    // put interceptors for any error response outside 2xx
    log("checking response status == 401 or not");
    log(error);
    /**
     * 401
     */
    if (error.response.status === 401) {
      log("receive 401 response so clear the user store data.");
      store.dispatch({
        type: "root/reset/exceptMessage",
        payload: null,
      });
    } else {
      log("no 401 status code");
    }

    /**
     * handle all errors from api.
     *
     * issue: send a similar messages when failing fetch requests because of invalid csrf token.
     * display multiple same message with snackbar looks really bad to users.
     *
     * but, there is conditions:
     *  - the message state must be kept (see root/reset/exceptMessage)
     *  - the message must be the same as previous one. Otherwise, you will miss the next message when got two message simultaneously.
     *
     * TODO: should send a single request per page. this can avoid that you receive multiple errors messages.
     *
     */

    const curMessage = store.getState().app.message;
    // if 401 && current and nest message is the same => don't dispatch message.
    if (
      error.response.status === 401 &&
      curMessage.message == error.response.data.message
    ) {
      return Promise.reject(error);
    }
    // if not, dispatch message.
    store.dispatch(
      messageActions.update({
        id: getNanoId(),
        type: MessageTypeEnum.ERROR,
        message: error.response.data.message,
      })
    );

    return Promise.reject(error);
  }
);

// set default 'withCredential'
axios.defaults.withCredentials = true;

/**
 * default header content type.
 *
 * Axios converts this Javascript data to JSON by default.
 * It also sets the “content-type” header to “application/json”.
 * However, if you pass a serialized JSON object as data, Axios treats the content type as “application/x-www-form-urlencoded” (form-encoded request body).
 *
 *
 **/

export const api = axios;

export declare type AppPageResponse<C extends any> = {
  content: C;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  empty: boolean;
};

export declare type AppErrorResponse = {
  timestamp: Date;
  status: number;
  error: string;
  message: string;
  path: string;
};

export declare type WorkerResponse = {
  fetchStatus: FetchStatusEnum;
  message?: string;
  data?: any;
  content?: any;
  pageable?: any;
  totalPages?: any;
  totalElements?: any;
  last?: any;
  order?: any;
  clientSecret?: any;
  imagePath?: any;
  user?: any;
};
