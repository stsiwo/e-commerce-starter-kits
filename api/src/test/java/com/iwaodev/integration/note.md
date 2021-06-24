# Integration Testing

## ResponseStatusException and MockMvc

  => does not assign the body when use ResponseStatusExcpetion.

    - you need to access its internal exception when testing:

      ```
      mvc.perform(get("/exception/{exception_id}", exceptionParam)
      .contentType(MediaType.APPLICATION_JSON))
      .andExpect(status().isBadRequest())
      .andExpect(result -> assertTrue(result.getResolvedException() instanceof BadArgumentsException))
      .andExpect(result -> assertEquals("bad arguments", result.getResolvedException().getMessage()));
      ```
    
    - ref: https://www.baeldung.com/spring-mvc-test-exceptions
    - reason: unittest vs integrationtest => MockMvc unitest is not enough to test error message (https://github.com/spring-projects/spring-boot/issues/7321)

## Transactional seems not working.

  - when integ development with spa client, it causes errors even if all of integration (only backend) test passed.

    - i believe that this is because the test context does not persist any entity in database. Once test is done, the persistence context is rollback. therefore, you should be careful of db transaction stuff. you cannot really test the transaction stuff.

    - possible errors:

      - object references an unsaved transient instance - save the transient instance before flushing.        
