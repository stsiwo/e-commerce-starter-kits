# Basic

  ## JPA vs Hibernate

    - JPA: a specification

    - Hibernate: an implementation of JPA

  ## JPA vs JDBC

    - JPA: a specification for ORM

    - JDBC: a specification for Database Access

  ## Project Structure

    - follow java's reverse domain name (e.g., com.example.project)

  ## ClassPath

    - teh path taht the java runtime environment searches for dependencies e.g., classes and other resources files.

    - default class path is the current directory. 

  ## Hot Swapping

    - bg) redeploy takes time every time developers change the source code and it is a pain in our neck.

    - solution) use Hot Swapping technologies, which allow us to change redefine the classes at runtime in JVM.

  ## Legacy Date (java.util.Date) vs Java 8 Date

    - don't use Legacy Date anymore!!

    - use new one!!

  ## Servlet

    - a class which responds to a particular type of network request - most commonly an HTTP request.

    - low level implementation of java based web framework.

    ### Servlet Container: 

      - a servlet run inside this container.

      - handles the networking side (e.g., parsing an HTTP request, connection handling etc)

      - Tomcat is one of the open source servlet container.

  ## Boolean Getter and Setter (lombok)

      - it changes the getter/setter (auto-generate) based on type (like boolean or Boolean)

        - boolean)

          - getter) isGood() 

          - setter) setGood()

        - Boolean)

          - getter) getIsGood()

          - setter) setIsGood()

      - ref: https://stackoverflow.com/questions/42619986/lombok-annotation-getter-for-boolean-field

  ## BigDecimal VS Double

    - BigDecimal: 

      - more precise and accurate

      - slower to execute

      - must use this if the context is money

    - Double

      - has a certain precison so less accurate.

      - faster

      - good enough if its context is not money

 Spring

  ## Dependency Injection

    - @Autowired: enable you to inject the object dependency implicitly. you don't need to write DI configuration (e.g., xml) explicitly. 

      - reference type object only (no primitive or string values)

      - you can omit @Autowired if a Spring bean, has ONLY ONE CONSTRUCTURE.

    - @ComponentScan: scan classes in order to make them into Spring beans.

        - scan all of @Bean and extended one (@Component, @Service, @Repository, @Controller, etc.) under the root directory including any nested directory.

    - @Bean: explicit, no auto-detect and no auto-configuration 

      - when you use @Bean you need to define the function and return the object that you want to use as a bean. then, you can use @Autowired to inject the object when runtime.

        ex)
            // AppConfig
            public PasswordEncoder passwordEncoder() {
              return new BCryptPasswordEncoder();
            }
            // this define a bean which is PasswordEncoder object (e.g., BcryptPasswordEncoder)

            // other class
            @Autowried
            private PasswordEncoder passwordEncoder;
            // the bean (BcryptPasswordEncoder object) is injected into this composition variable.
            

      - when to use?: https://stackoverflow.com/questions/10604298/spring-component-versus-bean

    - @Component: auto-detect and auto-configure beans using classpath scanning. 

    - so @ComponentScan spans all classes which has @Component and register it as a bean and then IoC container injects its corresponding object to @Autowired reference variables.

    - What about DI for interface and want to change its implementation dynamically? (polymorphism)

  ## Repository

    - JpaRepository: built-in Repository interface
      - you just need to create an interface for your target data model and you DON'T need to implement its implementation. Spring takes care that a creation of the implementation

      - ref: https://www.baeldung.com/spring-data-repositories

  ## Bean Naming Strategy

    - Spring gets the class name and converts the first letter to LOWERCASE!!!

      - ex) UserDetailsService class => bean name: userDetailsService


  ## DTO (ViewModel) and Entity Mapping

    - DON'T use @JsonIgnoreProperties and these kind of stuff. since every endpoint requires different entity structure.

      - ex)
          - user endpoints need to return users with its dependencies (like user_type, orders, reviews)
          - if you use @JosnIgnoreProperties stuff, restrict the entity structure to only one way.
          - if you use Mapper (like MapStruct), you are free to construct different entity structure as you want. 

  ## Pagination with Page Number (start from 0 instead of 1)

    - i don't know this is bug or not, but following approaches DON'T work.

      - application.properties: (spring.data.web.pageable.one-indexed-parameters: true)

      - bean config and set oneIndexedParamteres(true)  

  ## Request with Files and Json

    - ref: https://stackoverflow.com/questions/21800726/using-spring-mvc-test-to-unit-test-multipart-post-request

  ## Spring Events (ApplicationEventPublisher & ApplicationEvent & @EventListener/@TransctionalEventListener)

    ### IMPORTANT NOTE

      - must wrap with @Transactional for the calling function (e.g., serviceImpl) if you use @TransactionalEventListener.

  ## Error Handling

    - use @ResponseStatusException locally.

      -> this automatically assign ServletResponse.ErrorMessage and its body (the type if similar to 'ErrorBaseResponse').

    - if there are exceptions you can't handle with ResponseStatusException, use @ControllerAdvice class.

      -> return 'ErrorBaseResponse' object as a body of response.

      -> issue1: I don't know how to set ServletResponse.ErrorMessage with @ControllerAdvice. (e.g., I cannnot access to HttpServletResponse)

        => don't rely on ServletResponse.ErrorMessage at client side. always use the body.

# Spring Security

  - WebSecurityConfigurerAdapter class

    - configure method: 

        - HttpSecurity arg: 
    
          - use for configure security at a resource level. 

            - ex) if you want a rosource to be under spring security, you can use Matcher to only allow the access from specific role. 

        - WebSecurity arg: 

          - use for ignoring. 

            - ex) if you want some endpoint to be ignored by any Spring Security such as public endpoint, you can override this method

          - also, ignore any security concern such as XXS, CSRF, and so on. 
        
        - see: https://stackoverflow.com/questions/56388865/spring-security-configuration-httpsecurity-vs-websecurity

  - Authentication Provider:
    
    - process authentication request

    - several ways to implement this.

      - UserDetailsService interface:

        - used to retrieve user-related data.  

        - in most case, you can use this.

      - custom authentication provider:

        - 

  ## Custom User from UserDetails

    - need to create this to prevent a member user from accessing to another user data (like /users/{id}).
    - this is because default User does not have 'id' property so @PreAuthorize("hasRole('ROLE_ADMIN') or #user.getId() == #id") does not work well. (user.getId() does not exist).

    - check 'SpringSecurityUser' which extends User.

  ## Repository

    - don't return a differnt entity from an repository which define one.

      ex)
        ```  
          public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

            @Query(value = "SELECT * FROM users u WHERE u.email = ?1", nativeQuery = true)
            Address findByEmail(String email);  <- this gives you error. so just return User or Collection<User>
        ```

  ## Common Erros:

    ### rg.springframework.security.web.firewall.RequestRejectedException: The request was rejected because the URL contained a potentially malicious String "//"

      - this happens because you include invalid url in your form data, query string, or main url. 

      - e.g., form data:

        {
          image-path: "/products//image.jpg", // this cause the error.
        } 
  
# Spring Boot

  ## Starters 
    - def) a set of convenient dependency descriptors that you can include in your application. 
    - ex)
        spring-boot-starter-web: includes dependencies necessary for Web such as Spring MVC, Tomcat and Jackson and so on.

  ## Main Application Class

    - (recommend) put the class on the root directory of you app
      
      - @SpringBootApplication annotation: 
        - implicitly defines a base "search package" <- root package
        - @SpringBootApplication // same as @Configuration @EnableAutoConfiguration @ComponentScan

  ## Configuration Class

    - (recommend) create a single @Configuration class. 
    - (recommend) use java-based configuration rather than xml-based configuration

    ### Auto Configuration
    
      - (DON'T) you do not add both @SpringBootApplication and @EnableAutoConfiguration
      - according to docs, you add @SpringBootApplication or @EnableAutoConfiguration to @Configuratioin Class
      - using @SpringBootApplication/@EnableAutoConfiguration means that you opt in the auto configuration.
      - easy to override the config of auto configuration by explicitly defining your own configuration. (if you add your own DataSource bean, the default embedded database support backs aways. 

      - debugging)
        - start application with the --debug switch.

  ## Spring Beans and Dependency Injection 

    (recommend) use @ComponentScan (to find your beans) and using @Autowried (to do constructor injection).


  ## Spring Boot DevTools

    - caching: 
      - disable at development env but enabled at production

    - automatic restart:
      - restart whenever files on the classpath change.

  ## APPLICATION/GLOBAL variables

    - use 'application.properties' to define global variables and use @Value annotation to retrieve the value.

    - also, can use 'application.yml' which is a yml version of application.properties

    - ref: https://www.tutorialspoint.com/spring_boot/spring_boot_application_properties.htm

  ## TESTING

    - @SpringBootTest: 

  ## Diff Env with application.properties & profiles

    1. create 'application-<YOUR_ENV_NAME>.properties'

    2. run with this command) mvn spring-boot:run -Dspring-boot.run.profiles=<ENV_NAME>

    ref: https://stackoverflow.com/questions/31038250/setting-active-profile-and-config-location-from-command-line-in-spring-boot
    ref: https://www.baeldung.com/spring-profiles

  ## EMailing 

    - you don't need to create any @Bean and class for this. spring-boot automatically handle this.

      *you need to set properties for this email at application.properties. (see ref more detail)

    - ref: https://www.baeldung.com/spring-email

  ## DB Migration (Flyway)

    - ref: https://flywaydb.org/documentation/concepts/migrations.html#overview (official docs of Flyway)
    - ref: https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.batch (how to config Flyway with Spring Boot)

    - migrations: keep track of all changes on database.

    - types:

      1. versioned migration

        1.1. regular: 

          - has a verison (unique), a desc, and a checksum.

          - apply only once.

        1.2. undo: 

          - undo the regular one.

      2. repeatable migration

        - has a desc & a checksum, but no version

        - apply every time their checksum changes.

        - apply last after all pending versioned migrations are executed.

    ### Guide

      - you need to create migration file manually. there is no way to Flyway detect any change automatically and generate the files.

      - you can do DDL/INSERT/UPDATE/ALTER/DELETE as you like to manipulate any existing data.

      - (mysql) transaction does not work on DDL as you might know.
        => better to separate DDL migration file and data migration file seprately. make management easy.

    ### NOTE:

      - file name must comply the formats otherwise Flyway does not detect the files:

        - versioned migration: V<VERSION>__<DESC>.sql (e.g., V1_0_0__init.sql)

        - undo migrations: U<VERSION>__<DESC>.sql (e.g., U1_0_1__undo.sql)

        - repeatable migrations: R__<DESC>.sql (e.g, R__repeatable.sql)

# Hibernate

  ## Terms:

    - save() (from CrudRepository)

      - holds the persistable state in memory (not synchronize the saved data to db yet.)

      - so any 'save' does not really save it to db yet. you need to call 'flush' or 'commit'

    - flush() (from CrudRepository)

      - sync the saved state into db

  ## Don't use * (wildcard) with createQuery (JPA)

  ## JPA

    - Specification vs Querydsl

      - Specification:
        - you need to configure jpa 2 meta model auto generation processor with maven

      - Querydsl is simpler than Specification in JPA

      - https://spring.io/blog/2011/04/26/advanced-spring-data-jpa-specifications-and-querydsl/
      - https://github.com/querydsl/querydsl 

  ## @Transient vs @Formula

    - both have benefits and drawbacks.

      - @Transient: 
        - no sql required => easy to test
        - you cannot use Specification or any Hibernated related stuff since the field is not stored in db

      - @Formula:
        - require sql => hard to test & might duplicate business logic since you cannot abstract the logic.
        - you can use Specification or any Hibernate related stuff.


  ## Specification with Filtering Children Association (One-To-Many).

    - looks like this is impossible to do this. this will return the parent entity if one of child entity meets a condition.

    - ex. if you want to retrieve product (parent) and its reviews which are only verified (children).

      - goal:

          product1 -> review1 (verified) <- included
                   -> review2 (not verified) <- no included
                  -> review3 (verified) <- included

          product2 -> review1 (verified)<- included
                   -> review2 (not verified) <- no included
                   -> review3 (not verified) <- no included
                   -> review4 (verfieid)<- included
      
      - what i tried:

         ```   
          return builder.equal(root.join(Product_.reviews).get(Review_.isVerified), isVerifiedReviews);
         ```

        - this will return the products whose reviews are verfied at least one of them. and does not really filter that review entities.

      - solution:

        - don't use specification -> might be impossible to do this.

        - use @Where annotaiton / @FilterDef and @Filter to filter the child entities.

          - drawback: when retrieve the parent, the child entities is always filered. (e.g., when retrieve products, its reviews is always filtered (only verified) and you can't get all reviews including non-verified/verfieid one)

            - solution for this: to declare two properties such as 'verifiedReview' and 'allReviews' in the entity.

  ## CrudRepository & EntityManager

    - how to get EntityManager with CrudRepository;

      - you can inject with @PersistenceContext EntityManager entityManager at Service class.

  ## @Filter/@FilterDef

    - @FilterDef: define filter itself. e.g., name and its parameter.

      - only used for class level.

    - @Filter: define a filter based on the @FilterDef. e.g., the name param should be based on the name of @FilterDef, and the condition param, you can specify the condition using param defined at @FilterDef. 

      - you can use this at field, getter, and class level.

      - use SQL (not JQL, JPQL) in the condition.

    - ref: https://docs.jboss.org/hibernate/orm/4.3/manual/en-US/html/ch19.html

  ## Transaction

    - ref: https://dzone.com/articles/how-does-spring-transactional

    - nutshell) 
        - a persistence context (entitymanager) can holds as many as db transactions for atomicity, or you can separate the db transations in different persistence context by controlling 'isolation-level'

    - def) a single logical unit of work.

    - ex) 
        - transaction begin.
        - edit user and save it
        - edit address of the user and save it
        - transaction commit.

    - (Spring):

      - @EnableTransactionManagement: enable transactions in your project.
        
        - if you use SpringBoot, it is enabled by default.

    - JPA itself does not have declarative way to manage transaction (e.g., @Transactional), which means that you always have to something like this below:

      ```
        UserTransaction tx = entityManager.getTransaction();

        try {
          utx.begin();

          ... do something.

          utx.commit();
        } catch (Exception e) {
          utx.rolback();
          throw ex;
        }
      ```

        => obviously this is really bad, repetetive, hard to debug, error prone.

      so, Spring provide this, @Transactional. (but this is not equal to above code. @Transactional does more than that.)

      - @Transactinal

        - it has two concepts: 

          - the persistence context: (JPA) EntityManager, implemented internally with Session.

              - many transactions can happen inside a persistence context. 

          - the database transaction:  the scope of a single database transaction

          ex)

              |<------------------------persistence context (EntityManger) --------------------------------->|
                |<- db tx 1-->||<- db tx 2-->||<- db tx 3-->||<- db tx 3-->||<- db tx 4-->|

        * CrudRepository is implemented with @Transactional internally, so any method from the repository comes with transactional annotation.

        - wrapping function with @Transactional means that that function is wrapped with below code:

          ```
            createTransactionIfNecessary();
            try {
                callMethod();
                commitTransactionAfterReturning();
            } catch (exception) {
                completeTransactionAfterThrowing();
                throw exception;
            }
          ```

        - note:
            - you need to use @Transactional if you use multiple crudRepository inside the single method. just wrap the function with @Transactional .

      - Propagation: how a transaction should be handle if previous transaction exists.

          - REQUIRED (default): 
            - append if a previous one exist,
            - create if a previous does not exist

          - SUPPORTS:
            - append if a previous one exist,
            - execut non-transaction if a previous does not exist

          - MANDATORY:
            - append if a prevous one exist,
            - throw exception if a previous does not exist
          - NEVER:
            - throw exception if a previous one exist.
          - NOT_SUPPORTED:
            - suspend the previous one if it is exist, and execute the current wihtout transaction
          - REQUIRES_NEW:
            - suspend the previous one and execute the current with new transaction.
          - NESTED: (condition apply: see ref)
            - create a savepoint if the prevous one exist and execute after the savepoint. if it gets excepiton after the savepoint, it rollback to the save point.
            - create a new one if the previous does not exist.
           
      - Isolation: set visibility on different concurrent transaction.

        - concurrency side effects (considered as bad practice, so should be avoided)

          - see other section (search by 'Phantom') below.
      
    - read this about the propagation and the isolation: https://www.baeldung.com/spring-transactional-propagation-isolation

    ### Transactional Note:

      - maybe you don't need to add this annotation for all getter services.
        => sometimes, it causes this error.
          e.g., org.springframework.transaction.TransactionSystemException: Could not commit JPA transaction; nested exception is javax.persistence.RollbackException: Error while committing the transaction\n\tat org.springframework.orm.jpa.JpaTransactionManager.doCommit(JpaTransactionManager.java.

  ## Persitence Context

      - def) the first-level cache where all the entities are fetched from the database or saved to the database.

  ## Session

    - a single connection to database base.

  ## Transaction

    - a subset of Session for your a single logic 

    ex) 
        <------------------- Session ------------------------------>
        <--- Tx1 -----> <--- Tx2 ---> <--- Tx3 ---> <--- Tx4 -----> 

  ## Concurrency 

    - EntityManagerFactory: expensive-to-create, threadsafe object 
    
      - shared by all application threads.
  
      - usually, created at startup 

    - EntityManager: inexpensive, non-threadsafe object that should be used once, for single business process

      - it does not obtains JDBC connection unless it is needed, so you can open and close safely.

      - types (esp with spring)

          1. container-managed EntityManager: is injected into an enterprise component by using @PersistenceContext annotation.

            - nutshell) the container takes care of a transaction of entity manager, so you don't need to call 'tx.begin()'/tx.commit()'

            - charge of beggining the transaction, and committing and rolling back.

            - threadsafety: 

              - use can use @Autowired or @PersistenceContext

              - the container ensure that each EntityManager is confined to one thread.

          2. application-managed EntityManager: is manually created in an applicaton. 

            - nutshell) you have to manage the transaction manulally, you need to call 'tx.begin()'/'tx.commit()' 

            - you are responsible for the lifecycle of the entity mangaer (create, close)

    - concurrency access to the same records

      - Hibernate handle this in two ways:


        1. Optimistic Locking: (default of Hibernate)

          - versioning: add 'version' column to keep the current version of a target record/row

            - impl: 

              1. user @Version annotation to your target Entity. 
              2. you should not update/increment the version property explicitly. Hibernate automatically handle this.
              3. when you query (e.g., find) the target record, use 'LockModeType.OPTIMISTIC' or 'LockModeType.OPTIMISTIC_FORCE_UPDATE'

          - more than one users can access to the target row simultaneously, but the user who updates first wins, the other user get exception when he/she tries to update the target row since the version is different.

          - scallable since more than one users can access and do whatever they want, but only the user who update first wins and other got rejected. 

        2. pessimistic Locking: dominate the target row/record until you finish update. (you need to use this syntax to get pessimistic lock: SELECT ... FOR UPDATE)

          - the other user cannot access the target row until the dominant user release the lock.

          - not scalable since the other users have to wait for the dominant user.

          - two types of locks:

            - exclusive lock: can read and write in data when you hold an exclusive lock.
  
            - shared lock: can read but not write in data when someone else holds a shared lock.

          - does it throw exception when there is lock on the target record? or it just waits until the lock is released??

            - https://stackoverflow.com/questions/28304837/jpa-pessimistic-lock-what-happens-when-the-lock-exists

            - sounds like it will wait until the lock is released. but you could throw the exception if you want

      - Locking Mode:

        - OPTIMISTIC_FORCE_INCREMENT (Write)

          - force version update/increment even if there is no change on the target entity

        - OPTIMISTIC (Read)

          - version update/increment if there is change on the target entity

        - PESSIMISTIC_READ
      
          - teh target record is locked but others can read the record but they can't modify

        - PESSIMISTIC_WRITE

          - the target record is locked and others cannot read & modify 

        - PESSIMISTIC_FORCE_INCREMENT

          - the target record is locked and others cannot read & modify. if the entity has the version column, increment it even if no change.

      - concurrency side effects:

        - Dirty Read: reading uncommited record of the other

        - Non-Repeatable Read: during a transaction, value of a target record is different when query twice.

          e.g.,)
            1st query: user { id: 1, name: "tom" } 
                                                    <- the other access and update the user record between the queries.
            2nd query: user { id: 1, name: "sam" }

        - Phantom Read:  during a transaction, the number of rows are different when query twice.

          e.g.,)
            1st query: # of user: 10 
                                          <- the other access and insert/delete the user record btw the queries.
            2nd query: # of user 11 or 9

          - good ref: https://stackoverflow.com/questions/11043712/what-is-the-difference-between-non-repeatable-read-and-phantom-read

  ## Pattern

    - entitymanager-per-peration (ANTIPATTERN): open and close entity manager every single operation (crud) in a single thread.

    - entitymanager-per-request (COMMON): open a new entity manager for every single request and do all operations related to this request and close the entity manager after done the request.

  ## @Value annotation (or any other Spring annotation) with Hibernate Entity

    - this does not work together.

      - e.g., you CANNOT use Spring annotaitons inside Hibernate Entity (e.g., @Entity; domain class)

  ## Calculated Property (@Formula)

    - if you want to create additional property when mapping (esp for read-only), you can use @Formula annotation.

      - use SQL to calculate the value (not HQL, JPQL)

      - use 'id' to piont the current entity 

        - that id is sql column name for your target entity (not entity property name) (e.g., order_id, product_id and so on)

      - ref: https://stackoverflow.com/questions/2986318/how-to-map-calculated-properties-with-jpa-and-hibernate

    - @Formula/@Transient fields are not updated after saved (e.g., this.repository.save(domain))

      => you need to call 'this.repository.refresh(domain)' to reassign the fields.

  ## JOIN vs JOIN FETCH

    - 'JOIN FETCH': fetch teh associated entity into memory also. so you don't need to run another query for the entity in the future.

      - https://stackoverflow.com/questions/17431312/what-is-the-difference-between-join-and-join-fetch-when-using-jpa-and-hibernate

  ## N + 1:

    - def) one query for parent entity and N query for its child entity (esp, one-to-many relationship). if you deal with huge data, you negatively affect your performance.

      ex) 
         select * from parent;

         foreach: select * from child where parent_id = x;

         => N + 1 problem

    - solution to avoid)

      - fetch data including its child (e.g., association) as the initial query with 'JOIN FETCH' even if (EAGER/LAZY LOADING).

  ## Merge vs Persist

    - PERSIST: should be called only on new entities

    - MERGE: reattach detached entities

    see: https://stackoverflow.com/questions/4509086/what-is-the-difference-between-persist-and-merge-in-jpa-and-hibernate

  ## Refresh

    - re-populate the entity with latest data available in database.

  ## Cascade

    - PERSIST: whether you want to persist all children entities as well when persist its parent entity.

    - MERGE: whether you want to merge all children entities as well when merge its parent entity.

    - DELETE: whether you want to delete all children entities as well when delete its parent entity.

    - 

  ## Cascade.Remove vs orphanRemoval

    - orphanRemoval: when one of children is deleted (e.g., one of products which belong to this category is deleted from this category such as category.removeProduct(targetProduct), this product is deleted from db.
   
    - CascadeType.Remove: this category is deleted, all products which belong to this category are also deleted.

  ## Keep Insertion Order (Collection with @OrderBy)

    - using List is not enough to keep track of the insertion order. you need a column with @OrderBy to keep track of the insersion order from database.

    - usually, you can use a column (created_at: TIMESTAMP(6) - this keeps unto millisecond) so that you can keep the order.

  ## Associatioin

    - it is important to consider which is client and parent side.

      - parent side (a.k.a., owning side) (e.g., Phone)

        - should use 'mappedBy'


      - client side (a.k.a., owned side) (e.g., PhoneDetail)

        - should use '@JoinColumn'.

        - the one which cannot exist without the parent entity.

    - OneToOne: (IMPORTANT: don't use one-to-one reserve unidirectional -> this not gonna work)

      - you might think OneToOne with unidirectional is more efficient way but this reverse the parent-client concern.

        e.g., 

          Order: (@JoinColumn) => client side

          OrderAddress: (N/A) => parent side

            - because you don't need to keep the order concern (e.g., order_id) inside OrderAddress, but this reverse the relationship. Order should be parent and OrderAddress should be child (e.g., client).

            - and you always have to be ready to assign the order address id when creating. this is the reason why I can't make this work when creating order entity with order address. at this time, order address does not have any id since it is auto-increment id. 

      - this approach does not work as you expected.

        - should not use this one-to-one reverse unidirectional assocaition!!! does not work esp when creating association.

      - solution: 

          1. make bidirectional and fix the relationship: Order (parent) and OrderAddress (child), or

          2. use @PrimaryKeyJoinColumn: use parent primary id as primary key for child too. (this does not work if #Issue@1: multiple properties refers to teh same entity)

            - https://docs.jboss.org/hibernate/orm/5.2/userguide/html_single/Hibernate_User_Guide.html#entity-inheritance-joined-table

  ## Integration with javax.validation (JSR 303)

    => mainly for automatiion of validations on entities.

    => by default, Hibernate takes care of the automation so you don't need to implement anything such as registering EntityListener.

      ref: https://thorben-janssen.com/automatically-validate-entities-with-hibernate-validator/

      is this true? or bug
        => sometime, the validator is not triggered even if I annotated to an entity.

        => to make sure to add "EntityListener"!!

    ### NOTE

      - validating an associate from the parent entity with javax.validation annotation cause this errors: java.lang.NullPointerException: null
        at org.hibernate.collection.internal.AbstractPersistentCollection$5.hasNext(AbstractPersistentCollection.java:822) ~[hibernate-core-5.4.32.Final.jar:5.4.32.Final].
       
      ex) like @PhoneValidation at Phone Entity and try to save from User Entity which is the parent of this Phone entity.

      BUT, it is ok to if you try to validate the parent with its validation. it works nicely.
      
      ex) @CartItemValidation with CartItem Entity works well.

      - bugs?

        - EntityListener's domain does not have its association.

          e.g.,) product.productIages is empty at EntityListener's domain at Product. i don't know why.
 
  ## IMPORTANT NOTE

    - you need to database transaction has to be as short as possible to reduce lock contention.

      - long database transactions will prevent your application from scalling to highly concurrent load.

    - when you create a relationship with entities like parent and child, you need to call the 'setXXX' function on BOTH side if you want bidirectional.

      - otherwise, the foreign key is not properly assigned and you got 'xxxxx (foreign key) cannot be null'

    - FETCHING STRATEGIES:

      - I created query to avoid N+1 problem based on this ref.
      - ref: https://thorben-janssen.com/fix-multiplebagfetchexception-hibernate/
    
      - don't use 'eager loading'.

        - easier to cause Cartesian Product issue. also, hibernate prohibits you from more than 1 eager loading of child entity on a single parent entity.

          -> Cartisian Product issue:  (every time you use 'join fetch' this include duplicate if the association has multiple.)

            - if you use 'join fetch', the result included the duplicated records e.g,.:

                - product (parent) and reviews (children)

                result)
                  1, product A, review 1
                  2, product A, review 2
                  3, product A, review 3
                  4, product B, review 12,
                  ....

                  - this ends up a lot of redundancy and negative influence on performance. 

                  - also, Hibernate & Spring? does not allow to do if you try to do a lot of 'join fetch' (e.g., MultipleBagsException)

        - fetch children entities manually. BUT you should be careful about N+1 problem. (e.g., foreach each child entity)

          - in order to avoid N+1 problem, you need to fetch all of children entities simultaneously:

            - 1. use trick like 'parent.getChildren().size()' (this only apply when you want to fetch a single entity. if you try to do this like 'findAll', this is also repeated N times), or 

              - ref: https://stackoverflow.com/questions/2192242/what-is-lazy-loading-in-hibernate

            - 2. you use write sql query to fetch parent with its children on your own.

              - should use 'JOIN FETCH' to load its children.

              - what about with 'findAll' with specifications?? is it possible to customize these pre-defined query??

                - might be: https://stackoverflow.com/questions/21734149/namedquery-override-findall-in-spring-data-rest-jparepository

                - it said you can't override specifiction with query: https://stackoverflow.com/questions/61442486/how-to-write-custom-findall-with-specification-in-jpa-repository

                - got it. check this out: https://stackoverflow.com/questions/26291143/spring-data-jpa-jpaspecificationexecutor-entitygraph

                  - you need to override Repository interface to accept EntityGraph & Specification, (difficult to implement but flexible) or

                  - you can use EntityGraph & specification (without @query) to achieve eager loading with specifciation. (easy but im not sure it works.)

                    -> this will complains about "MultipleBagsException"

                - final solution: 

                  - to use custom query with your advanceRepository.

                  - process is a littgle bit completed but works fine.

                      - don't use built-in specificaiton function (e.g., findAll(Specification<T> spec, pageable))
                      - separate query to avoid "multipleBagsException" if you have a multiple associations.
                      - use TypedQuery and CriteriaQuery
                        1. use CriteriaQuery fisrt. this is to assign JPA specification expliclty and sort.
                        2. use TypedQuery (you need to convert CriteriaQuery to TypedQuery). this is to assign pageable.
                      - use 'query.setHint(QueryHints.PASS_DISTINCT_THROUGH, false);' if you use TypedQuery for this.

                      => check one of the implementation (e.g., 'findAllToAvoidNPlusOne' at AdvanceRepository)

  ## Injecting Spring Managed Bean (e.g., @Service, @Repository...) into JPA

    - this apply for EntityListener and Entity.

      - if you use Hibernate (>5.3) which has SpringBeanContainer feature, you can use this out of box. HOWEVER, in my case, it does not work. i tried several Hibernate version. but noen of them work.

      - if you use earlier version of Hibernate, implement below:

        - assuing you use EntityListener for an Entity.

          1. add @Component to the EntityLister class
          2. make the field 'static'
            ```
            static private EvenementPliRepository evenementPliRepository;
            ```
          3. create 'init' function like below:

            ```
              @Autowired
              public void init(EvenementPliRepository evenementPliRepository) 
              {
                  MyListenerClass.evenementPliRepository = evenementPliRepository;
                  logger.info("Initializing with dependency ["+ evenementPliRepository +"]"); 
              }
            ```
          * don't use above for any nested autowired beans, it only works on the top level bean.

        - ref: https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener

      - basically this is discouraged since all cases I tried causes errors:

        - try to validate uniquenss with repository inside entityListener => stackoverflow error: this repository.anymethod cause the trigger entitylistener again.

        - try to validate uniqueness with repository inside javax.validation (e..g, ConstraintValidator) => HHH000099: an assertion failure occurred (this may indicate a bug in Hibernate, but is more likely due to unsafe use of the session): org.hibernate.AssertionFailure: null id in com.iwaodev.infrastructure.model.Category entry (don't flush the Session after an exception occurs) error.

        => don't use repository insode entity or any classes triggered by entity class (e.g., entitylistner or custom validtion on entity field/class)

        => to check the uniquenss, do inside application service layer.

  ## EntityGraph:

    - runtime swiching of eager/lazy loading. 

      - more flexible static 'join fetch' or 'FetchType.EAGER'/'FetchType.LAZY'

  ## Customized Repository Implementation:

    - when you want to use complex query like you want to return Map rather than List, you need to use 'entityManager.createQuery' to return Map.

    - you can implement a fragment repository interface and provide the custom implementation (e.g., XXXRepositoryImpl)

    - repository naming convention: 

        - the name of repository interface and its implementation must be corresponding and you need to append 'Impl' to the implementation. (by default: you can customized this postfix at config)

        - e.g.,) CustomizedUserRepository (interface) and CustomizedUserRepositoryImpl (implementation)

    - by default:

      - you don't need to add any annotation (e.g., @Repository, @Component) to the interface and its implementation.

      - Hibernate looks up any sub pcakage of the package where it can find @Repository class.

        ex)
            project.application.repository <- @Repository class
            project.application.repository.custom <- your custom fragment implemantion.

        in this case, Hibernate autodetect the custom implementation.

    - what if I want to put custom implementations in different package?

      - you need to make the implementation as bean (could be @Component) and name it as the taraget implementation name.

        ex) 
          target repository: UserRepository
          target repository impl: UserRepositoryImpl

          customized repository: CustomizedUserRepository
          customied repository implementation: CustomizedUserRepositoryImpl (BUT you register this as @Component("userRepositoryImpl")) <-- this is IMPORTANT!!!

    - ref: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.custom-implementations.

  ## Issue:

    - 1) How To Deal With multiple properties which are pointing to the same entity (OneToOne).

      - from: https://stackoverflow.com/questions/4825253/i-want-to-store-customer-shipment-and-billing-address-should-i-do-in-one-table-o

      - ex)
        Order (shippingAddress: OrderAddress (shipping_address_id), billingAddress: OrderAddress (billing_address_id))
        OrderAddress (N/A)

      - how to make association with Hibernate:

          - see this: https://stackoverflow.com/questions/21345203/multiple-manytoone-fields-pointing-to-same-entity-in-jpa-hibernate

      - problems:

        - reverse relationship: 
          natual)
            Order: parent - OrderAddress: child
          this approach)
            Order: child - OrderAddress: parent (since Order holds foreign key).

          => this does not go well with orm esp when you want to delete Order, it does not delete OrderAddress too.

          -> also, when creating order, its order addresses does not created automatically (e.g., with MapStruct). you need to explicitly assign the order address id to make assiciation.

      - benefits:
        - less columns.
        - intuitive.
  
  ## Errors:

    - org.hibernate.loader.MultipleBagFetchException: cannot simultaneously fetch multiple bags.

      - when) try to set FetchType.EAGER on more than one child entities on a single parent entity.

      - reason) Hibernate try to prevent Cartesian Product issue

      - solution) you should avoid from setting FetchType.EAGER. it is not good idea generally. read this: https://stackoverflow.com/questions/4334970/hibernate-throws-multiplebagfetchexception-cannot-simultaneously-fetch-multipl.

        - you can handle fetching its association (e.g., phones and addresses when fetching user entity) by 
        

  ## Bugs:

     - hibernate return the same child entity twice in child list.
       e.g, orderEvents: [ { 101 } , { 102 }, { 102 } ] <- 102 is duplicate.
      
       workaround: use 'flush'. 
      
       otherwise, you might got an error 'object references an unsaved transient instance – save the transient instance beforeQuery flushing'.
      
        - this is because hibernate recognize that the entity change its state again by calling 'parent.getChildren().size()' wihtout flushing, so be careful!!!!
      
       ref: https://stackoverflow.com/questions/7903800/hibernate-inserts-duplicates-into-a-onetomany-collection

# MySQL

  ## TIMESTAMP VS DATETIME

    - TIMESTAMP: with time zone info

        - convert this TIMESTAMP values from the current time zone to UTC for storage and back from UTC to the current time zone for retrieval.

        - you need to set time zone for MySQL to adjust if rather than UTC

    - DATETIME: no time zone info

  ## Display Proper DateTime for Each Client

    1. store TIMESTAMP (UTC) in database
    2. display the date and time in client time (browsers)

    ref: https://stackoverflow.com/questions/2251780/php-ini-date-timezone-server-or-client-location-time-zone
    ref: https://stackoverflow.com/questions/10834665/how-can-i-handle-time-zones-in-my-webapp

    - questions)
      - how to save the timestamp with java data type?
        - is it ok to use LocalDateTime and can transmit it to mysql TIMESTAMP type?
        - see this: https://mkyong.com/java8/java-8-convert-localdatetime-to-timestamp/

  ## WHERE VS HAVING

    - WHERE: filters data before select.

    - HAVING: filters resulting data after select.

    ref: https://stackoverflow.com/questions/2905292/where-vs-having/18710763#18710763

  ## LEAST vs MIN

    - LEAST: you can compare multiple columns,

    - MIN: you can only compare a single column

  ## How to exclude NULL from min, max, sum ...

    ### Coalesce:

      - return the first non-null value in a list of arguments.

    ### use IFNULL.

      - e.g., greatest(IFNULL(column1, 0), ...)

    ref: https://stackoverflow.com/questions/3078370/how-to-find-least-non-null-column-in-one-particular-row-in-sql

  ## Distinct vs Group By

    - distinct: used to remove duplicated rows, so not duplicated row is never deleted.

    - group by: equivalent to 'Distinct'

  ## Cartesian Product (a.k.a CROSS JOIN)

    - you can think of Cartisan Product in Math. list of all possible combination of two tables.

    - generally, it is considered bad since it generates a lot of redundancy rows.

    - syntax) SELECT * from table_a, table_b or SELECT * from table_a CROSS JOIN table_b 

    - ex) see this: https://www.w3resource.com/mysql/advance-query-in-mysql/mysql-cross-join.php

# General Errors:

  - compiler error: [Java] Lambda expressions are allowed only at source level 1.8 or above

    - desc)
      - even if using source level 1.8 or higher, the compiler complains this.

    - solution)
      - you need to change config of pom.xml (maven)
      - https://github.com/redhat-developer/vscode-java/issues/328

  - jpa 2 meta model auto generation processor does not generate meta model for my persistent models

      - see this: https://stackoverflow.com/questions/48574857/static-metamodel-class-is-not-generated
      - you need to add hibernate-jpamodelgen to maven dependencies and setup the annotation processor with that jar. (see the pom.xml for more detail)

  - json parser issues
  
      in order for JSON parser to map json object to this class object, you need to have empty constructor.
        - error: JSON parse error: Can not construct instance of ...

  - Hibernate with 'detached entity passed to persist'

    - there are many reasons why cause this erro.

      - 1. @GeneratedValue but you try to assign the value explicitly. => don't set the value explicitly

  - Json DateTime Parsing (Deserialize/Serialize)

    1) when you use json file (like dummy form json)

      - use this format: '2012-04-23T18:25:43.511Z' so that you don't need to set any annotation for deserialization of LocalDateTime

    2) when use it as query string 

      - you can use above 1) so that you don't need to set annotation (like @DateTimeFormat) but i have not tested yet, or 

      - use this format: '2000-10-31T01:30:00.000-05:00' and you set @DateTimeFormat in your criteria object 

  - MapStruct with 'java.lang.StackOverflowError' 

    - you must have circular dependency in DTO. remove it!! 

# Questions

  - Can i create a custom annotation?

      - want to parse json resource to json string for testing

# Commands:

  - create a new mvn project
    - command)  mvn archetype:generate -DgroupId=com.iwaodev.com -DartifactId=api -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.0 -DinteractiveMode=false
      - note: you have to use a existing archetype for -DarchetypeArtifactId such as maven-archetype-quickstart

  - run project (esp spring boot)
    - command) mvn spring-boot:run (--debug)

  - run product with dpecific profile (e.g., env)
    - command) mvn spring-boot:run -Dspring-boot.run.profiles=<ENV_NAME> 

  - update pom.xml
    - command) mvn install (or package) 

  - clean 'target' directory
    - command) mvn clean
      * otherwise, deleted classes still complain.

  - clean 'target' directory & build again
    - command) mvn clean install

  - run without running test
    - command) mvn clean install -Dmaven.test.skip=true

  - test
    - command) mvn test

  - test run single test
    - command) mvn test=<TEST_CLASS_NAME> test

  - test run single test
    - command) mvn clean -Dtest=<TEST_CLASS_NAME>#<TEST_METHOD_NAME> test
      - should include clean also, otherwise, it uses old compiled file

  - check compiled class file
    - command) javap <YOUR_COMPILED_FILE>.class
      - you can't see the class file directly via ide

  - build docker image of your project.
    - command) mvn spring-boot:build-image -Dmaven.test.skip=true

  - compile (e.g., create .jar file) without test
    - command) mvn clean package -Dmaven.test.skip=true 

  - display dep tree
    - command) mvn dependency:tree

  - generate jacoco (test coverage) report
    - command) mvn clean jacoco:prepare-agent install jacoco:report 
    - config ref: https://stackoverflow.com/questions/36304793/jacoco-with-maven-missing-execution-data-file/36305148#36305148

  ### General

  - search and replace text in multiple files recursively.
    - command) find . -type f -name "*.java" -exec sed -i 's:<Original_Text>:<New_Text>:g' {} +

# Design Issue

  - how to deal with soft delete of users??

      - email unique not allowed deleted users to re-signup again. <- ask the user to recovery, or create new one if it passed a week.

      - inform the user that takes a week or something to completely remove your account, and if you change your mind, you can request recovery within the period. then admin users can delete the user account completely or automate this process.

      - better to do this soft delete.

  - how to display product variants' discount info (if necessary) on the product list.

    - if one of the variants of the product is discounted, that information should be on the product list page.

    - current solution: to include all product variants in response dto then iterate all variants of the product so that you can check if that has dicsount.

  - remove isBilling/isShipping column from database.

    - users can decide it is billing address or shipping address when they purchase.

    - keeping this columns make us difficult to manage (e.g., what if users have multiple shipping addresses or billing address)

  - order events:

    - rather than creating columns for each event in orders table, it might be better to create order_events table.

    - ref: https://www.codeproject.com/Articles/105768/Audit-Trail-Tracing-Data-Changes-in-Database

    - issues:
    
      - how to deal with undo procedure.

        - my idea is to create a column 'is_undo' then if the event is undone, turn the value to true.

        - and condition is that users can undo the last event only (e.g., not to the 2nd to the last)

          - how to implement this undo feature?

            - e.g., every time we add an event, pick up the last event and make this "undoable" false and make the new event's 'undoable' true.

          - this undo/cancel the event is tricky!!!


  - Guest Order Details:

    - how to deal with orders with guest user?

      - should I create guest user account on user tables, or embed guest user information to orders table?

        1. guest user account on user tables.

          - pros:

            - admin can browses the guest user info at user management page

          - cons:

            - what if the same guest user buy multiple times?

              - since user account (e.g., email) not allow to duplicate so => does not work.


      2. embed guest user information to orders tables

         - pros:

            - overcome the problem of 1 above

         - cons:

            - I have to create order_address table & add columns to orders to embed guest user info

      => go for number 2

        ref: https://softwareengineering.stackexchange.com/questions/369276/handling-guest-users-in-ecommerce-application


      details:

        - make user_id of order table optional.

        - (GUEST):

          1. place an order 

          2. ask the guest user to provide shipping and billing address, phone, email, and name

          3. fill out the order

          4. persist (don't create guest user account on user tables)

        - (MEMBER):

          1. place an order

          2. ask the member user to select shipping, billing address, and phone, email, and name

          3. fill out the order (copy the user info (e.g., address, phone, email, name) to the order form

          4. persist (copy user info to order)


  - Cart Stock Number.

    - the stock data might be stale if other customer purchase the same product variants.

      - one solution: raise event when the product variant is purchased, then go through all cart items and if there is the same product in the cart of someone, ajust the stock number. nice!!

  - Move Wishlist item to Cart

    - disable this since wishlist does not hold variant information so techically impossible to do this.

    - workaround: create 'detail' button on each product item on wishlist and make customers select its variant to be in cart.

    - this is not true!!. whishlist table stores variant id!! so you can use 'move to cart' button as usual.

  - Updating Child Entity (e.g., ProductSize, Category)

    - current implementation is not good since child entity is also updated. e.g., when upating product, its corresponding productSize, category is also updated. if someone hack the request and manipulate category and product size, the malicious data is inserted into database.

    - fix this if you have time.

  - How to generate short id rather than UUId (too long...)

    - check this website from nanoid package, you can calculate smallest short id with no duplication (collision) in terms of date.

    - according to this website, 11 chars is good to enough!!.

    - ref: https://zelark.github.io/nano-id-cc/

  - Email with Admin Company State

    - it might be better to create a column (e.g., domain) and use this as part of the email .
        - (e.g., when sending 'signup' email, no-reply@<ADMIN_DOMAIN>. when sending 'contact' email, inquiry@<ADMIN_DOMAIN>.)

  - Guest User Order history.

    - what if the guest who has order history signup?

      - is it possible to merge the order history to the member? this might be possible since we keep the order even if the guest user.

        - we can use the email address when the guest used and merge to the order history when the guest user becomes member.

        - also we need to send an request to Stripe to regiter the user as member.member


# DDD Implementations 

  - seprating Domain Model and Persistent Model.

    - this does not go well if you use JPA & Hibernate since Hibernate & JPA consider persistent model as domain model.
 
    - ref:  https://docs.jboss.org/hibernate/orm/5.0/mappingGuide/en-US/html_single/#entity

    - **therefore, better not to separate DM and PM. think those as the same thing, and if you really want to follow DDD, separate DM and PM, you should not use Hibernate & JPA, or you need to deal with following concerns**:

      1. how to map DM and PM
      2. how to persiste DM in database

  - Domain Events With AbstractAggregateRoot (import org.springframework.data.domain.AbstractAggregateRoot):

    - **CHANGE: we decided to use Spring Events instead of AggregateRoot Event.**

      - reasons: there are several pitfalls on AggregateRoot Event

        1. you must call 'save' to publish an event. some cases, you want to publish an event without an event.

        more details: https://www.baeldung.com/spring-data-ddd.

      - check Spring Events: https://www.baeldung.com/spring-events

      - how to implement: https://howtodoinjava.com/spring-core/how-to-publish-and-listen-application-events-in-spring/

    steps:

      1. extends 'AbstractAggregateRoot<Aggregate> // Aggregate is your Aggregate Entity  

      2. create an event class (e.g., OrderFinalConfirmedEvent class)

      3. publish an event any where you want. esp inside its business behavior with 'registerEvent()'
      4. create an event handler for the event (e.g., OrderFinalConfirmedEventHandler)

        - add @Service to put this class available via DI

        - create an handler method with @TransactionalEventListener with the event as argument.

      4. when the behavior method is called, registered event handler is called (e.g., OrderFinalConfirmedEventHandler)

    - note:

      - you need to add @Transactional (spring one) at method/class where you raise this event.

      - you need to call 'repository.save' to invoke the event handler is called.

      - ref: https://zoltanaltfatter.com/2017/06/09/publishing-domain-events-from-aggregate-roots/

  - is it ok to return domain model from application service?

    - sometime, make me feels that I should enclose the all logic into application service. the other client such as event handler or controller can call the a method as desired.

    - also, this allows me to decouple application.

      => maybe, you need to create 'domain service'.

  - should not mix the use case. 

    - should create each use case without coupling. what you need to reuse is domain logics.

    ex)
      use cases: event handler or application service.

        - if we received payment_failed event, the handler should coordinate the use case using domain behaviors/service.

          - if you also received session_time event about an order, you shouldn't reuse the 'payment_failed' event handler even if it has some common parts. you should create independent use case.

        (use case1): 
           (application service/event handler):
              <--- domain behavior A
              <--- domain service A
              <--- security and db transaction. 

        (use case2): 
           (application service/event handler):
              <--- domain behavior A
              <--- domain service B
              <--- security and db transaction. 

          => you should not mix use case 1) and use case 2). this is not good practice.

# Security

  - don't accept the price from untrusted place (e.g., front-end). always determine the price in server side.

  - guest user order.

    - should I create temp user id for guest user for the order row? 

      bg) i need to open the endpoint (orders/{orderId}/events/session-timeout) 

        - for security, i want to avoid others can manipulate orders.

          - currently, if anyone can know the orderId and orderNumber can add 'session-timeout' event to the order, but if i give an additional constraint such as temp guest user id with expiry, it increase more security since once the guest user id expired, no one can add 'session-timeout' event. 

      - am I thinking too much??

# Payment Integration (Stripe): 

  - setup_future_usage: 

      - on_session: the customer is active when checkout (e.g., usually checkout flow on ecommerce)

      - off_session: the customer is off (without direct invlovement). (e.g., subscription fee)

    - off_session is likely to be rejected. ??

    - ref: https://stripe.com/docs/payments/payment-intents#future-usage
    - ref: https://stripe.com/docs/payments/save-during-payment#web-submit-payment

# Shipping Integration:

  ***important note***: we only use this for rating at v1. this means that my client need to ship manually.

  - use Canada Post

    - need to create an account for Business

    - need to join to Canada Post Developer Program to use its service via api

      - main page: https://www.canadapost-postescanada.ca/information/app/drc/registered?execution=e1s1

    - terms:

      - customer id: 10 digits number of your company as customer (you can check the number at left top corner on dashboard or any your admin page).

      - rating service: get an estimate time and price 

      - returns service: get/create an return label in the case of returning items from your customer.

      - mail deposit location: a location where you can drop off the item which is supposed to be shipped?? -- make sure this.

    - Q&A:
    
      - how/when to pay shipping cost via online?

        - when you create NonContract Shipment api call, the api automatically update your account to make you pay the bill (via bashboard)

      - how/when to drop-off the package to be shipped?

        - after you create shippment api call, it gives you a link to print the shipment label. then, you paste the label on the package and drop-off at any post office.

          * if you don't have a printer, you can print the label at the post office.

      - should a company pay for returns or customer should?

        - it depends. so be creative to avoid negative net income.

          - Returns are one of the biggest pitfalls for e-commerce businesses because the costs can easily add up and hit your bottom line. But free shipping on returns is expected these days. As reported by Web Retailer, 88% of consumers surveyed rate free return shipping as “important” or “very important” to their purchase decisions. So, while not paying for return shipping might save you some cash, it could cost you customers.

          - If the cost of return shipping is too much for your business, get creative. For example, you could state in your return policy that you’ll pay for return shipping on orders over $50. This could encourage your customers to purchase a few extra items to bump themselves over the limit while ensuring that you aren’t spending more on return shipping than the value of the items.

          - ref: https://redstagfulfillment.com/best-practices-e-commerce-returns/#best-practices-for-returns
  
      - how to deal with delivery options? what is default value? DC (Delivery Confirmation)?

        - ??? maybe DC??? 

      - how to get return label manually?

        - do i need to register credit card/debit on Canada post developer program? i guess so otherwise, they cannot charge.

          - ref: (Personal Customer) https://www.canadapost-postescanada.ca/cpc/en/support/kb/at-the-post-office/services/returning-shipments-to-online-retailers
          - ref: https://prd11.wsl.canadapost.ca/cpc/en/business/shipping/returns/customer-return-policy.page?

          - maybe, I can ask my client to register this canada post program so that I can see the detail and how it implemented.

        - is it possible to do without above service (e.g., without registering)

          - maybe, customer can return items to senders.

          ref: https://www.canadapost-postescanada.ca/cpc/en/support/kb/receiving/general-information/can-i-refuse-delivery-of-a-parcel

      - how to calculate accurate rating cost & time when customers checkout??

        - i think it is impossible to calculate 100% accurate price, so that Canada Post allows us to send api request for rating with only weight (without dimension).

        - providing more info (e.g., dimension with weight) gives you more accurate shipping cost and time.

      - should I make international/usa shipment??

        - rating examples:

          - canada -> usa (48322 West Blomfield, MI)

            weight: 1.9 lbs 
            height: 15 cm
            width: 15 cm
            length: 15 cm

              - 

          - canada -> international (japan)

            weight: 1.9 lbs 
            height: 15 cm
            width: 15 cm
            length: 15 cm

        - maybe next version.

    - references:

      - how to measure your package? (e.g., length, weight, and width)

        - you need to calculate Height, Length, Width, Girth, and Weight of the box (includes the actual item).

        : https://prd10.wsl.canadapost.ca/cpc/en/support/kb/sending/general-information/how-to-use-find-a-rate

        : https://www.canadapost-postescanada.ca/tools/pg/4_Preparing/Prep_parcels-e.pdf

      - online ratings tool: https://prd10.wsl.canadapost.ca/information/app/far/business/findARate?execution=e1s1

    
# File

  1. FileWriter: FileWriter is the simplest way to write a file in Java. It provides overloaded write method to write int, byte array, and String to the File. You can also write part of the String or byte array using FileWriter. FileWriter writes directly into Files and should be used only when the number of writes is less.

  2. BufferedWriter: BufferedWriter is almost similar to FileWriter but it uses internal buffer to write data into File. So if the number of write operations is more, the actual IO operations are less and performance is better. You should use BufferedWriter when the number of write operations is more.

  3. FileOutputStream: FileWriter and BufferedWriter are meant to write text to the file but when you need raw stream data to be written into file, you should use FileOutputStream to write file in java.

  4. Files: Java 7 introduced Files utility class and we can write a file using its write function. Internally it’s using OutputStream to write byte array into file

  ref: https://www.journaldev.com/878/java-write-to-file

  ## Where to Store Uploaded File

    - don't store your app directory. it should be outside of your app.

    - see: https://stackoverflow.com/questions/18664579/recommended-way-to-save-uploaded-files-in-a-servlet-application

  ## Java.io.FileNotFoundException: tricky errors

    - there are various reasons which causes this error.

      - permission: make sure the directory is wriable (write permission) otherwise, you get this error.

# XML Library Criteria:

  - what criteria you need when choosing xml library?

    ## Streaming vs DOM

      - dom: create in-memory objects representing an entire document.

        - dynamically navigate to any element. => flexibility.

        - potentially large memory esp when xml is large => bad memory usage.

      - streaming: transmit and parse serially at application runtime. 

        - great performance. => process faster and less memory

        - can only see the state at one location at a time in the document. you need to know the xml structure beforehand. => less flexibility

    ## PUSH vs PULL

    - pull: client application calls when they need to access xml document

      - the client controlls the thread. 

      - simpler code & less source code & simple.

      - the client can read multiple documents at one time with a single thread.

    - push: the parser sends data to the client when they are ready.

      - the parser controlls the thread 

      - more complex.

# Refactoring

  ## Request Criteria

    - avoid nested Criteria and use its id and retrieve the target nested object in server side.

    - don't trust any data from client side. there is low possibility but data might be manipulated at the client side and it might change the value unexpectedly.

    - if you need to update, include data as criteria, but if you don't need to update, just include id or an array of id.

# Next Version

    - remvoe product_color table. it is totally useless and increase code base.

# Reverse Proxy With Nginx

  - if you use a reverse proxy (esp for single application system), you need to be careful about security such as cors, cookie access.

  ## Cookie Access

    - by default, cookie is not allowed you to access if cookie is cross domain.

    - you need to specify the 'domain' and 'path'.

      - For example, if Domain=mozilla.org is set, then cookies are available on subdomains like developer.mozilla.org.

      - ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent

