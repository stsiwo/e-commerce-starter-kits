FROM mysql:5.7.28 as init
# using latest (8.x.x) mysql cause below error:
# mbind: Operation not permitted
# workaround: https://github.com/docker-library/mysql/issues/303
# - use older version


WORKDIR /
# copy external config to this image
COPY ./my.cnf /etc/mysql/my.cnf
# copy initial sql script to the directory in this image
# NOTE: the scripts under the directory are executed in the alphabetic order!!!
COPY ./ec-db-script.sql /docker-entrypoint-initdb.d/a.sql


### for integ
FROM init as integ

WORKDIR /
# copy initial sql script to the directory in this image
# NOTE: the scripts under the directory are executed in the alphabetic order!!!
COPY ./integ-test-user-data.sql /docker-entrypoint-initdb.d/b.sql
COPY ./integ-test-category-data.sql /docker-entrypoint-initdb.d/c.sql
COPY ./integ-test-product-data.sql /docker-entrypoint-initdb.d/d.sql
COPY ./integ-test-cart-item-data.sql /docker-entrypoint-initdb.d/e.sql
COPY ./integ-test-wishlist-item-data.sql /docker-entrypoint-initdb.d/f.sql
COPY ./integ-test-order-data.sql /docker-entrypoint-initdb.d/g.sql


