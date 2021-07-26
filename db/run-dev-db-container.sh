#!/bin/bash

# you can add multiple container with diff stage at the same time, but you need to change its port otherwise, there is conflict.

# init: 3306 (spring-profile: integtest) integration test for spring 
# integ: 3307 (integ development with client spa) integration with spa

while getopts s:p: flag
do
    case "${flag}" in
        s) stage=${OPTARG};;
        p) port=${OPTARG};;
    esac
done

# clean up container 
docker container stop ec-db-container-$stage 

docker container rm ec-db-container-$stage

# build
docker build --tag=ec-db-$stage --target=$stage .

# run
docker run --name ec-db-container-$stage -e MYSQL_DATABASE=ec-schema -e MYSQL_USER=sts -e MYSQL_PASSWORD=test_password -e MYSQL_ROOT_PASSWORD=test_password -e MYSQL_TCP_PORT=$port -p $port:$port -d ec-db-$stage 
