FROM mysql:5.7.28
# using latest (8.x.x) mysql cause below error:
# mbind: Operation not permitted
# workaround: https://github.com/docker-library/mysql/issues/303
# - use older version


WORKDIR /
# copy external config to this image
COPY ./my.cnf /etc/mysql/my.cnf
# copy initial sql script to the directory in this image
COPY ./ec-db-script.sql /docker-entrypoint-initdb.d/ec-db-script.sql
