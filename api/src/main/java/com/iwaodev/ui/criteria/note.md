# Request Criteria Class

## Desc

  - use to map request params to POJO object.

## Request Param Validation

  - custom validation: https://www.baeldung.com/spring-validate-list-controller

  - basic: https://www.baeldung.com/spring-validate-requestparam-pathvariable 

  - validation annotation list: https://www.baeldung.com/javax-validation

## Tricky Errors

  ### MapStruct throws "NullPointerException" when nested object list mapping.

    - you need to initialize the list like below:

    ```
      @Valid
      private List<UserPhoneCriteria> phones = new ArrayList<>(); // <-- don't forget initialize this.
      
    ```

  
