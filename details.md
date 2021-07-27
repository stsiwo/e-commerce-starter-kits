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

  - hooks: brings local state (e.g., useState) and lifecycle features (e.g., useEffect) in functional components
    * can extract common logic into your custom hook and reuse in different UI components.
  - higher order components: wrap a component and add additional functionality (based on the decoartor pattern in design patterns)
    * redux hoc is a classic example of HOC when working with class-baesd components
  - render props: put components as a prop of another component
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
  
  - immutablejs: 
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
  
  - Controller: is responsible for accepting requests, delegate the task to application services, receive results, and return responses;
  - Application Service: coordinate tasks such as domain logic, security, and db transaction.
  
  
  
