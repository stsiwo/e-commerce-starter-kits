import axios from "axios";

/**
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
axios.defaults.transformResponse = [].concat(
  (data: any) => {
    console.log("start transforming response at middleware")
    /**
     * if data is empty, it might cause "Unexpected json at the end of line" error
     * so give a condition
     *
     * - SyntaxError: JSON.parse: unexpected character at line 1 column 2 of the JSON data:
     *
     *  - the data is already parsed (object) you don't need to parse again.
     **/

    /**
     * convert date string (response) to Date object (js) for all response
     *
     * - https://stackoverflow.com/questions/14488745/javascript-json-date-deserialization
     **/

    /**
     * TODO: fix this regex since this is not working.
     *
     *  - does not detect any date string format
     *
     *  - ref: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
     *  - ref: https://regex101.com/
     **/

    //const ISORegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    const ISORegex1 = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    const ISORegex2 = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;
    if (data) {
      console.log("before json parse")
      console.log(data)

      return JSON.parse(data, (key: string, value: any) => {
        console.log("after json parse")
        if (typeof value === 'string') {
          console.log(`${key} and ${value}`);

          const a = ISORegex1.exec(value);
          const b = ISORegex2.exec(value);

          if (a || b) {
            console.log("found date value")
            return new Date(value)
          }
        }
        return value
      });
    }
    return data
  },
  axios.defaults.transformResponse,
)

// set default 'withCredential'
axios.defaults.withCredentials = true;

export const api = axios;
