# Infrastructure Model Note

## @GeneratedValue(strategy=GenerationType.IDENTITY) 

  - common error messages:
    - DATABASE_NAME.hibernate_sequence does not exist.

      - you are using GenerationType.AUTO or SEQUENCE, you can use IDENTITY instead. 

    - field XXX does not have default value.

      - if it is primary key like the above, you need it to be AI.
