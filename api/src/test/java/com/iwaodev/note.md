# Testing Note

## Code Coverage (JaCoCo)

  ### Configuration

  - you need to run this command) mvn clean jacoco:prepare-agent install jacoco:report

    - 'mvn test' command does not generate the report

  - also, don't forget to include its dependency in 'dependecies'

  - ref: https://stackoverflow.com/questions/36304793/jacoco-with-maven-missing-execution-data-file

## @Sql annotation

  ### Path

    - use 'classpath:<your_sql_file>.sql' and put <your_sql_file>.sql under test/resources/
    - need to study about this.

  ### Questions:

    - Does it rollback after each test case (method)?

## How to inject a value from test.properties to a value inside annotation

  - ex)
      @WithUserDetails( value = "${system.property.value-one}" ) 
        - is it possble to assign a value from test/application.properties to this value??
        - I don't know, but at least, @WithUserDetails( value = "${test.user.member.email}" ) does not work!!


## Spring Security (e.g., @WithMockUser, @WithUserDetails) with TestRestTemplate

  - does not work!! always give me access denied response even if I set @WithUserDetails.

    - I guess there is no connection with @WithUserDetails and TestRestTemplate

    - src why this does not work. i found several articles like this: https://stackoverflow.com/questions/40906909/withmockuser-doesnt-work-in-integration-test-spring-boot

  - possible solutions)

    1. setup authentication process before testing. ex) send POST with credentials and receive JWT token and set it when test with TestRestTemplate, or
  
      - 
      
    2. disable Spring Security at all.

      - https://stackoverflow.com/questions/31169720/disable-security-for-unit-tests-with-spring-boot/35192495#35192495

## MockMvc vs TestRestTemplate

  - TestRestTemplate uses standalone server to start the entire application and send requests to the server. 

  - MockMvc does not use a standalone server. instead, it mocks SErvlet API implementation (spring-test module).

  ### What Matters

    - when use @Sql scirpt for each test case with @SpringBootTest and TestRestTemplate, I couldn't retrieve the records run by the @Sql. my first assumption is that there is misunderstanding of transaction like isolation stuff. but it turns out that the test was running in a process and the standalone server was running on the different process so the records (e.g., @Sql) run by the test process couldn't be shared with the standalone server (my app); therefore, my app couldn't retrieve the uncommitted data.

  ### Solutions

    - my current solution: to run @SpringBootTest and use MockMvc (DON'T use TestRestTemplate) so that the standalone server can be run at the same process (e.g., test context) and I was able to retrieve the records run by @Sql. 

      - I'm not sure this is correct way to do this.

      - all real application context (including spring security) is used because of @SpringBootTest so you don't need to explicitly setup when using MockMvc

      refs:
        - https://stackoverflow.com/questions/29698291/spring-boot-webintegrationtest-and-testresttemplate-is-it-possible-to-rollbac/49862698#49862698
        - https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-vs-end-to-end-integration-tests
        - https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-server


## MockMvc

    ### Set Content Type if you use body!

    ```
      ResultActions resultActions = mvc.perform(MockMvcRequestBuilders
          .post(targetUrl)
          .contentType(MediaType.APPLICATION_JSON) <-- this
          .content(dummyUserSignupForm.toString())
          .accept(MediaType.APPLICATION_JSON)
          )
    ```

      - related errors:
          - Could not resolve parameter [0] in public org.springframework.http.ResponseEntity<com.mycompany.app.application.dto.user.UserDTO> com.mycompany.app.ui.controller.UserSignupController.index(com.mycompany.app.ui.criteria.UserSignupCriteria): Content type 'application/octet-stream' not supported.


## Tricky Error Messages

  ### "org.springframework.web.util.NestedServletException: Request processing failed; nested exception is java.lang.NullPointerException" and error code position is 'mvc.perform'.

    - you have an error at your code somewhere in controller, service, and repository. so debug the logic.
