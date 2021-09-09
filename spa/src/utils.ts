import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

export const getApiUrl = (path: string): string => {
  if (!path) return null;

  return API1_URL + "/" + path;
};

/**
 * this format does not work.
 *
 * for example, it also include unspecified value. even if specifying year, month, and day, it also display hour, minute, day.
 *
 * currently, manually construct the desired format (e.g., date.getMonth() + "-" + date.getDay())
 */
export const dateFormatOption: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const dateShortFormatOption: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export const timeFormatOption: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export const hourMinuteFormatOption: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
};

/**
 * check if two dates are same or not.
 *
 * ignore time and only compare year, month and date.
 *
 **/
export function isAfterOrEqualDateOf(one: Date, two: Date) {
  if (!one || !two) {
    return false;
  }
  const oneDate = new Date(one.getTime());
  const twoDate = new Date(two.getTime());
  oneDate.setHours(0, 0, 0, 0);
  twoDate.setHours(0, 0, 0, 0);

  if (oneDate.getTime() >= twoDate.getTime()) {
    return true;
  } else {
    return false;
  }
}

/**
 * get today start from 00:00:00
 */
export function getTodayFromBeginning() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * get this month start from 00:00:00
 */
export function getThisMonthFromBeginning() {
  const today = new Date();
  today.setDate(1);
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * get this month start from 00:00:00
 */
export function getThisYearFromBeginning() {
  const today = new Date();
  today.setMonth(0);
  today.setDate(1);
  today.setHours(0, 0, 0, 0);
  return today;
}
/**
 * check if two dates are same or not.
 *
 * ignore time and only compare year, month and date.
 *
 **/
export function isBeforeOrEqualDateOf(one: Date, two: Date) {
  if (!one || !two) {
    return false;
  }
  const oneDate = new Date(one.getTime());
  const twoDate = new Date(two.getTime());
  oneDate.setHours(0, 0, 0, 0);
  twoDate.setHours(0, 0, 0, 0);

  if (oneDate.getTime() <= twoDate.getTime()) {
    return true;
  } else {
    return false;
  }
}

/**
 * check if the date is valid or not
 **/
export function isValidDate(d: Date) {
  if (!d) {
    return false;
  }
  if (isNaN(d.getTime())) {
    return false;
  } else {
    return true;
  }
}

export function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  else return null;
}

export function generateFileWithUuidv4(targetFile: File) {
  const blob: Blob = targetFile.slice(0, targetFile.size, targetFile.type);
  return new File([blob], targetFile.name.replace(/.*(?=\.)/, uuidv4()), {
    type: targetFile.type,
  });
}

export function getUuidv4() {
  return uuidv4();
}

export function getNonce() {
  return window.btoa(uuidv4());
}

export function convertStringToBase64(value: string) {
  return window.atob(value);
}

export function getTimeOneHourAfter() {
  const dt = new Date();
  dt.setHours(dt.getHours() + 1);
  return dt.getTime();
}

/**
 * get the last 10 years
 */
export function getPastTenYears(): number[] {
  const curYear = new Date().getFullYear();

  const result: number[] = [];

  for (let i = 0; i < 10; i++) {
    result.push(curYear - i);
  }

  return result;
}

/**
 * get available months
 */
export function getAvailableMonth(year: number): number[] {
  const curDate = new Date();
  const curMonth = curDate.getMonth() + 1;

  const result: number[] = [];

  if (curDate.getFullYear() == year) {
    for (let i = 1; i <= curMonth; i++) {
      result.push(i);
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      result.push(i);
    }
  }

  return result;
}

/**
 * get available months
 */
export function getAvailableDate(year: number, month: number): number[] {
  const curDate = new Date();

  let result: number[] = [];

  console.log("available date");
  if (curDate.getFullYear() == year && curDate.getMonth() == month) {
    console.log("if");
    console.log(curDate.getDate());
    for (let i = 1; i <= curDate.getDate(); i++) {
      console.log(i);
      console.log(curDate.getDate());

      result.push(i);
    }
  } else {
    console.log("else");
    console.log(curDate.getDate());
    result = result.concat(getDaysInMonth(year, month - 1)); // minus 1 since this month is start from one (not zero)
  }

  console.log("get available date: ");
  console.log(result);

  return result;
}

/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function getDaysInMonth(year: number, month: number): number[] {
  const date = new Date(year, month, 1);
  const days: number[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date).getDate());
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function filterEndYear(year: number, endYearList: number[]): number[] {
  return endYearList.filter((endYear: number) => endYear >= year);
}

export function filterEndMonth(
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number,
  endMonthList: number[]
): number[] {
  if (startYear === endYear) {
    return endMonthList.filter((endMonth: number) => endMonth >= startMonth);
  }
  return endMonthList;
}

export function filterEndDate(
  startYear: number,
  startMonth: number,
  startDate: number,
  endYear: number,
  endMonth: number,
  endDate: number,
  endDateList: number[]
): number[] {
  if (startYear === endYear && startMonth === endMonth) {
    console.log("same year and month");
    return endDateList.filter((endDate: number) => {
      console.log("filter endDate: " + endDate);
      console.log("filter startDate: " + startDate);
      return endDate >= startDate;
    });
  }
  return endDateList;
}

/**
 * check two object has the same properties (could have different values for the same properties)
 *  - just check two object has same form (properties) or not
 **/
export function isSameObjectForm(a: object, b: object): boolean {
  let isSame = true;
  Object.keys(a).forEach((key: string) => {
    if (!b.hasOwnProperty(key)) {
      isSame = false;
    }
  });
  return isSame;
}

export function transformObject<A extends object, B extends object>(
  original: A,
  destination: B
): B {
  if (!isSameObjectForm(original, destination)) {
  } else return destination;
}

/**
 * be careful !!!!
 * January is 0
 * December is 11
 **/
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthShortNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export function generateQueryString(target: { [key: string]: any }): string {
  const keys = Object.keys(target);
  let queryString = "?";
  keys.forEach((key: string) => {
    if (target[key]) {
      if (isDateObject(target[key])) {
        queryString += key + "=" + (target[key] as Date).toISOString() + "&";
      } else if (key == "categoryId" && target[key] == 0) {
        /**
         * if category=0 (e.g., all category), we not gonna append this query string.
         **/
      } else {
        queryString += key + "=" + target[key] + "&";
      }
    }
  });
  queryString = queryString.substring(0, queryString.length - 1);
  return queryString;
}

export function isDateObject(variable: any): boolean {
  return Object.prototype.toString.call(variable) === "[object Date]";
}

export function toStringToDateToString(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", dateFormatOption);
}

export function toDateShortString(date: Date): string {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", dateShortFormatOption);
  //return ` ${date.getDay()}`;
}

export function toDateMonthDayString(date: Date): string {
  if (!date) {
    return "";
  }
  //return date.toLocaleDateString("en-US", dateShortFormatOption);
  return `${monthShortNames[date.getMonth()]} ${date.getDate()}`;
}

export function toDateMonthString(date: Date): string {
  if (!date) {
    return "";
  }
  //return date.toLocaleDateString("en-US", dateShortFormatOption);
  return `${monthShortNames[date.getMonth()]}`;
}

export function toHourMinuteString(date: Date): string {
  if (!date) {
    return "";
  }
  //return date.toLocaleDateString("en-US", hourMinuteFormatOption);
  return date.getHours() + ":" + date.getMinutes();
}

export function toHourString(date: Date): string {
  if (!date) {
    return "";
  }
  //return date.toLocaleDateString("en-US", hourMinuteFormatOption);
  return `${date.getHours()}:00`;
}

export function toTimeString(date: Date): string {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", timeFormatOption);
}

export function toDateString(date: Date): string {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", dateFormatOption);
}

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getLatestDate(date1: Date, date2: Date) {
  return date1.getDate() < date2.getDate() ? date2 : date1;
}

/**
 * scroll features (onScroll)
 *
 *  - DEPRECIATED!! dont use this
 *
 **/

export const getPercentageOfScrollPosition: (
  curScrollPos: number,
  maxScrollPos: number,
  minScrollPos: number
) => number = (curScrollPos, maxScrollPos, minScrollPos) => {
  return ((curScrollPos - minScrollPos) * 100) / (maxScrollPos - minScrollPos);
};

/**
 * should return the value from "unitConsistentY = (inner element height) - (unit scroll top (= unitScrollPercentage * 10))"
 **/
export const calcUnitConsistentY: (
  innerElementHeight: number,
  unitScrollPercentage: number,
  elId: number
) => number = (innerElementHeight, unitScrollPercentage, elId) => {
  return -1 * elId * (innerElementHeight - unitScrollPercentage * 10 + 18);
};

export const calcCurGapX: (
  curScrollPercentage: number,
  elId: number,
  unitScrollPercentage: number,
  length: number,
  unitGapX: number
) => number = (
  curScrollPercentage,
  elId,
  unitScrollPercentage,
  length,
  unitGapX
) => {
  // when position Y of this element is above than cur scroll position, we need to decrease the gap scale
  if (unitScrollPercentage * elId <= curScrollPercentage) {
    return (
      -1 * ((unitGapX / unitScrollPercentage) * curScrollPercentage) +
      elId * unitGapX
    );
  } else {
    // when position Y of this element is below than cur scroll position, we need to increase the gap scale
    return (
      (unitGapX / unitScrollPercentage) * curScrollPercentage - elId * unitGapX
    );
  }
};

export const calcCurCirleGapX: (
  curScrollPercentage: number,
  elId: number,
  unitScrollPercentage: number,
  circleGapXCoefficient?: number,
  radius?: number
) => number = (
  curScrollPercentage,
  elId,
  unitScrollPercentage,
  circleGapXCoefficient = 1,
  radius = 100
) => {
  return (
    circleGapXCoefficient *
    (-1 * radius +
      Math.sqrt(
        -1 * Math.pow(curScrollPercentage - elId * unitScrollPercentage, 2) +
          Math.pow(radius, 2)
      ))
  );
};

export const calcCurScaleGap: (
  curScrollPercentage: number,
  elId: number,
  unitScrollPercentage: number,
  length: number
) => number = (curScrollPercentage, elId, unitScrollPercentage, length) => {
  // when position Y of this element is above than cur scroll position, we need to decrease the gap scale
  if (unitScrollPercentage * elId <= curScrollPercentage) {
    return (-1 / 100) * curScrollPercentage + (1 + elId * (1 / (length - 1)));
  } else {
    // when position Y of this element is below than cur scroll position, we need to increase the gap scale
    return (1 / 100) * curScrollPercentage + (1 - elId * (1 / (length - 1)));
  }
};

export const calcCurVisibility: (
  curScrollPercentage: number,
  elId: number,
  unitScrollPercentage: number,
  visibleUnitElementNumber: number
) => boolean = (
  curScrollPercentage,
  elId,
  unitScrollPercentage,
  visibleUnitElementNumber
) => {
  if (
    curScrollPercentage + visibleUnitElementNumber * unitScrollPercentage >=
      elId * unitScrollPercentage &&
    curScrollPercentage - visibleUnitElementNumber * unitScrollPercentage <=
      elId * unitScrollPercentage
  ) {
    return true;
  } else {
    return false;
  }
};

export const calcCurOverlapY: (
  curScrollPercentage: number,
  elId: number,
  unitScrollPercentage: number,
  length: number,
  unitOverlapYCoefficient: number
) => number = (
  curScrollPercentage,
  elId,
  unitScrollPercentage,
  length,
  unitOverlapYCoefficient
) => {
  // curScrollPosition percentage is above than its unit scroll percentage, we need to increase the the gap
  // also, reverse the sign (+ -> -) for 'translate(-xxpx)'
  if (unitScrollPercentage * elId <= curScrollPercentage) {
    return (
      unitOverlapYCoefficient *
      Math.pow(curScrollPercentage - unitScrollPercentage * elId, 2)
    );
  } else {
    // curScrollPosition percentage is less than its unit scroll percentage, we need to decrease the the gap
    return (
      -1 *
      unitOverlapYCoefficient *
      Math.pow(curScrollPercentage - unitScrollPercentage * elId, 2)
    );
  }
};

/**
 * new scroll elements on circle feature (onWheel)
 *
 **/

/**
 * calc the scale of current element.
 *
 *  - if the deg of the element == 0 mod 360, scale = 1
 *  - if the deg of the element == 180 mod 360, scale = 0
 *
 **/
export const calcScale: (deg: number, targetZeroDeg?: number) => number = (
  deg,
  targetZeroDeg = 90
) => {
  //const degModAbs = Math.abs(deg % 360)
  //const scaleRangeAbs = Math.abs((degModAbs - targetZeroDeg) / 180)
  //return scaleRangeAbs

  const scale =
    (1 / 2) * Math.cos(convertDegToRadian(deg + targetZeroDeg)) + 1 / 2;
  if (scale < 1 / 4) return 1 / 4;
  return scale;
};

/**
 * calc z-index of the current element
 *
 *  - reuse 'calcScale' since it has the same logic
 *
 **/
export const calcZIndex: (deg: number) => number = (deg) => {
  const scaleValue = calcScale(deg);

  /**
   * scale value must around 8750 (this is the z-index of icon at the center)
   *
   *  - 0 <= scaleValue * 100 <= 100
   *  - 8700 <= (scalevalue * 100 + 8700) <= 8800
   *
   **/
  return Math.round(scaleValue * 100 + 8700);
};

/**
 * make the element visible when followings:
 *  - (+): deg < 90 and deg > 270
 *  - (-): -90 > deg and -270 < deg
 *
 *  => make this visible only when the element comes in the right side of circle
 **/
export const calcVisibility: (deg: number) => boolean = (deg) => {
  const degModAbs = Math.abs(deg % 360);
  if (degModAbs < 90 || degModAbs > 270) return true;
  return false;
};

export const calcCenterPosX: (
  offsetLeft: number,
  clientWidth: number
) => number = (offsetLeft, clientWidth) => {
  // overflow when calc actual centerX so return 0 instead
  return clientWidth / 2;
  //return (clientWidth / 3)
  //return 0
};

export const calcCenterPosY: (
  offsetTop: number,
  clientHeigt: number
) => number = (offsetTop, clientHeigt) => {
  // put extra in order to make it center. (e.g., subtract half height of the element size)
  return clientHeigt / 2;
  //return (clientHeigt / 2) - 100;
};

export const calcCurPosX: (
  elId: number,
  r: number,
  unitDegree: number,
  alphaDeg?: number
) => number = (elId, r, unitDegree, alphaDeg) => {
  return r * Math.cos(convertDegToRadian(unitDegree * elId + alphaDeg));
};

export const calcCurPosY: (
  elId: number,
  r: number,
  unitDegree: number,
  alphaDeg?: number
) => number = (elId, r, unitDegree, alphaDeg) => {
  // need to make it 'minus' since y asix is the opposite to math
  return -1 * r * Math.sin(convertDegToRadian(unitDegree * elId + alphaDeg));
};

export const convertDegToRadian: (deg: number) => number = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * calc radiusWidth of ellipse
 *
 **/
export const calcRadiusWidth: (maxWidth: number) => number = (maxWidth) => {
  return (maxWidth * 0.7) / 2;
};

/**
 * calc radiusHeight of ellipse
 *
 **/
export const calcRadiusHeight: (maxHeight: number) => number = (maxHeight) => {
  return (maxHeight * 0.3) / 2;
};

/**
 * ellipse formula
 *
 **/
export const calcCurEllipsePosX: (
  elId: number,
  radiusWidth: number,
  radiusHeight: number,
  unitDegree: number,
  alphaDeg?: number
) => number = (elId, radiusWidth, radiusHeight, unitDegree, alphaDeg) => {
  // need to separate for + and -

  const curDeg = unitDegree * elId + alphaDeg;
  const curY = radiusHeight * Math.sin(convertDegToRadian(curDeg)); // y = b * sin(theta)
  return radiusWidth * Math.cos(convertDegToRadian(curDeg));
};

export const calcCurEllipsePosY: (
  elId: number,
  radiusWidth: number,
  radiusHeight: number,
  unitDegree: number,
  alphaDeg?: number
) => number = (elId, radiusWidth, radiusHeight, unitDegree, alphaDeg) => {
  // need to separate for + and -
  const curDeg = unitDegree * elId + alphaDeg;
  const curX = radiusWidth * Math.cos(convertDegToRadian(curDeg)); // y = a * cos(theta)
  // since browser x-y asix is the oppsite to math, change sign (- & +)
  return -radiusHeight * Math.sin(convertDegToRadian(curDeg));
};

/**
 *
 * async for each
 *
 *  - DON'T use normal forEach. it does not work.
 *
 *  - use this below.
 *
 *  - ref: https://gist.github.com/Atinux/fd2bcce63e44a7d3addddc166ce93fb2
 *
 **/
export const asyncForEach = async (
  array: any[],
  callback: (...args: any[]) => any
) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

/**
 * empty a value of all properties of a nested object
 *
 * NOTE: this makes array empty string, so if you have need to go into elements in the array and make it empty, you need to fix this.
 *
 **/
export const emptyNestedObject: (
  obj: Record<string, any>
) => Record<string, any> = (obj) => {
  Object.keys(obj).forEach((key: string) => {
    if (
      obj[key] && // prevent 'cannot convert undefined / null to object error
      Object.prototype.toString.call(obj[key]) !== "[object Date]" && // check current value is date object
      // check if it is array if so go to 'else'
      !Array.isArray(obj[key]) &&
      typeof obj[key] === "object" // for nested object
    ) {
      emptyNestedObject(obj[key]);
    } else {
      obj[key] = "";
    }
  });

  return obj;
};

/**
 * formatter
 **/
export const formatter = new Intl.NumberFormat("en-CA", {
  // string must match with spec otherwise won't render dollar sign properly
  // ?? i have no idea how this works? spell miss?? but now work correctly.
  style: "currency",
  currency: "CAD",
});

// price (currency)
export const cadCurrencyFormat: (amount: number) => string = (amount) => {
  return formatter.format(amount);
};

/**
 * request
 **/
export const isSuccessCode: (code: number) => boolean = (code) => {
  return code >= 200 || code <= 299;
};

/**
 *
 **/
export function iterateObjectRecursively(
  obj: Record<string, any>,
  callback: (key: string, value: any) => any
) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object") {
      iterateObjectRecursively(obj[key], callback);
    }

    obj[key] = callback(key, obj[key]);
  });
}

/**
 * temp id generate (only used in front-end and don't send it to backend)
 *
 * - or refactor to use this nanoid (https://www.npmjs.com/package/nanoid) and set id at the front-end and send it to backend and save it in db.
 *
 * - nanoid: smaller (21 symbols), faster (60% faster than UUID) and almost same safeer than UUID (36 symobols).
 *
 **/
export function getNanoId(): string {
  return nanoid();
}

/**
 * formData generator
 *
 * - need to test
 *
 * - ref: https://gist.github.com/ghinda/8442a57f22099bdb2e34
 **/
export function generateObjectFormData(
  input: any,
  form?: FormData,
  namespace?: string
): FormData {
  const fd = form || new FormData();
  let formKey;
  for (let property in input) {
    if (input.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + "[" + property + "]";
      } else {
        formKey = property;
      }
      if (
        typeof input[property] === "object" &&
        !(input[property] instanceof File) &&
        input[property] !== null
      ) {
        generateObjectFormData(input[property], fd, property);
      } else {
        if (input[property] !== false) {
          fd.append(formKey, input[property]);
        }
      }
    }
  }
  return fd;
}

/**
 * rename file.
 *
 *  - assuming that newName does not include extension.
 *
 *  - extract the extension from the original file and append it to new file name.
 **/
export function renameFile(file: File, newName: string): File {
  return new File([file], newName + "." + extractExtension(file.name), {
    type: file.type,
  });
}

/**
 * extract file extension from a given file
 **/
export function extractExtension(fileName: string): string {
  const re = /(?:\.([^.]+))?$/;
  return re.exec(fileName)[1];
}

/**
 * validation
 **/

// 2alpha country code for address
export function get2AlphaCountryCodeRegex(): RegExp {
  return /^(AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/;
}

// province list
export function getProvinceList(): string[] {
  return [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ];
}

export function getCountryList(): Record<string, string> {
  return {
    AF: "Afghanistan",
    AX: "\u00c5land Islands",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarctica",
    AG: "Antigua & Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermuda",
    BT: "Bhutan",
    BO: "Bolivia",
    BA: "Bosnia & Herzegovina",
    BW: "Botswana",
    BV: "Bouvet Island",
    BR: "Brazil",
    IO: "British Indian Ocean Territory",
    VG: "British Virgin Islands",
    BN: "Brunei",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    CV: "Cape Verde",
    BQ: "Caribbean Netherlands",
    KY: "Cayman Islands",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CX: "Christmas Island",
    CC: "Cocos (Keeling) Islands",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo - Brazzaville",
    CD: "Congo - Kinshasa",
    CK: "Cook Islands",
    CR: "Costa Rica",
    CI: "C\u00f4te d\u2019Ivoire",
    HR: "Croatia",
    CU: "Cuba",
    CW: "Cura\u00e7ao",
    CY: "Cyprus",
    CZ: "Czechia",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    SZ: "Eswatini",
    ET: "Ethiopia",
    FK: "Falkland Islands",
    FO: "Faroe Islands",
    FJ: "Fiji",
    FI: "Finland",
    FR: "France",
    GF: "French Guiana",
    PF: "French Polynesia",
    TF: "French Southern Territories",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GI: "Gibraltar",
    GR: "Greece",
    GL: "Greenland",
    GD: "Grenada",
    GP: "Guadeloupe",
    GU: "Guam",
    GT: "Guatemala",
    GG: "Guernsey",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HM: "Heard & McDonald Islands",
    HN: "Honduras",
    HK: "Hong Kong SAR China",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IE: "Ireland",
    IM: "Isle of Man",
    IL: "Israel",
    IT: "Italy",
    JM: "Jamaica",
    JP: "Japan",
    JE: "Jersey",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MO: "Macao SAR China",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MQ: "Martinique",
    MR: "Mauritania",
    MU: "Mauritius",
    YT: "Mayotte",
    MX: "Mexico",
    FM: "Micronesia",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MS: "Montserrat",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar (Burma)",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    NC: "New Caledonia",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    NU: "Niue",
    NF: "Norfolk Island",
    KP: "North Korea",
    MK: "North Macedonia",
    MP: "Northern Mariana Islands",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestinian Territories",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PN: "Pitcairn Islands",
    PL: "Poland",
    PT: "Portugal",
    PR: "Puerto Rico",
    QA: "Qatar",
    RE: "R\u00e9union",
    RO: "Romania",
    RU: "Russia",
    RW: "Rwanda",
    WS: "Samoa",
    SM: "San Marino",
    ST: "S\u00e3o Tom\u00e9 & Pr\u00edncipe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SX: "Sint Maarten",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    GS: "South Georgia & South Sandwich Islands",
    KR: "South Korea",
    SS: "South Sudan",
    ES: "Spain",
    LK: "Sri Lanka",
    BL: "St. Barth\u00e9lemy",
    SH: "St. Helena",
    KN: "St. Kitts & Nevis",
    LC: "St. Lucia",
    MF: "St. Martin",
    PM: "St. Pierre & Miquelon",
    VC: "St. Vincent & Grenadines",
    SD: "Sudan",
    SR: "Suriname",
    SJ: "Svalbard & Jan Mayen",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syria",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TL: "Timor-Leste",
    TG: "Togo",
    TK: "Tokelau",
    TO: "Tonga",
    TT: "Trinidad & Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TC: "Turks & Caicos Islands",
    TV: "Tuvalu",
    UM: "U.S. Outlying Islands",
    VI: "U.S. Virgin Islands",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VA: "Vatican City",
    VE: "Venezuela",
    VN: "Vietnam",
    WF: "Wallis & Futuna",
    EH: "Western Sahara",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
  };
}
