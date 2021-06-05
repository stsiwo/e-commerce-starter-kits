# Integration Testing

## What to Test

### Security

  - who can access to this endpoint?

### Functionality

  - GET

  - POST

  - PUT

  - PATCH

  - DELETE

    - how to make sure the deletion?

      - explicitly call repository/entitymanager and retrieve the number of records?


## Transactional seems not working.

  - when integ development with spa client, it causes errors even if all of integration (only backend) test passed.

    - i believe that this is because the test context does not persist any entity in database. Once test is done, the persistence context is rollback. therefore, you should be careful of db transaction stuff. you cannot really test the transaction stuff.

    - possible errors:

      - object references an unsaved transient instance - save the transient instance before flushing.        
