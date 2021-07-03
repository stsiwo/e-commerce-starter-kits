# Mental Note

## Design Carefully

  - design carefully based on the following rules:

    - examine all use cases. if you miss, you might change the design at the later time of development. it is a huge time loss.

      e.g., product discount logic does not work and complex.

    - take it into account that expect change in the future.

    - the logic shouldn't be too complicated. you need to exaplain the logic to your client.

    - declarative programming (esp app service layer) to make us easy to understand what it is doing.

    - flexibility and complexity is tradeoff.
      - more flexible, more complxity
      - less flexible, less complexity

    - avoid write complicated code & sql.

      - hard to maintain.
      - find the simplest & easiest way to implement. e.g., don't write really complex sql. instead, create additinoal columns to make the sql easy.

## DDD

  - why enclose several entities in an aggregate.

    - one change inside an entity might affect another entity in the same aggreagte.

      e.g., adding new product variant affect the properties of product (e.g., cheapest price & highest price)

## Testing

  ### Test Data

    - try to use nullable and default value fields in db as much as possible. this make me easy to create test data (e.g., you don't need to define the field and value at insert statement). 
