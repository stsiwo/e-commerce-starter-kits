# MySQL Docker 

## Commands
  - build: docker build --tag=ec-db .
    * under this directory
  - run: docker run --name ec-db-container -e MYSQL_DATABASE=ec-schema -e MYSQL_USER=sts -e MYSQL_PASSWORD=sts1551@IWO -e MYSQL_ROOT_PASSWORD=sts1551@IWO -p 3306:3306 -d ec-db
    * should specify MYSQL_DATABASE value to be 'ec-schema' which is the same as the schema in intial script (ec-db-script.sql) otherwise, this use (sts) can't access to the schema.
