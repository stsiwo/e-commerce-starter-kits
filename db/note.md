# Database 

## Env

  - init: no test data is populated (port 3306)

    - use for production and integtest of api

    - command) ./run-dev-db-container.sh -s init -p 3306

  - integ: test data is populated (port 3307)

    - use for integ development of api 

    - command) ./run-dev-db-container.sh -s integ -p 3307

## MySQL Docker 

### Commands
  - build: docker build --tag=ec-db .
    * under this directory
  - run: docker run --name ec-db-container -e MYSQL_DATABASE=ec-schema -e MYSQL_USER=sts -e MYSQL_PASSWORD=test_password -e MYSQL_ROOT_PASSWORD=test_password -p 3306:3306 -d ec-db
    * should specify MYSQL_DATABASE value to be 'ec-schema' which is the same as the schema in intial script (ec-db-script.sql) otherwise, this use (sts) can't access to the schema.
