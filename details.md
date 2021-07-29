# Detail Explanation

## Front End 

### Overview

- ReactJS and TypeScript as fundamental dependencies.
- Redux and  Redux-Sage for the state management and side effects.
- Webpack for transpiling & bundling my source code.
- Material-UI for styling and UI components
- Separate folders based on the responsibilities:
  * any domain concern stuff: domain directory
  * any state concern stuff: reducers directory
  * any UI stuff: ui directory
  * any side effects: sideEffects directory

### ReactJS

#### Hooks, HOCs, Render Props

To organize the code (e.g., avoid any duplication on common logic), use hooks, higher-order components, and render props.

  - __hooks__: Brings local state (e.g., useState) and lifecycle features (e.g., useEffect) in functional components
    * can extract common logic into your custom hook and reuse it in different UI components.
  - __higher order components__: Wrap a component and add additional functionality (based on the decorator pattern in design patterns)
    * redux HOC is a classic example of HOC when working with class-based components
  - __render props__: Put components as a prop of another component
    * benefit:  reusability of components that implement render props.
    * react-router used render props to abstract routing logic in <Route> component
  
#### Lifecycle Features:
  
  - Use 'useEffect' hook.
  
#### State Management:
  
  - Use Redux for any state that needed to be shared by different components. You can still use the local state (e.g., useState) and pass the state as a prop but this makes it hard to maintains and increase complexity.
    So better to use the redux store. It is also scalable.
  
  - Use Redux-Saga for side effects (e.g., CRUD operation to APIs). technically, this is optional. You don't need to use this at all. For example, you can implement sending a request in UI components. If your project is relatively small, you can do this, so you can save a lot of time.
    But this is not a scalable solution, and too much responsibility on UI components so I decided to enclose side effect logic into different modules. 
  
#### Performance 
 
To optimize the performance on any ReactJS project, we can do the following if necessary: 

  - Use 'useMemo' for values and 'useCallback' for functions to avoid being re-created every time the component is rendered.
  
    - functional component version of PureComponent
  
  - Make sure to always unsubscribe after a component is unmount when you subscribe to something. Use the return statement of 'useEffect' to unsubscribe. For example, you might remove an event listener in a component when the component is unmounted. 
  
  - __immutablejs__: 
    - Use value equality rather than reference equality.
    - Stick to immutability for any object in immutablejs.
    - Disadvantage of immutability: If you have a complicated and nested object, it could be a performance issue esp when you want to change a small portion of the state.
      - Why? Because it needs to re-create the object from scratch. 
    - To overcome this issue, immutablejs use a special algorithm (e.g., use a copy of the previous state for unchanged value and only create updated value while keeping immutability)
  
    - This works well with React since it uses shallow comparison (e.g., reference equality) (and that's why it is important to return a new state rather than mutating the existing state in React) when updating the state.
    
    - If you have a huge complicated and nested state, you can use immutablejs to improve the performance. 
  
  - Make sure to always measure the performance when optimization. Otherwise, you are just wasting your time. 
  
  - Do performance optimization only when necessary since it is a complicated & time-consuming task.
  
### Back End
  
follow the architecture. 
  
  - __Controller__: Accepting requests, delegate the task to application services, receive results, and return responses;
  - __Application Service__: Coordinate tasks such as domain logic, security, and DB transaction for each use case.
  - __Scheduled Task__: Similar to Application Service, but it is based on schedules (e.g., [@Scheduled](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/annotation/Scheduled.html))
  - __Event Handler__: Similar to Application Service, but it is based on events published by domains. (e.g., [@TransactionalEvnetListener](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/event/TransactionalEventListener.html))
  - __Domain Service__: Handle complicated domain logic which does not belong to any Aggregate, or does belong to multiple Aggregates.
  - __Aggregate__: A cluster of logically grouped Entities (e.g., Order, Customer, and Review)
  - __Entity__: A domain object which can live on its own. Identifier quality.
  - __Value Object__: A domain object which cannot be live on its own. value equality. 
  - __Data Model__: A representation of a database table.
  - __Repository__: Encapsulate the logic required to access the database.
  - __Infrastructure Service__: Handle interactions with external service (e.g., Payment, AWS, and Shipping) and facade the detailed implementation of the external system.
 
 Here are some important implementations:
 
 - __AspectJ__: If you have any crosscutting concerns (DB transactional management, logging), you can modularize the concerns and reuse them for target components.
 
 - __MapStruct__: Handle mapping of an object from one to another efficiently. For example, when I map from a criteria model (e.g., input view model) to a data model, I use MapStruct for the mapping. this is especially useful when you have a lot of fields to map.
 
 - __JPA Specification__: Use the JPA Specification interface to improve handling query strings for filtering. the main reason why use this specification is to write code in a more OOP way and avoid less maintainable code such as a lot of if statements. Also, it is extensible when you want to add a new query string parameter, you can just add a new class/method and register the specification. you don't need to modify/change the existing code ideally.
 
 - __Hibernate EntityListener__: You can register listeners which are called when a specific event happens such as before persisting, after loading, and so on). I use these listeners for validation before persist entities. Also, if you have any @Transit fields, this is a good place to set up the value with @PostLoad annotation.

 - __Flyway__: Database versioning control. this makes it easy to update the existing database and its data in production. 
 
 - __Jacoco__: Check the test coverage so you won't miss writing tests.
 
 #### Performance
 
 - __Algorithm Analysis__: Calculate time complexity and avoid O(n^2), O(2^n), and O(n!) as much as possible.
 
 - __Avoid N+1 Problem With Hibernate__: N+1 problem is a well-known issue when you deal with Hibernate. When you fetch an aggregate with its associations, the associations are lazily loaded (e.g., not fetched until you need it). This requires running an additional SQL statement so this ends up running N+1 SQL statement (i.e., 1 = the 1st SQL statement to fetch N aggregates and N = the following SQL statement to fetch its lazy-loaded associations). To avoid this problem, use 'fetch join' to fetch its associations eagerly.
 
 ### Security
 
  - __Content Security Policy__: Restrict domains that the browser should consider to be valid sources of executable scripts. This mitigates XSS attacks. 
 
  - __CORS__: List domains that the browser should consider to be valid sources to load/request. this prevents one domain from accessing sensitive data on another domain such as CSRF.
 
  - __Sanitize All User Input__: To prevent XSS attack and SQL injection. in the front end and back end, don't forget to validate input and sanitize it.
 
  - __No Dynamic Query__: To prevent SQL inject. in Hibernate, you always should use parameter binding (e.g., 'setParamter') and don't do like this (e.g., "SELECT x from " + input + "...")
 
  - __JWT HttpOnly & Secure Cookie and [Double Submit Cookie](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)__: JWT is a better approach than HTTP Basic Authentication with a password. a client sends the credential only once and exchanges it a token (a.k.a JWT) with expiry, and use it to access protected resources. Now, the problem is where to store the JWT in the front end. If you store in session or local storage in browsers, it is under the target of XSS since js can access that storage. The more secure approach is to use httpOnly & Secure Cookie (e.g., js cannot access and send over TLS only) and put the token in the cookie. However, httpOnly cookie is well known as a target of CSRF. If a malicious attacker sends a link that requests to the authorized website, it might result in unwanted results for the victim. That's why I use the Double Submit Cookie technique. You need to add a token (a.k.a CSRF token) and ask auth users to send it with a header, and the server verifies the CSRF token in header and cookie match each other. this mitigates CSRF attacks. 
 
  - __Security Headers__: Don't forget the following security headers in your web servers:
    * Strict-Transport-Security: Tell browsers that it should only be accessed using HTTPS (no HTTP). Many websites configure redirect from HTTP to HTTPS. This redirect creates a security hole such as a man-in-the-middle-attack. Therefore, setting this header prevents the security hole.
    * X-Frame-Options: Prevent the target page from being framed by another website. the difference btw frame-src (CSP) and X-Frame-Options is that frame-src restricts other resources. On the other hand, X-Frame-Options is used to restrict your page to be framed by other domains.
    * X-XSS-Protection: Used for only old browsers which don't support CSP, but you still should add this header.
    * X-Content-Type-Options: To prevent MIME sniffing (e.g., browsers try to correct the wrong extension and execute the file). This creates a security hole. for example, If malicious users upload a JS file as an image file and when other users access the website, the browser executes the js file by sniffing.
 
 
 
  
  
