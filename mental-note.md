# Mental Note

## My Goal

### build maintainable, testable and scalable web apps

#### maintainability: 

  - e.g., when requirement changes such as your client wants you to add a new feature, how easy to implement this feature.

  - important compoments:

    - code must be decoupled => 
        how to achieve:  use of oop (e.g., interface, polymorphism)
        why important: easy to debug and test
    - easy to test each compoenent => 
        how to achieve: use of oop and follow single responsbility principal. 
        why important: no regression error after change. 
    - code must be consistent  => 
        how to achieve: follow the architecture like clean architecture, DDD
        why important: effecient coding even if the domain change, we just need to copy and past and change the domain context.
    - avoid any duplication =>
        how to achieve: follow the single responibolity and teh architecture 
        why important: any repetetive code double your work.

#### scalability: 

  - when users/data increases, it still works expected.

  - important compoenents:

    - decide which component is scalable =>
      - how to achieve: careful detailed analysis of your domain (e.g., 'UserType' value object does need to be scalable compare to the 'User' aggregate since less likely to increase the data)
      - why importatnt: reduce unnecessary work to spend on for everything need to be scalable.

    - algorithm analysis
      - how to achieve: use of algorithm and calculate time & space complexity
      - why important: when increase the scale, negatively afftect your performance.

    - sql optimization:
      - how to achieve: avoid N+1 problem if you use orm and other tricky stuff.
      - why important:  when increase the scale, negatively afftect your performance.

#### testability:

  - test is the key to make our development effcient and generate long-term benefits (e.g., maintanability).

## Skills

 - comes up with as less-effort & effecient solution as you can. esp, when you update an existing web app, you need to comes up with the solution wihtout modify the internal architecture and following the architecture.

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

## React

### Props Vs Redux Store

  - if you use both, it might be inconsistency and produce bugs.

    - e.g., use of selector to grab data from store but the data is only available in the props. 

    - so if you use redux store, you should stick to redux store (not use props or local state).

### Domain Behavior and Selectors

  - (domain layer) =====> (selector layer) ======> (ui layer)
      - domain behaviors ====> selector which use the domain behaviors ============> use selector/domain behavior to display the data.

    - this pattern is useful when you don't store the data (e.g., local state) but want to filter/sort/calculate the local state with domain behaviors

## DDD

- why enclose several entities in an aggregate.

  - one change inside an entity might affect another entity in the same aggreagte.

    e.g., adding new product variant affect the properties of product (e.g., cheapest price & highest price)

## Testing

  ### Test Data

  - try to use nullable and default value fields in db as much as possible. this make me easy to create test data (e.g., you don't need to define the field and value at insert statement). 

  ### Test Case

  - when you create test cases, it should take it into account that if code is updated, the test case should be failed so that I can realize .. i don't know.

  ### What to Test

  - all use cases if possible (if it is impossble, test the edge case)
    - including error case.

  - each endpoint (integration test)

    - GET:
      - filter/sort/pagination

    - POST/PUT/PATCH
      - criteria validation

    - DELETE
      - check association deletion or no deletion.


## Java

- don't use "Double" because you cannot define the decimal point (e.g., double value might be 3.699999999999999733546474089962430298328399658203125)
  - use BigDecimal


## Security

## git-secrets

Check your git repo contains sensitive data that you specify as pattern.

### Prerequisite

  1. cloen git-secrets repo from https://github.com/awslabs/git-secrets
  2. run 'make install'

### Steps 

  1. go to the target repo where you want to check.
  2. add any pattern you want (e.g., if your db password: XXX, then you can run 'git secrets --add XXX')
  3. run 'git secrets --scan-history'. this check the current files and the history
  4. if it shows any result, remove it. If it is in the history, you need to use bfg to delete the history.
  
