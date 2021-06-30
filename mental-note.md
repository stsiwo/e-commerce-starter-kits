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

## Testing

  ### Test Data

    - try to use nullable and default value fields in db as much as possible. this make me easy to create test data (e.g., you don't need to define the field and value at insert statement). 
