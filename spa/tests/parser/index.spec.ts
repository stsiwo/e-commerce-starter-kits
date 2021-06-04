import { toDateString } from "src/utils";

describe('normalizr lib testing', () => {

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
    ]
  })
  const ISORegex1 = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
  const ISORegex2 = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;

  it("blog normalizr", () => {

    console.log("before json parse")
    console.log(data)

    const obj = JSON.parse(data, (key: string, value: any) => {
      console.log("parser is called?")
      console.log(`key: ${key} and value: ${value}`)

      if (typeof value === 'string') {
        const a = ISORegex1.exec(value);
        const b = ISORegex2.exec(value);
        if (a || b) {
          console.log(`key: ${key} and value: ${value}`)

          console.log("type of value:")
          console.log((value as any) instanceof Date)

          const mydate = new Date(value)

          console.log("type of mydate:")
          console.log((mydate as any) instanceof Date)

          return mydate;
        }
      }

      return value
    });

    console.log("after json parse")
    console.log(obj)

    console.log("content?")
    console.log(obj.content)

    console.log("content size?")
    console.log(obj.content.length)

    obj.content.forEach((ele: { createdAt: any }) => {
      console.log(ele.createdAt)
      console.log("is Date")
      console.log(ele.createdAt instanceof Date)
      console.log(toDateString(ele.createdAt))

    })

    console.log("date print")
    console.log(new Date())


    expect(1).toBe(1)

  })

})
