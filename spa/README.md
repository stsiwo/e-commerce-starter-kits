# Front End

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

## Data Grid library

  ### Material UI

    - community version: https://material-ui.com/components/data-grid/getting-started/ (e.g., DataGrid)

    - paid version (e.g., XGrid)

  ### React Virtualized

    - https://github.com/bvaughn/react-virtualized (this one is really famouse, but I don't know why)

## Errors

  -  Subsequent property declarations must have the same type.  Property 'picture' must be of type ... at react related library

    - this must that you using different version of React (esp, 17 and older one).

      - for example, your one of the dependency (react-redux) use the latest one but, you uses react 16 as main dependency of your project.

    - bump up to react 17
