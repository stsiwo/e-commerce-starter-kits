# Front End

## General Note:

- pagination.page (redux state)

  - starts from 0, (not 1) and when display, we increment by 1 to display the page number correctly.

  - this is because of Spring Boot framework.

- design note: when you want to assign fetch data as initial data of useState.

  - you might struggle with null safety of the state. e.g., every where you need to null check such as initial value of 'useState', inside useEffect, and inside render function. in this case, you can separate the component for two component. one of them is to fetch teh data and the other component is to manimulate the data as state.

  - checkout Product/index.tsx and ProductDetail/index.tsx

## Role Management Library: Casl

### Terms:

    - Direct Rules: e.g., 'can'

    - Inverted Rules: e.g., 'cannot'

    - Subject Type: class (or class name)

    - Alias: make you combine several actions into one.

### General Rules:

    - use json object to define abilites => more scalable and suitable for SPA

      - there are 3 types to define abilites ('defineAbility', 'abilityBuilder', 'JSON')

    - to define general rules first and more specific after general ones => to avoid confusion from inverted rules (e.g., 'cannot')?

    - use the direct rules as much as possible for readability and less confusion.

    - use the inverted rules only when you need to explicitly forbid access from a particular user.

    - this library uses MongoDB query language (e.g., $size, $lte, and so on), BUT you CANNOT use its logical operator (e.g., $and, $or, $nor...)
      - this is because (t1); casl already define the logical operator using its own logic.

    - use don't need to use Class to define abilities. you can achieve the same thing using a plain js object. (I prefer this one)

    - should use 'allowed'/'forbidden' rather than 'can'/'cannot' when defining rules since there are two 'can' method to define/use

### Tricky

    - (t1) see below:

    ```
      export default defineAbility((can) => {
        can('read', 'Article', { published: true }); // (1)
        can('read', 'Article', { published: false, status: 'review' }); // multiple fields is "AND" operator
        // multiple 'can' function call is 'OR' operator
      });
    ```
      - how do you translate this logic?
        ans) this user 'can read any article which is published' (1) "OR" 'can read any article which is unpublished "AND" is in review status

    - t2: Subject Type vs Instance

      - Subject Type: it validate based on this question: can user update title of at least one article.

      - Instance: it validate based on this question: can user update this article's title

      - so don't mixed up with Subject Type and Instance

    - t3: Subject Type detection:

      - if you don't want to use Class, you have two options to make Casl to detect a subject type.

        - use 'subject' helper (easier but not scallable)

        - use custom subject ytpe detection algorithm (more complicated but scallable)

    - t4: Alias only works in one direction.

        - alias: 'modify' => 'update' and 'delete', but this does not necessarily means that 'update' / 'delete' => 'modify'

## Material UI

### TextField Format:

    - need to use 3rd party library or implement its format on your own

      - ref: https://material-ui.com/components/text-fields/#formatted-inputs

      - ref: https://stackoverflow.com/questions/43134195/how-to-allow-only-numbers-in-textbox-and-format-as-us-mobile-number-format-in-re

### React Router Integration

    - how to integrate <Link> (react-router-dom) with <Link> (material ui) to take both benefits (make link work in spa and use layout/design of material ui)

      - solution: https://github.com/mui-org/material-ui/issues/9106

### Errors:

    - Failed prop type: The prop `children` is marked as required in `ForwardRef(Container)`, but its value is `undefined.

      - you need to create child component of the target component

      ```
        <TargetComponent>
          <h1>hey</h1> // <- need to put components
        </TargetComponent>
      ```

    - don't use "GroupButton" with "IconButton". this is not supported.

      - read this: https://github.com/mui-org/material-ui/issues/16156

      - use "Button" instead with Icon.

    - Jest with TypeScript:

      - TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'esnext' or 'system'.

      - background: Jest does not support this (ES2020) yet.

      - workaround: remove this import.meta and don't use this until Jest support this. use "__filename" instead.

      - src: https://github.com/facebook/jest/issues/11167

### Integration Link (material-ui) with React-Router-Dom Library

    - read this: https://material-ui.com/guides/composition/#link

### Drawer Not Showing Vertical Scrollbar.

    - this is because content deos not have min height. so set each min height. (e.g., CartItem#card#minHeight)

## Data Grid library

### Material UI

    - community version: https://material-ui.com/components/data-grid/getting-started/ (e.g., DataGrid)

    - paid version (e.g., XGrid)

### React Virtualized

    - https://github.com/bvaughn/react-virtualized (this one is really famouse, but I don't know why)

## General Errors

- Subsequent property declarations must have the same type. Property 'picture' must be of type ... at react related library

- this must that you using different version of React (esp, 17 and older one).

  - for example, your one of the dependency (react-redux) use the latest one but, you uses react 16 as main dependency of your project.

- bump up to react 17

- Select/TextField with 'select' prop

  - DON'T use 'currentTarget'!!! does not work!!

  - use 'target' instead.

## JS stuffs

### Arrow Functions vs 'function' Functions

    - the arrow function does not have 'binding' and 'arguments'.

      - so 'this' does not imply the surrounding object (see below example) and you cannot use 'argument' to access inputs like regular function.

    - e.g.,

    ```
      log(this == window); // true

      var object = {
        name: "Satoshi",
        a: () => log(this == window),
        f: function() { log(this == window) },
      }

      object.a(); // true
      object.f(); // no

    ```

      - arrow function does not bind 'this' to surrounding object. so 'this == window' = true.

### Loop With Async/Await

     for loop with async/await
      - you CANNOT USE forEach with await/async.
      - you must use 'for (... of ...)'
      - ref: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop

## Smooth Scroll Implementation

- use 'html { scroll-behavior: smooth; }' css

  => ie and Safari does not be suppored.

- use 'smoothscroll-polyfill' https://www.npmjs.com/package/smoothscroll-polyfill

  => to support browsers which are not suported above.
