import { toDateString } from "src/utils";
import { logger } from "configs/logger";
const log = logger(__filename);

describe("normalizr lib testing", () => {
  const data = JSON.stringify({
    content: [
      {
        id: "1",
        createdAt: new Date(),
      },
      {
        id: "2",
        createdAt: new Date(),
      },
      {
        id: "3",
        createdAt: new Date(),
      },
    ],
  });
  const ISORegex1 =
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
  const ISORegex2 = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;

  it("blog normalizr", () => {
    log("before json parse");
    log(data);

    const obj = JSON.parse(data, (key: string, value: any) => {
      log("parser is called?");
      log(`key: ${key} and value: ${value}`);

      if (typeof value === "string") {
        const a = ISORegex1.exec(value);
        const b = ISORegex2.exec(value);
        if (a || b) {
          log(`key: ${key} and value: ${value}`);

          log("type of value:");
          log((value as any) instanceof Date);

          const mydate = new Date(value);

          log("type of mydate:");
          log((mydate as any) instanceof Date);

          return mydate;
        }
      }

      return value;
    });

    log("after json parse");
    log(obj);

    log("content?");
    log(obj.content);

    log("content size?");
    log(obj.content.length);

    obj.content.forEach((ele: { createdAt: any }) => {
      log(ele.createdAt);
      log("is Date");
      log(ele.createdAt instanceof Date);
      log(toDateString(ele.createdAt));
    });

    log("date print");
    log(new Date());

    expect(1).toBe(1);
  });
});
