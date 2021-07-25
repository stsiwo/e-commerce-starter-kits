export declare type LogType = (message: any) => void;

export const logger: (filename: string) => LogType = (filename) => {
  return (message = "") => {
    if (NODE_ENV !== 'production') {

      const today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + ' ' + time;

      console.log(`[${dateTime}] at ${filename}: ${JSON.stringify(message, getCircularReplacer(), 4)}`);
    }
  }
}

/**
 * to prevent circular dependency from loop forever
 **/
export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};