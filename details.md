# Detail Explanation

## Front End 

### Overview

- ReactJS and TypeScript as fundamental dependencies.
- Redux and  Redux-Sage for the state management and side effects.
- Webpack for transpiling & bundling my source code.
- Material-UI for styling and UI components
- separate folders based on the responsibilities:
  * any domain conern stuff: domain directory
  * any state concern stuff: reducers directory
  * any UI stuff: ui directory
  * any side effects: sideEffects directory

### ReactJS

To organize the code (e.g., avoid any duplication on common logic), use hooks, higher order components, and render props.

  - __hooks__: brings local state (e.g., useState) and lifecycle features (e.g., useEffect) in functional components
    * can extract common logic into your custom hook and reuse in different UI components.
  - __higher order components__: wrap a component and add additional functionality (based on the decoartor pattern in design patterns)
    * redux hoc is a classic example of HOC when working with class-baesd components
  - __render props__: put components as a prop of another component
    * benefits: reusability of components which implements render props.
    * react-router used render props to abstract routing logic in <Route> component
  
To do lifecycle features:
  
  - use 'useEffect' hook.
  
To manage the state:
  
  - use Redux for any state needed to be shared by different components. you can still use the local state (e.g., useState) and pass the state as a prop but this make hard to maintains and increase complexity.
    so better to use the redux store. it also scalable.
  
  - use Redux-Saga for side effects (e.g., CRUD operation to APIs). technically, this is optional. you don't need to use this at all. for example, you can implement sending a request in UI components. if your project is relative samll, you can do this, so you can save a lot of time.
    But this is not scalable solution, and too many reponsibility on UI components so I decided to enclose side effect logic into different modules. 
  
to optimize the performance on any ReactJS project, we can do the following if necessary: 

  - use 'useMemo' for values and 'useCallback' for functions to avoid re-created every time the component is rendered.
  
    - functional component version of PureComponent
  
  - make sure always unsubscribe after a component is unmount when you subscribe something. use the return statement of 'useEffect' to unsubscribe. for example, you might
    to remove an event listener in a component when the component is unmount. 
  
  - __immutablejs__: 
    - value equality rather than reference equality.
    - stick to immutability for any object in immutablejs.
    - disadvantage of immutability: if you have really complicated and nested object, it could be performance issue esp when you wan to change a small portion of the state.
      - why? because it need to re-create the object from scratch. 
    - to overcome this issue, immutablejs use a special algorithm (e.g., use a copy of previous state for unchanged value and only create updated value while keep immutability)
  
    - this works well with React since it use shallow comparison (e.g., reference equality) (and that's why it is important to return new state rather than mutating the existing state in React) when updating the state.
    
    - if you have huge complicated and nested state, you can use immutablejs to improve the performance. 
  
  - make sure always measure the performance when optimization. Otherwise, you are just wasting your time. 
  
  - do performance optimization only when necessary since it is complciated & time-consuming task.
  
### Back End
  
follow the architecture. 
  
  - __Controller__: is responsible for accepting requests, delegate the task to application services, receive results, and return responses;
  - __Application Service__: coordinate tasks such as domain logic, security, and db transaction for each use case.
  - __Scheduled Task__: similar to Application Service, but it is based on schedules (e.g., [@Scheduled](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/annotation/Scheduled.html))
  - __Event Handler__: similar to Application Service, but it is based on events published by domains. (e.g., [@TransactionalEvnetListener](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/event/TransactionalEventListener.html))
  - __Domain Service__: handle complicated domain logic whish does not belong to any Aggregate, or does belong to multiple Aggregates.
  - __Aggregate__: a cluster of logcally grouped Entities (e.g., Order, Customer, and Review)
  - __Entity__: a domain object which can live on their own. identifier quality.
  - __Value Object__: a domain object which cannot be live on their own. value equality. 
  - __Data Model__: a representation of a database table.
  - __Repository__: encapsulate the logic required to access database.
  - __Infrastructure Service__: handle interactions with external service (e.g., Payment, AWS, and Shipping) and facade the defail implementation of the external system.
 
 here are some important implementations:
 
 - __AspectJ__: if you have any crosscutting concerns (db transactional management, logging), you can modularize the concerns and reuse for target components.
 
 - __MapStruct__: handle mapping of object from one to another efficiently. For example, when I map from a criteria model (e.g., input view model) to data model, I use MapStruct for the mapping. this is especially useful when you have a lot of fields to map.
 
 - __JPA Specification__: use JPA Specification interface to improve handling query strings for filter. the main reason why use this specification is to write code in more OOP way and avoid less maintainable code such as a lot of if statements. Also, it is extensible when you want to add a new query string parameter, you can just add a new class/method and register the specification. you don't need to modify/change the existing code ideally.
 
 - __Hibernate EntityListener__: you can register listeners which is called when a specific event happens such as before persist, after loading, and so on). I personally use this listeners for validation before persist entities. Also, if you have any @Transit fields, this is good place to set up the value with @PostLoad annotation.

 - __Flyway__: database versioning control. this makes easy to update existing database and its data in production. 
 
 - __Jacoco__: check the test coverage so you won't miss writing tests.
 
 ### Security
 
  - __Content Security Policy__: restrict domains that the browser should consider to be valid sources of executable scripts. This mitigates XSS attacks. 
 
  - __CORS__: list domains that the browser should consider to be valid sources to load/request. this prevents one domain from accessing sensitive data on another domain such as CSRF.
 
  - __Sanitize All User Input___: to prevent XSS attack and SQL injection. in front end and back end, don't forget validate input and sanitize it.
 
  - __No Dynamic Query__: to prevent SQL inject. in Hibernate, you always should use parameter binding (e.g., 'setParamter') and don't do like this (e.g., "SELECT x from " + input + "...")
 
  - __JWT HttpOnly & Secure Cookie and Double Submit Cookie__: JWT is a better approach than HTTP Basic Authentication with password. a client send the credential only once and exchange it a token (a.k.a JWT) with expiry, and use it to access to protected resources. Now, the problem is where to store the JWT in front end. if you store in session or local storage in browsers, it is under the target of XSS since js can access to those storage. the more secure approach is to use httpOnly & Secure Cookie (e.g., js cannot access and sent over TLS only) and put the token in the cookie. However, httpOnly cookie is well known as a target of CSRF. if a malicous attaacker sends a link which requests to the authorized web site, it might result in unwanted result for the victim. that's why I use Double Submit Cookie technique. you need to add an additional token (a.k.a csrf token) and ask auth users to send it with header, and the server verify the csrf token in header and cookie match each other. this mitigates CSRF attacks. 
 
 
 
  
  
